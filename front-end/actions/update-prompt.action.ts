'use server'

import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import { ideaQueue } from '@/queues/idea'
import { revalidatePath } from 'next/cache'

export async function updatePromptAction(prevState: any, formData: FormData) {
  try {
    const prompt = formData.get('prompt')
    const ideaId = formData.get('ideaId')

    await connectMongo()

    const ideaObject = await Idea.findByIdAndUpdate(ideaId, { prompt, status: 'pending' }, { new: true })

    if (!ideaObject) {
      return { idea: null, status: 'error', message: 'Idea not found' }
    }

    const idea = ideaObject.toJSON()

    //queue again the idea
    await ideaQueue.enqueue(idea)

    // revalidate the idea page
    revalidatePath(`/ideas/${ideaId}`)

    return { idea, status: 'success', message: 'Prompt updated successfully' }
  } catch (error) {
    console.error(error)
    return { idea: null, status: 'error', message: 'Failed to update prompt. Please try again.' }
  }
}
