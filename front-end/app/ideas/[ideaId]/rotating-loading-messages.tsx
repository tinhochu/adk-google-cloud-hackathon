'use client'

import { STATUS } from '@/constants'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

export default function RotatingLoadingMessages({ messages, ideaId }: { messages: string[]; ideaId: string }) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(function initPusher() {
    // Initialize Pusher
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

    if (!pusherKey || !pusherCluster) {
      console.error('Pusher key or cluster is not defined')
      return
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    })

    const channel = pusher.subscribe(`task-${ideaId}`)

    channel.bind('task.status.updated', (data: any) => {
      if (data.status === STATUS.COMPLETED) {
        window.location.reload()
      }
    })

    // Cleanup on unmount
    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`task-${ideaId}`)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
        setFade(true)
      }, 300) // duration of fade-out
    }, 2500)

    return () => clearInterval(interval)
  }, [messages])

  return (
    <span
      className={`text-lg text-muted-foreground transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
    >
      {messages[currentMessage]}
    </span>
  )
}
