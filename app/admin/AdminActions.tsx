'use client'

import { approveTransaction, rejectTransaction } from '@/app/actionsAdmin'
import { useState } from 'react'
import { Check, X } from 'lucide-react'
import styles from './Admin.module.css'

export function AdminActions({ transactionId }: { transactionId: string }) {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    await approveTransaction(transactionId)
    setLoading(false)
  }

  const handleReject = async () => {
    setLoading(true)
    await rejectTransaction(transactionId)
    setLoading(false)
  }

  return (
    <div className={styles.actionButtons}>
      <button onClick={handleApprove} disabled={loading} className={styles.approveBtn}>
        <Check size={18} /> Approve
      </button>
      <button onClick={handleReject} disabled={loading} className={styles.rejectBtn}>
        <X size={18} /> Reject
      </button>
    </div>
  )
}
