'use client'

import { useState } from 'react'
import { buyVipAction } from '@/app/actionsVip'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

export function BuyButton({ vipLevel, price }: { vipLevel: number, price: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleBuy() {
    setLoading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('vipLevel', String(vipLevel))
    formData.append('price', String(price))
    
    const result = await buyVipAction(formData)
    if (result.error) {
      if (result.error === 'Insufficient balance') {
        router.push(`/deposit?amount=${price}`)
        return
      }
      setError(result.error)
      setTimeout(() => setError(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div>
      {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}
      <button onClick={handleBuy} disabled={loading} className={styles.btnBuy}>
        {loading ? 'Processing...' : 'Recharge'}
      </button>
    </div>
  )
}
