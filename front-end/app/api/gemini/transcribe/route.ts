import { GoogleGenAI, createPartFromUri, createUserContent } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { audioUrl, name } = await request.json()
    const audioRes = await fetch(audioUrl)
    const audioBuffer = await audioRes.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' })

    const audioFile = await ai.files.upload({
      file: audioBlob,
      config: {
        mimeType: 'audio/mp3',
      },
    })

    if (!audioFile.uri) {
      throw new Error('Failed to upload audio file')
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([createPartFromUri(audioFile.uri!, audioFile.mimeType!), 'Transcribe this audio.']),
    })

    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Failed to transcribe audio')
    }

    console.log(`Transcription: ${response?.candidates?.[0]?.content.parts?.[0]?.text}`)
    return NextResponse.json({
      data: {
        transcription: response?.candidates?.[0]?.content.parts?.[0]?.text || '',
      },
    })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
  }
}
