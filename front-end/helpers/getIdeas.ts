import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'
import { currentUser } from '@clerk/nextjs/server'

export const getIdeas = async ({ limit = 10, page = 1 }: { limit?: number; page?: number }) => {
  // Get the current user
  const user = await currentUser()

  // If the user is not found, return an empty array
  if (!user) return []

  // Connect to the database
  await connectMongo()

  // Get the user from the database
  const mongoUser = await User.findOne({ clerkId: user.id })

  // If the user is not found, return an empty array
  if (!mongoUser) return []

  // Convert the user to a JSON object
  const userJSON = mongoUser.toJSON()

  // Get the user's ideas
  const ideasObj = await Idea.find({ userId: userJSON.id }).limit(limit).skip(page)
  const ideas = ideasObj.map((idea: any) => idea.toJSON())

  return ideas
}
