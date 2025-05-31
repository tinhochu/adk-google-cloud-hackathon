import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import { ideaQueue } from '@/queues/idea'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // get the auth header
    const authHeader = request.headers.get('authorization')

    // if the auth header is not the cron secret, return an unauthorized error
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
      return new Response('Unauthorized', {
        status: 401,
      })

    // Connect to the database
    await connectMongo()

    // Get all ideas
    console.log('Checking ideas...')
    const ideas = await Idea.find({ status: 'pending' }).sort({ createdAt: -1 })

    // if there is no ideas, return
    if (!ideas || ideas.length === 0) {
      console.log('No ideas to check')
    }

    console.log(`Enqueuing ${ideas.length} ideas...`)
    // for each idea, check if the idea is older than 1 hour
    for (const idea of ideas) {
      const ideaData = idea.toJSON()
      await ideaQueue.enqueue(ideaData)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
