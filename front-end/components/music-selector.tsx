'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, ExternalLink, Globe, Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

interface MusicOption {
  clip_id: string
  title: string
  author: string
  link: string
  country_code: string
  cover: string
  duration: number
  reason: string
}

interface MusicSelectorProps {
  musicOptions: MusicOption[]
  selectedMusic: MusicOption
  onSelectMusic: (music: MusicOption) => void
}

export function MusicSelector({ musicOptions, selectedMusic, onSelectMusic }: MusicSelectorProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const togglePlay = (clipId: string) => {
    // Stop all other audio
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause()
      }
    })

    if (playingId === clipId) {
      setPlayingId(null)
    } else {
      setPlayingId(clipId)
      // In a real app, you would play the actual audio file
      setTimeout(() => setPlayingId(null), 3000) // Simulate 3 second preview
    }
  }

  return (
    <div className="space-y-4">
      {musicOptions.map((music, index) => (
        <Card
          key={music.clip_id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedMusic.clip_id === music.clip_id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectMusic(music)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Album Cover */}
              <div className="relative flex-shrink-0">
                <img
                  src={music.cover || '/placeholder.svg'}
                  alt={music.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute inset-0 m-auto h-8 w-8 rounded-full p-0 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay(music.clip_id)
                  }}
                >
                  {playingId === music.clip_id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
              </div>

              {/* Music Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium truncate">{music.title}</h4>
                    <p className="text-sm text-muted-foreground">by {music.author}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      {music.country_code}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {music.duration}s
                    </Badge>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-muted/50 p-3 rounded-md mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    <strong>AI Insight:</strong> {music.reason}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay(music.clip_id)
                    }}
                  >
                    {playingId === music.clip_id ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Preview
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(music.link, '_blank')
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    TikTok
                  </Button>
                  {selectedMusic.clip_id === music.clip_id && <Badge className="ml-auto">Selected</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
