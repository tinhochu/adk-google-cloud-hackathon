'use client'

import CountrySelector from '@/components/country-selector'
import { SpotifySuggestions } from '@/components/spotify-suggestions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import apiClient from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import { Loader2, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Define Song type for type safety
interface Song {
  clip_id: string
  id: string
  title: string
  author: string
  cover: string
  duration: number
}

interface MusicPlayerProps {
  music: Song[]
  guessCountry?: string
  genres?: string
}

export function MusicPlayer({ music, guessCountry = 'US', genres = 'Pop' }: MusicPlayerProps) {
  const [currentSong, setCurrentSong] = useState<Song>(music[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [country, setCountry] = useState<string>(guessCountry)
  const [topSongs, setTopSongs] = useState<Song[]>(music)
  const [isLoadingTopSongs, setIsLoadingTopSongs] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaWrapperRef = useRef<HTMLDivElement | null>(null)

  // Fetch audio URL for a song
  const fetchAudio = useCallback(async (musicId: string) => {
    const response = await apiClient.get(`/music?musicId=${musicId}&platform=tiktok`)
    return response.data?.musicInfo?.music.playUrl as string
  }, [])

  // Play a song (fetch audio if needed)
  const playSong = useCallback(
    async (song: Song) => {
      setIsLoading(true)
      setError(null)
      try {
        const url = await fetchAudio(song.clip_id)
        setAudioUrl(url)
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch((error) => {
                  setIsPlaying(false)
                  setError('Autoplay was prevented. Tap play to start.')
                })
            }
          }
        }, 0)
      } catch (e) {
        setError('Failed to load audio.')
      } finally {
        setIsLoading(false)
      }
    },
    [fetchAudio]
  )

  // Play/pause button handler
  const handlePlayPause = useCallback(async () => {
    setError(null)
    if (!isPlaying) {
      if (!audioUrl || audioRef.current?.src !== audioUrl) {
        await playSong(currentSong)
      } else {
        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false)
                setError('Autoplay was prevented. Tap play to start.')
              })
          }
        }
      }
    } else {
      setIsPlaying(false)
      audioRef.current?.pause()
    }
  }, [isPlaying, audioUrl, playSong, currentSong])

  // Reset audio state when currentSong changes
  useEffect(() => {
    setAudioUrl(null)
    setIsPlaying(false)
    setError(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [currentSong])

  // Play/pause audio element when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false)
            setError('Autoplay was prevented. Tap play to start.')
          })
        }
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, audioUrl])

  // Fetch top songs by country
  useEffect(() => {
    let cancelled = false
    if (country) {
      const fetchTopSongsByCountry = async () => {
        setIsLoadingTopSongs(true)
        setError(null)
        try {
          const response = await apiClient.get(`/tiktok/trending-by-country?country=${country}`)
          if (!cancelled) setTopSongs(response.data?.sound_list || music)
        } catch (error) {
          if (!cancelled) {
            setTopSongs(music)
            setError('Failed to load trending songs.')
          }
        } finally {
          if (!cancelled) setIsLoadingTopSongs(false)
        }
      }
      fetchTopSongsByCountry()
    }
    return () => {
      cancelled = true
    }
  }, [country, music])

  // Scroll to top of track list when topSongs change
  useEffect(() => {
    if (scrollAreaWrapperRef.current) {
      const scrollable = scrollAreaWrapperRef.current.querySelector(
        '[data-radix-scroll-area-viewport], .scroll-area-viewport, .your-scrollable-class'
      )
      if (scrollable) {
        ;(scrollable as HTMLDivElement).scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [topSongs])

  // Memoize current index for navigation
  const currentIndex = useMemo(
    () => topSongs.findIndex((song) => song.clip_id === currentSong.clip_id),
    [topSongs, currentSong]
  )

  // Previous/Next handlers
  const handlePrevious = useCallback(() => {
    if (topSongs.length === 0) return
    setCurrentSong(topSongs[(currentIndex - 1 + topSongs.length) % topSongs.length])
  }, [topSongs, currentIndex])

  const handleNext = useCallback(() => {
    if (topSongs.length === 0) return
    setCurrentSong(topSongs[(currentIndex + 1) % topSongs.length])
  }, [topSongs, currentIndex])

  // Song select handler
  const handleSongSelect = useCallback(
    (song: Song) => {
      setCurrentSong(song)
      playSong(song)
    },
    [playSong]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎼 Suggested Music</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tiktok">
          <TabsList>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
          </TabsList>
          <TabsContent value="tiktok">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <CountrySelector value={country} onValueChange={setCountry} isLoading={isLoadingTopSongs} />
              </div>
              {/* Left Section - Album Art and Controls */}
              <div className="col-span-1 flex flex-col">
                <div className="flex-1 flex flex-col gap-4">
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
                      disabled={isLoading || isLoadingTopSongs}
                      aria-label="Previous song"
                    >
                      <SkipBack className="h-12 w-12" />
                    </Button>
                    <Button
                      onClick={handlePlayPause}
                      variant="outline"
                      size="icon"
                      className="border-black border-2 hover:bg-white/10 h-16 w-16 rounded-full hover:cursor-pointer hover:scale-105 transition-all duration-300"
                      disabled={isLoading || isLoadingTopSongs}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
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
                      disabled={isLoading || isLoadingTopSongs}
                      aria-label="Next song"
                    >
                      <SkipForward className="h-12 w-12" />
                    </Button>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl || undefined}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: 'none' }}
                  />
                  {error && (
                    <div className="text-red-500 text-xs mt-2" role="alert">
                      {error}
                    </div>
                  )}
                </div>
              </div>
              {/* Right Section - Track Listing */}
              <div className="col-span-3">
                <div className="mb-5">
                  <h1 className="text-xl font-semibold mb-2 flex flex-col">
                    <span>{currentSong.title}</span>
                    <span className="text-gray-600 text-xs font-light leading-none">{currentSong.author}</span>
                  </h1>
                </div>
                <div className="space-y-1 relative">
                  <ScrollArea className="h-[300px] rounded-md border" ref={scrollAreaWrapperRef}>
                    <div role="list">
                      {topSongs.map((song, index) => (
                        <div
                          key={song?.clip_id || index}
                          onClick={() => handleSongSelect(song)}
                          className={cn(
                            'flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200',
                            currentSong.clip_id === song.clip_id && 'bg-gray-100'
                          )}
                          role="listitem"
                          tabIndex={0}
                          aria-current={currentSong.clip_id === song.clip_id}
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-semibold w-6">{index + 1}</span>
                            <span className={cn('text-black font-normal', currentSong.id === song.id && 'font-medium')}>
                              <div className="flex items-center leading-none">{song.title}</div>
                              <span className="text-gray-500 text-xs font-light leading-none">{song.author}</span>
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 font-light">{song.duration}s</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {isLoadingTopSongs && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="spotify">
            <SpotifySuggestions genres={genres} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
