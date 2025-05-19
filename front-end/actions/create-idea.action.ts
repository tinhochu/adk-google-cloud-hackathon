'use server'

import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'

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
      prompt,
    })

    const idea = ideaObject.toJSON()

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
