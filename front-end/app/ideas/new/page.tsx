'use client'

import { createIdeaAction } from '@/actions/create-idea.action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { VoiceRecorder } from '@/components/voice-recorder'
import { TONES } from '@/constants'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, Loader2, Mic } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import type React from 'react'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function NewIdeaPage() {
  const { user } = useUser()
  const router = useRouter()
  const [formState, formAction, pending] = useActionState(createIdeaAction, { message: '' })
  const [inputMethod, setInputMethod] = useQueryState<'voice' | 'text'>('inputMethod', {
    history: 'replace',
    shallow: false,
    defaultValue: 'voice',
    parse: (v) => (v === 'text' ? 'text' : 'voice'),
    serialize: (v) => v,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agentStatus, setAgentStatus] = useState<{
    transcription: 'pending' | 'complete' | 'error'
    scriptAgent: 'pending' | 'running' | 'complete' | 'error'
  }>({
    transcription: 'pending',
    scriptAgent: 'pending',
  })
  const [textValue, setTextValue] = useState<string>('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [tone, setTone] = useState<string>('')
  const [platform, setPlatform] = useState<string>('')

  useEffect(() => {
    if (formState.status === 'success') {
      toast.success(formState.message)
      router.push(`/ideas/${formState.idea.id}`)
    } else if (formState.status === 'error') {
      toast.error(formState.message)
    }
  }, [formState.status, user, router])

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl">🎙️</span> New Content Idea
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      <form action={formAction}>
        <input type="hidden" name="userId" value={user?.id ?? ''} />
        <input type="hidden" name="prompt" value={textValue} />
        <input type="hidden" name="platform" value={platform} />
        <input type="hidden" name="tone" value={tone} />
        {/* Step Indicator */}
        <div className="mb-6">
          <h2 className="text-lg font-medium">Step 1: Record or paste your idea</h2>
        </div>

        {/* Input Methods */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={inputMethod === 'voice' ? 'default' : 'outline'}
              onClick={() => setInputMethod('voice')}
              className="flex-1 hover:cursor-pointer"
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Recorder
            </Button>
            <Button
              type="button"
              variant={inputMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setInputMethod('text')}
              className="flex-1 hover:cursor-pointer"
            >
              Text Input
            </Button>
          </div>

          {inputMethod === 'voice' ? (
            <Card>
              <CardContent className="p-6">
                <VoiceRecorder
                  setTextValue={setTextValue}
                  textValue={textValue}
                  isTranscribing={isTranscribing}
                  setIsTranscribing={setIsTranscribing}
                />
              </CardContent>
            </Card>
          ) : (
            <Textarea
              placeholder="Paste your content idea here..."
              className="min-h-[150px]"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          )}
        </div>

        {/* Optional Settings */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Optional:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select onValueChange={(value) => setPlatform(value)} name="platform">
                <SelectTrigger className="hover:cursor-pointer w-full">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiktok">
                    <div className="flex items-center gap-2">
                      <img src="/tiktok.svg" alt="TikTok" className="w-4 h-4" />
                      TikTok
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram">
                    <img src="/instagram.svg" alt="Instagram" className="w-4 h-4" />
                    Instagram
                  </SelectItem>
                  <SelectItem value="youtube">
                    <img src="/youtube.svg" alt="YouTube" className="w-4 h-4" />
                    YouTube Shorts
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => setTone(value)} name="tone">
                <SelectTrigger className="hover:cursor-pointer w-full">
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map(({ value, label }) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full mb-8 hover:cursor-pointer"
          disabled={isSubmitting || textValue.trim() === ''}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit Idea'
          )}
        </Button>

        {/* Agent Status */}
        {isSubmitting && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span>⏳</span> Agent Status:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                {agentStatus.transcription === 'complete' ? (
                  <Badge variant="success" className="mr-2">
                    ✅
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mr-2">
                    ⏳
                  </Badge>
                )}
                <span>Transcription {agentStatus.transcription === 'complete' ? 'complete' : 'pending'}</span>
              </div>
              <div className="flex items-center">
                {agentStatus.scriptAgent === 'running' ? (
                  <Badge variant="outline" className="mr-2 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mr-2">
                    ⏳
                  </Badge>
                )}
                <span>ScriptAgent {agentStatus.scriptAgent === 'running' ? 'running...' : 'pending'}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
