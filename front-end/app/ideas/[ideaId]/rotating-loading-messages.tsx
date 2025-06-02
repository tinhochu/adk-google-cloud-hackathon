'use client'

import { useEffect, useState } from 'react'

export default function RotatingLoadingMessages({ messages }: { messages: string[] }) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [fade, setFade] = useState(true)

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
