'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import apiClient from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'

export function MusicPlayer({ music }: { music: any[] }) {
  const [currentSong, setCurrentSong] = React.useState(music[0])
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Fetch audio when play is pressed and not already loaded
  const fetchAudio = async (musicId: string) => {
    const response = await apiClient.get(`/tiktok/music?musicId=${musicId}`)
    return response.data?.musicInfo?.music.playUrl
  }

  // Refactored play logic
  const playSong = async (song: any) => {
    setIsLoading(true)
    try {
      const url = await fetchAudio(song.clip_id)
      setAudioUrl(url)
      // Try to play audio after setting URL
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                setIsPlaying(false)
                console.warn('Autoplay was prevented:', error)
              })
          }
        }
      }, 0)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPause = async () => {
    if (!isPlaying) {
      // If audio not loaded for current song, fetch it
      if (!audioUrl || audioRef.current?.src !== audioUrl) {
        await playSong(currentSong)
      } else {
        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                setIsPlaying(false)
                console.warn('Autoplay was prevented:', error)
              })
          }
        }
      }
    } else {
      setIsPlaying(false)
      audioRef.current?.pause()
    }
  }

  // When currentSong changes, reset audio state but do not autoplay
  React.useEffect(() => {
    setAudioUrl(null)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    // Do NOT autoplay here
  }, [currentSong])

  // Play/pause audio element when isPlaying changes
  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            setIsPlaying(false)
            console.warn('Autoplay was prevented:', error)
          })
        }
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, audioUrl])

  const handlePrevious = () => {
    const currentIndex = music.findIndex((song) => song.clip_id === currentSong.clip_id)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : music.length - 1
    setCurrentSong(music[previousIndex])
  }

  const handleNext = () => {
    const currentIndex = music.findIndex((song) => song.clip_id === currentSong.clip_id)
    const nextIndex = currentIndex < music.length - 1 ? currentIndex + 1 : 0
    setCurrentSong(music[nextIndex])
  }

  // handleSongSelect only sets currentSong
  const handleSongSelect = (song: (typeof music)[0]) => {
    setCurrentSong(song)

    playSong(song)
  }

  return (
    <Card>
      <CardContent className="grid grid-cols-4 gap-4">
        {/* Left Section - Album Art and Controls */}
        <div className="col-span-1 flex flex-col">
          {/* Album Art */}
          <div className="flex-1 flex  flex-col gap-4">
            <div className="overflow-hidden rounded-lg">
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src={currentSong.cover || '/placeholder.svg'}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                  width={384}
                  height={384}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="border-black border-2 hover:bg-white/10 h-12 w-12 rounded-full hover:cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <SkipBack className="h-12 w-12" />
              </Button>
              <Button
                onClick={handlePlayPause}
                variant="outline"
                size="icon"
                className="border-black border-2 hover:bg-white/10 h-16 w-16 rounded-full hover:cursor-pointer hover:scale-105 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full inline-block" />
                ) : isPlaying ? (
                  <Pause />
                ) : (
                  <Play />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="border-black border-2 hover:bg-white/10 h-12 w-12 rounded-full hover:cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <SkipForward className="h-12 w-12" />
              </Button>
            </div>
            {/* Audio element */}
            <audio
              ref={audioRef}
              src={audioUrl || undefined}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Right Section - Track Listing */}
        <div className="col-span-3">
          {/* Album Info */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold mb-2">{currentSong.title}</h1>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Reason:</span> {currentSong.reason}
            </p>
          </div>

          {/* Track List */}
          <div className="space-y-1">
            <ScrollArea className="h-[200px] rounded-md border">
              {music.map((song, index) => (
                <div
                  key={song?.clip_id || index}
                  onClick={() => handleSongSelect(song)}
                  className={cn(
                    'flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200',
                    currentSong.clip_id === song.clip_id && 'bg-gray-100'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-light w-6">{index + 1}</span>
                    <span className={cn('text-black font-normal', currentSong.id === song.id && 'font-medium')}>
                      {song.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-light">{song.duration}s</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
