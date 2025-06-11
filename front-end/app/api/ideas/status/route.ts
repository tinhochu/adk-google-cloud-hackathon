import Idea from '@/models/Idea'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { ideaId } = await request.json()

    console.log('ideaId', ideaId)
    const idea = await Idea.findById(ideaId)

    if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 })

    return NextResponse.json({ status: idea.status }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: 'error', message: (error as Error).message }, { status: 500 })
  }
}
