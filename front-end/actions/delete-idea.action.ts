'use server'

import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'
import { revalidatePath } from 'next/cache'

export async function deleteIdeaAction(prevState: any, formData: FormData) {
  try {
    await connectMongo()

    const user = await User.findOne({ clerkId: formData.get('userId') })
    const ideaId = formData.get('ideaId')

    if (!user) {
      return {
        message: 'User not found',
        status: 'error',
      }
    }

    // Delete the idea
    const idea = await Idea.findByIdAndDelete(ideaId)

    // Revalidate the ideas page
    revalidatePath('/ideas')

    return {
      message: 'Idea deleted successfully',
      status: 'success',
    }
  } catch (error) {
    console.error(error)
    return {
      message: 'Error creating idea',
    }
  }
}
