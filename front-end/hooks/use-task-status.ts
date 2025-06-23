import apiClient from '@/lib/apiClient'
import { useEffect, useRef, useState } from 'react'

export function useTaskStatus(ideaId: string) {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchStatus = async () => {
      try {
        setLoading(true)
        const res = await apiClient.post('/ideas/status', { ideaId })
        if (isMounted) {
          setStatus(res.data.status)
        }
      } catch (e) {
        if (isMounted) {
          setStatus(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStatus()
    intervalRef.current = setInterval(fetchStatus, 5000)

    return () => {
      isMounted = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [ideaId])

  return { status, loading }
}
