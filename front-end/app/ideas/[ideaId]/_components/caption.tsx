'use client'

import GPTTypingEffect from '@/components/gpt-typing-effect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function Caption({ caption }: { caption: string }) {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success(`Caption copied`)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">📝 Caption & Hashtags</CardTitle>
        <Button variant="outline" size="sm" onClick={() => handleCopy(caption)}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Caption
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md">
          <GPTTypingEffect text={caption} />
        </div>
      </CardContent>
    </Card>
  )
}
