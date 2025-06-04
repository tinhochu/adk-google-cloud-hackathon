import { NextRequest, NextResponse } from 'next/server'

const clientId = process.env.SPOTIFY_CLIENT_ID!
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!

export async function POST(req: NextRequest) {
  if (!clientId || !clientSecret) {
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

    // get the playlist
    const playlist = playlistData.playlists.items[0]

    // get the tracks
    const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
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
    return NextResponse.json({ error: 'Failed to fetch token', details: String(err) }, { status: 500 })
  }
}
