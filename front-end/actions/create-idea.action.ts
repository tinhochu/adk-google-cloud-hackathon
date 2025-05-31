'use server'

import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'
import { ideaQueue } from '@/queues/idea'

export async function createIdeaAction(prevState: any, formData: FormData) {
  try {
    await connectMongo()

    const user = await User.findOne({ clerkId: formData.get('userId') })
    const platform = formData.get('platform')
    const tone = formData.get('tone')
    const prompt = formData.get('prompt')

    if (!user) {
      return {
        message: 'User not found',
        status: 'error',
      }
    }

    // Create the idea
    const ideaObject = await Idea.create({
      userId: user._id,
      platform,
      tone,
      prompt: `${prompt}. ${!tone || !platform ? 'Inherit the tone and platform from the prompt. and if its not available, make it sound like a normal video.' : `This will go on ${platform}. Make it sound ${tone}`}`,
    })

    // convert the idea to a JSON object
    const idea = ideaObject.toJSON()

    // add the idea to the queue
    await ideaQueue.enqueue(idea)

    return {
      message: 'Idea created successfully',
      status: 'success',
      idea,
    }
  } catch (error) {
    console.error(error)
    return {
      message: 'Error creating idea',
    }
  }
}
