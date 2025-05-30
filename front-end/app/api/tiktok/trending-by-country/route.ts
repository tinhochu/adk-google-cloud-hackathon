import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // get the music id from the request
    const { searchParams } = new URL(request.url)

    // get the music id from the request
    const country = searchParams.get('country')

    // if the music id is not provided, return an error
    if (!country) return Response.json({ error: 'Country is required' }, { status: 400 })

    // fetch the music info
    const response = await fetch(
      `https://${process.env.RAPID_API_TIKTOK_HOST}/api/trending/song?page=1&limit=10&period=7&rank_type=popular&country=${country}`,
      {
        headers: {
          'X-Rapidapi-Key': process.env.RAPID_API_KEY!,
          'X-Rapidapi-Host': process.env.RAPID_API_TIKTOK_HOST!,
          Host: process.env.RAPID_API_TIKTOK_HOST!,
        },
      }
    )

    // if the response is not ok, return the error
    if (!response.ok) return Response.json({ error: 'Failed to fetch music info' }, { status: 400 })

    // get the data
    const data = await response.json()

    // return the data
    return Response.json(data, { status: 200 })
  } catch (error) {
    // log the error
    console.error(error)

    // return the error
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
