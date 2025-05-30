'use client'

import { deleteIdeaAction } from '@/actions/delete-idea.action'
import { Button } from '@/components/ui/button'
import { Loader2, Trash } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

export default function DeleteIdeaButton({ ideaId, userId }: { ideaId: string; userId: string }) {
  const [formState, formAction, pending] = useActionState(deleteIdeaAction, { message: '', status: '' })

  useEffect(() => {
    if (formState.status === 'success') {
      toast.success(formState.message)
    } else if (formState.status === 'error') {
      toast.error(formState.message)
    }
  }, [formState.status])

  return (
    <form action={formAction}>
      <input type="hidden" name="ideaId" value={ideaId} />
      <input type="hidden" name="userId" value={userId} />
      <Button variant="destructive" type="submit" disabled={pending} className="hover:cursor-pointer">
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        {!pending && <Trash className="w-4 h-4" />}
        Delete Idea
      </Button>
    </form>
  )
}
