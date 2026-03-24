'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import styles from './Team.module.css'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={handleCopy} className={styles.copyBtn}>
      {copied ? <Check size={20} color="#2e7d32" /> : <Copy size={20} color="var(--primary)" />}
    </button>
  )
}
