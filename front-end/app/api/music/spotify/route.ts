import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify client credentials')
    return NextResponse.json({ error: 'Missing Spotify client credentials' }, { status: 500 })
  }
  const { genres } = await req.json()

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error }, { status: response.status })
    }

    // Now we have the token, we can use it to fetch the music info
    const playlistResponse = await fetch(`https://api.spotify.com/v1/search?q=${genres.toLowerCase()}&type=playlist`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    })

    const playlistData = await playlistResponse.json()

    if (!playlistResponse.ok) {
      const error = await playlistResponse.json()
      return NextResponse.json({ error }, { status: playlistResponse.status })
    }

    if (playlistData.playlists.items.length === 0) {
      return NextResponse.json({ error: 'No playlists found' }, { status: 404 })
    }

    // get the playlist
    const playlist = playlistData.playlists.items[0]

    if (!playlist) {
      return NextResponse.json({ error: 'No playlist found' }, { status: 404 })
    }

    console.log({ playlist })

    // get the tracks
    const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist?.id}/tracks`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    })

    const tracksData = await tracksResponse.json()

    // if the response is not ok, return the error
    if (!tracksResponse.ok) {
      const error = await tracksResponse.json()
      return NextResponse.json({ error }, { status: tracksResponse.status })
    }

    // simplify the tracks data
    const simplifiedTracks = tracksData.items.map((item: any) => {
      const track = item.track
      return {
        name: track.name,
        artist: track.artists[0]?.name,
        album: track.album.name,
        albumImage: track.album.images[0]?.url,
        spotifyUrl: track.external_urls.spotify,
      }
    })

    return NextResponse.json({ data: { tracks: simplifiedTracks } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch token', details: String(err) }, { status: 500 })
  }
}
