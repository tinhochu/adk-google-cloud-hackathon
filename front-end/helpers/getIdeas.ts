import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'
import { currentUser } from '@clerk/nextjs/server'

export const getIdeas = async ({ limit = 10, page = 0 }: { limit?: number; page?: number }) => {
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
  let query = Idea.find({ userId: userJSON.id }).sort({ createdAt: -1 })

  // If the limit is not -1, add the limit and skip to the query
  if (limit !== -1) {
    query = query.limit(limit).skip(page * limit)
  }

  const ideasObj = await query

  const ideas = ideasObj.map((idea: any) => idea.toJSON())

  return ideas
}
