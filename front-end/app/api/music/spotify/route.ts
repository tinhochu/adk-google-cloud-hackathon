import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const client_id = process.env.SPOTIFY_CLIENT_ID!
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET!
  const { genre } = await request.json()

  if (!client_id || !client_secret)
    return NextResponse.json({ error: 'Missing Spotify client credentials' }, { status: 500 })

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id,
    client_secret,
  })

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error }, { status: response.status })
    }

    // get the access token
    const data = await response.json()
    const access_token = data.access_token

    // get the playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/search?q=${genre.toLowerCase()}&type=playlist`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!playlistResponse.ok) {
      const error = await playlistResponse.json()
      return NextResponse.json({ error }, { status: playlistResponse.status })
    }

    // get the playlist
    const playlistData = await playlistResponse.json()

    if (playlistData.playlists.items.length === 0) {
      return NextResponse.json({ error: 'No playlist found' }, { status: 404 })
    }

    const playlist = playlistData.playlists.items[0]

    // get the tracks
    const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!tracksResponse.ok) {
      const error = await tracksResponse.json()
      return NextResponse.json({ error }, { status: tracksResponse.status })
    }

    const tracksData = await tracksResponse.json()
    const tracks = tracksData.items

    return NextResponse.json({ data: tracks })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch token', details: String(err) }, { status: 500 })
  }
}
