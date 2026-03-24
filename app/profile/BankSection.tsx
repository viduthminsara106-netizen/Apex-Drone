'use client'

import { useState } from 'react'
import { Shield, Check, Edit2 } from 'lucide-react'
import styles from './Profile.module.css'
import { updateBankAction } from '@/app/profile/actions'

export function BankSection({ initialBank }: { initialBank: { name: string, holder: string, account: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [bank, setBank] = useState(initialBank)
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)
    const formData = new FormData()
    formData.append('bankName', bank.name)
    formData.append('bankHolder', bank.holder)
    formData.append('bankAccount', bank.account)

    const result = await updateBankAction(formData)
    if (result.success) {
      setIsEditing(false)
    }
    setLoading(false)
  }

  if (isEditing) {
    return (
      <div className={styles.bankCard}>
        <h4 style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} /> Edit Bank Info</span>
        </h4>
        <div className="input-group">
          <label style={{ fontSize: '0.8rem', color: '#666' }}>Bank Name</label>
          <input 
            type="text" 
            value={bank.name} 
            onChange={e => setBank({...bank, name: e.target.value})} 
            className="input-field" 
            style={{ padding: '8px', fontSize: '0.9rem' }}
          />
        </div>
        <div className="input-group">
          <label style={{ fontSize: '0.8rem', color: '#666' }}>Account Holder</label>
          <input 
            type="text" 
            value={bank.holder} 
            onChange={e => setBank({...bank, holder: e.target.value})} 
            className="input-field"
            style={{ padding: '8px', fontSize: '0.9rem' }}
          />
        </div>
        <div className="input-group">
          <label style={{ fontSize: '0.8rem', color: '#666' }}>Account Number</label>
          <input 
            type="text" 
            value={bank.account} 
            onChange={e => setBank({...bank, account: e.target.value})} 
            className="input-field"
            style={{ padding: '8px', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
          <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ padding: '10px' }}>
            <Check size={18} /> {loading ? 'Saving...' : 'Save Details'}
          </button>
          <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '10px', color: '#666', borderColor: '#ccc' }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.bankCard}>
      <h4 style={{ justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} /> බැංකු ගිණුම (Bank Account)</span>
        <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
          <Edit2 size={16} />
        </button>
      </h4>
      <div className={styles.bankDetail}>
        <span>බැංකුව (Bank)</span>
        <strong>{bank.name || 'Not Set'}</strong>
      </div>
      <div className={styles.bankDetail}>
        <span>හිමිකරු (Holder)</span>
        <strong>{bank.holder || 'Not Set'}</strong>
      </div>
      <div className={styles.bankDetail}>
        <span>ගිණුම (Account)</span>
        <strong>{bank.account || 'Not Set'}</strong>
      </div>
    </div>
  )
}
