'use client'

import { useState, useEffect } from 'react'

export function MyMinersClient({ activatedAt }: { activatedAt: string }) {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime()
      const start = new Date(activatedAt).getTime()
      const cycle = 24 * 60 * 60 * 1000
      const elapsed = now - start
      const remaining = cycle - (elapsed % cycle)

      const h = Math.floor(remaining / (1000 * 60 * 60))
      const m = Math.floor((remaining / (1000 * 60)) % 60)
      const s = Math.floor((remaining / 1000) % 60)
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [activatedAt])

  return <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{timeLeft}</strong>
}
