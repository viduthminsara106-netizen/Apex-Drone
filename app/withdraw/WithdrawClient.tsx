'use client'

import { useState } from 'react'
import { withdrawAction } from '@/app/actionsWallet'
import { useRouter } from 'next/navigation'
import styles from '../deposit/Deposit.module.css'
import { AlertCircle } from 'lucide-react'

export function WithdrawClient({ defaultBank }: { defaultBank?: { name: string, account: string, holder: string } }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await withdrawAction(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push('/'), 2000)
    }
  }

  if (success) {
    return (
      <div className={styles.depositBox}>
        <div className={styles.successAlert}>
          ✅ මුදල් ලබාගැනීමේ ඉල්ලීම සාර්ථකව යොමු කරන ලදී. අනුමත වන තෙක් රැඳී සිටින්න.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.depositBox}>
      <h3>🏦 මුදල් ලබාගැනීම් (Withdraw)</h3>
      
      {error && <div className={styles.errorAlert}><AlertCircle size={18} /> {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>ලබාගන්නා මුදල (Amount in Rs)</label>
          <input type="number" name="amount" className="input-field" placeholder="1000" min="500" required />
        </div>
        
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#666' }}>තෝරාගත් බැංකු ගිණුම (Selected Bank Account)</h4>
        
        {defaultBank?.name ? (
          <div className={styles.boundBankCard}>
             <div className={styles.boundBankInfo}>
                <h4>{defaultBank.name}</h4>
                <p>{defaultBank.holder}</p>
                <p>{defaultBank.account}</p>
             </div>
             <button type="button" onClick={() => router.push('/profile')} className={styles.changeBankBtn}>Change</button>
             
             {/* Hidden fields for server action compatibility */}
             <input type="hidden" name="bankName" value={defaultBank.name} />
             <input type="hidden" name="bankAccount" value={defaultBank.account} />
             <input type="hidden" name="bankHolder" value={defaultBank.holder} />
          </div>
        ) : (
          <div className={styles.errorAlert} style={{ background: '#fff3e0', color: '#e65100', borderColor: '#ffe0b2' }}>
             මුලින්ම ඔබේ බැංකු ගිණුම සම්බන්ධ කරන්න. (Please bind your bank account first.)
             <button type="button" onClick={() => router.push('/profile')} className={styles.changeBankBtn} style={{ background: '#e65100', color: '#fff' }}>Bind Now</button>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading || !defaultBank?.name}>
          {loading ? 'කරුණාකර රැඳී සිටින්න...' : 'ඉල්ලීම යවන්න (Withdraw)'}
        </button>
      </form>

      <div className={styles.noticeSection}>
        <h4><AlertCircle size={20} /> විශේෂ දැනුම්දීම (Notice)</h4>
        <ul>
          <li>ඔබේ බැංකු තොරතුරු නිවැරදි දැයි දෙවරක් පරීක්ෂා කරන්න. (Double-check that your bank details are correct.)</li>
          <li>ඔබ ලබාගන්නා මුදල 100 හි ගුණාකාරයක් විය යුතුය. (Your withdrawal amount must be a multiple of 100.)</li>
          <li>මුදල් ආපසු ලබා ගැනීමට නම්, අනිවාර්යයෙන්ම VIP පැකේජයක් මිලදී ගෙන තිබිය යුතුය. (To get a refund/withdraw, it is mandatory to purchase a VIP package.)</li>
          <li>මුදල් ලබාගැනීම් සාර්ථක වීමට පැය 24ක් දක්වා කාලයක් ගත විය හැක. (Withdrawals may take up to 24 hours to be successful.)</li>
          <li>මුදල් ලබාගැනීමේ ගාස්තුව 20% කි. (Withdraw fee 20%.)</li>
        </ul>
      </div>
    </div>
  )
}
