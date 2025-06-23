'use client'

import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import apiClient from '@/lib/apiClient'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Track {
  name: string
  artist: string
  album: string
  albumImage: string
  spotifyUrl: string
}

interface SpotifySuggestionsProps {
  genres: string
  playlistName?: string
}

export function SpotifySuggestions({ genres, playlistName = 'Spotify Suggestions' }: SpotifySuggestionsProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isFetched, setIsFetched] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTracks = async () => {
      setIsFetched(false)
      setLoading(true)

      try {
        const { data } = await apiClient.post('/music/spotify', { genres })

        if (data.error === 'playlist_not_found') {
          setTracks([])
          setIsFetched(true)
          return
        }

        setTracks(data.tracks)
      } catch (e) {
        setTracks([])
      }

      setLoading(false)
    }
    fetchTracks()
  }, [genres])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Playlist Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          <div className="relative group">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg bg-accent animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-24 bg-accent rounded mb-2 animate-pulse" />
            <div className="h-10 w-64 bg-accent rounded mb-4 animate-pulse" />
            <div className="h-4 w-16 bg-accent rounded animate-pulse" />
          </div>
        </div>
        {/* Tracks List Skeleton */}
        <Card className="">
          <div className="p-6">
            {/* Header */}
            <div className="grid grid-cols-11 gap-4 text-sm font-medium pb-2 border-b border-white/10">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6 md:col-span-5">TITLE</div>
              <div className="hidden md:block col-span-3">ALBUM</div>
            </div>
            <ScrollArea className="h-[300px] rounded-md">
              <div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-11 gap-4 py-3 items-center rounded-md border-b border-gray-200"
                  >
                    <div className="col-span-1 text-center">
                      <div className="h-4 w-4 bg-accent rounded animate-pulse mx-auto" />
                    </div>
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded animate-pulse" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-32 bg-accent rounded mb-1 animate-pulse" />
                        <div className="h-3 w-20 bg-accent rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="hidden md:block col-span-3">
                      <div className="h-4 w-24 bg-accent rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-center mt-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!tracks.length && isFetched) {
    return <div className="text-white p-8">No suggestions found.</div>
  }

  if (tracks.length === 0 && isFetched) {
    return <div className="text-white p-8">No suggestions found.</div>
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          <div className="relative group">
            <img
              src={tracks[0]?.albumImage || '/placeholder.svg?height=400&width=400'}
              alt={playlistName}
              className="w-48 h-48 md:w-64 md:h-64 rounded-lg shadow-2xl object-cover"
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2 opacity-80">PLAYLIST</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{playlistName}</h1>
            <p className="text-sm opacity-80">{tracks.length} songs</p>
          </div>
        </div>

        {/* Tracks List */}
        <Card className="">
          <div className="p-6">
            {/* Header */}
            <div className="grid grid-cols-11 gap-4 text-sm font-medium pb-2 border-b border-white/10">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6 md:col-span-5">TITLE</div>
              <div className="hidden md:block col-span-3">ALBUM</div>
            </div>

            {/* Track List */}
            <ScrollArea className="h-[300px] rounded-md">
              <div>
                {tracks.map((track, index) => (
                  <Link
                    href={track.spotifyUrl}
                    target="_blank"
                    key={track.spotifyUrl}
                    className="grid grid-cols-11 gap-4 py-3 items-center rounded-md transition-colors duration-200 border-b border-gray-200 hover:bg-[#1DB954] hover:cursor-pointer"
                  >
                    {/* Track Number / Play Button */}
                    <div className="col-span-1 text-center">
                      <span className=" transition-all duration-200 text-sm">{index + 1}</span>
                    </div>

                    {/* Track Info */}
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      <img src={track.albumImage} alt={track.album} className="w-10 h-10 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate transition-colors">{track.name}</p>
                        <p className="text-sm truncate">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="hidden md:block col-span-3">
                      <p className="text-sm truncate transition-colors">{track.album}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  )
}
