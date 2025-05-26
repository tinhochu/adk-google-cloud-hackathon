import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongo()

    // Get the data from the request
    const data = await request.json()

    const cleaned = data.replace(/```json|```/g, '').trim()

    // Parse the data
    const realJson = JSON.parse(cleaned)

    // find the idea in the database
    const idea = await Idea.findById(realJson.idea_id)

    // if the idea is not found, return an error
    if (!idea) return NextResponse.json({ status: 'error', error_message: 'Idea not found' }, { status: 404 })

    // update the idea
    idea.generated_script = realJson.generated_script
    idea.generated_caption = realJson.generated_caption
    idea.generated_music = realJson.generated_music
    idea.status = 'completed'

    await idea.save()

    return NextResponse.json(
      {
        status: 'success',
        message: 'Idea updated successfully',
        data: realJson,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error Updating ideas:', error)
    return new Response(
      JSON.stringify({
        status: 'error',
        error_message: 'Error Updating ideas',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
