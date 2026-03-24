'use client'

import { useState, Suspense } from 'react'
import { registerAction } from '@/app/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../login/Auth.module.css'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import DroneLogo from '@/components/Logo'

function RegisterContent() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await registerAction(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.success && result.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className={styles.authContainer}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.authBox}
      >
        <DroneLogo />
        <h2 className={styles.title}>නව ගිණුමක් සාදන්න</h2>
        
        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>දුරකථන අංකය (Mobile)</label>
            <input type="text" name="mobile" className="input-field" placeholder="07XXXXXXXX" required />
          </div>
          
          <div className="input-group">
            <label>මුරපදය (Password)</label>
            <input type="password" name="password" className="input-field" placeholder="******" required />
          </div>

          <div className="input-group">
            <label>ආරාධනා කේතය (Referral Code - Optional)</label>
            <input type="text" name="referrerId" defaultValue={ref} className="input-field" placeholder="කේතය ඇත්නම් ඇතුලත් කරන්න" />
          </div>

          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            {loading ? 'කරුණාකර රැඳී සිටින්න...' : 'ලියාපදිංචි වන්න'}
          </button>
        </form>

        <p className={styles.switchText}>
          දැනටමත් ගිණුමක් තිබේද? <Link href="/login">ලොග් වන්න</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function Register() {
  return (
    <Suspense fallback={<div className={styles.authContainer}>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
