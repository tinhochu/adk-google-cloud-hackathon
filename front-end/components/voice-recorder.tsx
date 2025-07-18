'use client'

import AudioWave from '@/components/audio-wave'
import GPTTypingEffect from '@/components/gpt-typing-effect'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useUploadThing } from '@/hooks/use-uploadthing'
import apiClient from '@/lib/apiClient'
import { useUser } from '@clerk/nextjs'
import { Mic, Play, QuoteIcon, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function VoiceRecorder({
  setTextValue,
  isTranscribing,
  setIsTranscribing,
}: {
  setTextValue?: (value: string) => void
  textValue: string
  isTranscribing: boolean
  setIsTranscribing: (value: boolean) => void
}) {
  const { user } = useUser()
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { isUploading, startUpload } = useUploadThing('voiceUploader', {
    onBeforeUploadBegin(files) {
      return files.map((f) => new File([f], `${user?.id}-voice-${f.name}`, { type: f.type }))
    },
    onClientUploadComplete: () => {
      if (setTextValue && transcription !== null && transcription !== undefined) {
        setTextValue(transcription)
      }
    },
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState<string | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      // On data available, add the data to the audioChunksRef
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      // When the recording is stopped, create a file and pass it to the parent component
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        const audioFile = new File([audioBlob], `${user?.id}-voice-${Date.now()}.mp3`, { type: 'audio/mp3' })
        const url = URL.createObjectURL(audioFile)
        setAudioUrl(url)

        // Create audio element for playback
        const audio = new Audio(url)
        audioRef.current = audio

        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100)
          }
        })

        audio.addEventListener('ended', () => {
          setPlaying(false)
          setProgress(0)
        })

        handleUploadAndTranscribe(audioFile)
      }

      mediaRecorder.start()
      setRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return

    const newPosition = value[0]
    setProgress(newPosition)

    if (audioRef.current.duration) {
      audioRef.current.currentTime = (newPosition / 100) * audioRef.current.duration
    }
  }

  const handleUploadAndTranscribe = async (audioFile: File) => {
    setIsProcessing(true)
    try {
      // Upload the file
      const uploaded = await startUpload([audioFile])
      const fileUrl = uploaded?.[0]?.ufsUrl

      if (!fileUrl) throw new Error('Upload failed')

      setIsTranscribing(true)
      // Transcribe
      const { data } = await apiClient.post('/gemini/transcribe', {
        audioUrl: fileUrl,
        name: `${user?.id}-voice-${Date.now()}.mp3`,
      })

      if (data?.transcription) {
        setTranscription(data?.transcription)
        if (setTextValue) setTextValue(data?.transcription)
        setIsTranscribing(false)
      }
    } catch (err) {
      console.error('Upload/Transcription error:', err)
      setIsTranscribing(false)
    } finally {
      setIsProcessing(false)
      setIsTranscribing(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {isProcessing && (
        <div className="mb-4 text-center text-blue-500 animate-pulse">
          <AudioWave />
        </div>
      )}
      {!audioUrl ? (
        <>
          <div className="text-center mb-4">
            {recording ? (
              <div className="text-red-500 animate-pulse font-medium">Recording... {formatTime(recordingTime)}</div>
            ) : (
              <div className="text-muted-foreground">Click to start recording</div>
            )}
          </div>

          <div className="flex justify-center mb-4">
            {recording ? (
              <Button
                type="button"
                variant="destructive"
                size="lg"
                className="rounded-full h-16 w-16 flex items-center justify-center hover:cursor-pointer"
                onClick={stopRecording}
              >
                <Square className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-full h-16 w-16 flex items-center justify-center border-2 border-primary hover:bg-primary hover:text-primary-foreground hover:cursor-pointer"
                onClick={startRecording}
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 flex-shrink-0"
              onClick={togglePlayback}
            >
              {playing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="flex-grow">
              <Slider value={[progress]} max={100} step={1} onValueChange={handleSliderChange} />
            </div>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Recorded audio</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm text-primary hover:cursor-pointer"
              onClick={() => {
                setAudioUrl(null)
                setProgress(0)
                setTranscription(null)
                if (audioRef.current) {
                  audioRef.current.pause()
                }
              }}
            >
              Record again
            </Button>
          </div>
        </div>
      )}
      {transcription && (
        <div className="mt-4 p-2 bg-green-100 rounded text-sm text-center">
          <p className="font-bold">Transcription:</p>
          <div className="[&_p]:italic mt-3 flex items-center gap-2">
            <QuoteIcon className="w-4 h-4 rotate-180 -mt-3" fill="currentColor" />
            <GPTTypingEffect text={transcription} />
            <QuoteIcon className="w-4 h-4 -mt-3" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  )
}
