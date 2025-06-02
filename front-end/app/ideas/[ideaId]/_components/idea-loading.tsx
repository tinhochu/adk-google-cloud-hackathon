import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { GoogleGenAI } from '@google/genai'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

import RotatingLoadingMessages from '../rotating-loading-messages'

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
})

export default async function IdeaLoading({ prompt, ideaId }: { prompt: string; ideaId: string }) {
  let messages: string[] = []
  const fallbackMessages = [
    'Loading your idea...',
    'Generating creative sparks...',
    'Almost there!',
    'Thinking outside the box...',
    'Gathering inspiration...',
    'Shaping your thoughts...',
    'Fueling innovation...',
    'Connecting the dots...',
    'Refining your idea...',
    'Finalizing details...',
  ]
  try {
    const response = await gemini.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: `With this prompt ${prompt}, generate an array of 10 sentences that are related to the prompt that serves as loading messages. do not generate script, just the sentences. you can use the following format:
[
  "Sentence 1",
  "Sentence 2",
  ...
]
`,
    })
    messages = JSON.parse(response.text?.replace(/```json\n|```/g, '') ?? '[]')
    if (!Array.isArray(messages) || messages.length === 0) {
      messages = fallbackMessages
    }
  } catch {
    messages = fallbackMessages
  }

  return (
    <div className="w-full mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-8">
        <Link href="/ideas">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ideas
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Skeleton className="w-32 h-[30px]" />
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 relative">
        <div className="absolute top-0 left-0 w-full h-full  z-10">
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <RotatingLoadingMessages ideaId={ideaId} messages={messages} />
          </div>
        </div>
        <div className="col-span-3 space-y-4">
          <Skeleton className="w-full min-h-48" />
          <Skeleton className="w-full min-h-48" />
          <Skeleton className="w-full min-h-48" />
        </div>

        <div className="col-span-1 space-y-4">
          <Skeleton className="w-full min-h-96" />
          <Skeleton className="w-full min-h-24" />
        </div>
      </div>
    </div>
  )
}
