'use client'

import { updatePromptAction } from '@/actions/update-prompt.action'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Pencil } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function PromptUpdater({ ideaId, initialPrompt }: { ideaId: string; initialPrompt: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [prompt, setPrompt] = useState(initialPrompt)
  const [formState, formAction, pending] = useActionState(updatePromptAction, { idea: null, status: '', message: '' })

  useEffect(() => {
    if (formState.status === 'success') {
      console.log('success')
      toast.success(formState.message)
      setIsEditing(false)
    } else if (formState.status === 'error') {
      toast.error(formState.message)
      setIsEditing(true)
    }
  }, [formState])

  return (
    <div className="relative">
      {isEditing ? (
        <form action={formAction}>
          <input type="hidden" name="ideaId" value={ideaId} />
          <Textarea
            name="prompt"
            placeholder="Type your prompt here..."
            className="w-full min-h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={pending} className="mt-4 hover:cursor-pointer">
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Prompt'
            )}
          </Button>
        </form>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 hover:cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <div className="bg-muted p-4 rounded-md italic">
            <p>{prompt}</p>
          </div>
        </>
      )}
    </div>
  )
}
