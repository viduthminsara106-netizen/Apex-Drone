'use client'

import { useState } from 'react'
import { loginAction } from '@/app/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Auth.module.css'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import DroneLogo from '@/components/Logo'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.authBox}
      >
        <DroneLogo />
        <h2 className={styles.title}>ඔබගේ ගිණුමට ලොග් වන්න</h2> {/* Log in to your account */}
        
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

          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            {loading ? 'කරුණාකර රැඳී සිටින්න...' : 'ලොග් වන්න'} {/* Please wait / Log in */}
          </button>
        </form>

        <p className={styles.switchText}>
          ගිණුමක් නොමැතිද? <Link href="/register">ලියාපදිංචි වන්න</Link> {/* No account? Register */}
        </p>
      </motion.div>
    </div>
  )
}
