'use client'

import GPTTypingEffect from '@/components/gpt-typing-effect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy } from 'lucide-react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'

function CaptionLoading() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">📝 Caption & Hashtags</CardTitle>
        <Button variant="outline" size="sm" disabled>
          <Copy className="h-4 w-4 mr-2" />
          Copy Caption
        </Button>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-md space-y-3">
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full mb-4" />
        </div>
      </CardContent>
    </Card>
  )
}

function Caption({ caption, gptEffect = true }: { caption: string; gptEffect?: boolean }) {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success(`Caption copied`)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">📝 Caption & Hashtags</CardTitle>
        <Button variant="outline" size="sm" onClick={() => handleCopy(caption)} className="hover:cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          Copy Caption
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md">
          {gptEffect ? <GPTTypingEffect text={caption} isMarkdown={true} /> : <Markdown>{caption}</Markdown>}
        </div>
      </CardContent>
    </Card>
  )
}

export { Caption, CaptionLoading }
