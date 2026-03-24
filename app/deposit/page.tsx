'use client'

import { useState, useEffect, Suspense } from 'react'
import { depositAction } from '@/app/actionsWallet'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './Deposit.module.css'
import { AlertCircle, UploadCloud, Copy, Check } from 'lucide-react'

const bankAccounts = [
  {
    holder: 'Kumara',
    bank: 'DIALOG FINANCE PLC',
    accNo: '001021284929',
    branch: 'Head Office'
  },
  {
    holder: 'Nalin',
    bank: 'DIALOG FINANCE PLC',
    accNo: '001022368055',
    branch: 'Head Office'
  }
]

function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.copyWrapper} onClick={handleCopy}>
      <span>{text}</span>
      <button type="button" className={styles.copyBtnSm}>
        {copied ? <Check size={14} color="#2e7d32" /> : <Copy size={14} color="gray" />}
      </button>
    </div>
  )
}

function DepositContent() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bank, setBank] = useState(bankAccounts[0])
  const [autoAmount, setAutoAmount] = useState('')
  const [fileName, setFileName] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Randomly select one bank account
    const randomIndex = Math.floor(Math.random() * bankAccounts.length)
    setBank(bankAccounts[randomIndex])

    // Auto select amount if provided in URL (e.g. ?amount=1000)
    const urlAmt = searchParams.get('amount')
    if (urlAmt) setAutoAmount(urlAmt)
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await depositAction(formData)
    
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
          ✅ තැන්පතුව සාර්ථකව පද්ධතියට එක් කරන ලදී. අනුමත වන තෙක් රැඳී සිටින්න.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.depositBox}>
      <h3>🏦 තැන්පතු කිරීම</h3>
      
      <div className={styles.bankInstructions}>
        <p>කරුණාකර පහත ගිණුමට මුදල් තැන්පත් කරන්න <strong>(15min ඇතුළත)</strong>:</p>
        <div className={styles.accDetails}>
          <div className={styles.detailRow}>
            <span>Bank holder:</span>
            <CopyText text={bank.holder} />
          </div>
          <div className={styles.detailRow}>
            <span>Bank:</span>
            <CopyText text={bank.bank} />
          </div>
          <div className={styles.detailRow}>
            <span>ACC.NO:</span>
            <CopyText text={bank.accNo} />
          </div>
          <div className={styles.detailRow}>
            <span>Branch:</span>
            <span>{bank.branch}</span>
          </div>
        </div>
      </div>

      {error && <div className={styles.errorAlert}><AlertCircle size={18} /> {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>මුදල (Deposit Amount)</label>
          <input type="number" name="amount" defaultValue={autoAmount} className="input-field" placeholder="1000" min="1000" required />
        </div>
        
        <div className="input-group">
          <label>Upload Receipt</label>
          <div className={styles.uploadWrapper} style={fileName ? { borderColor: '#2e7d32', backgroundColor: '#e8f5e9' } : {}}>
            {fileName ? (
              <>
                <Check size={24} color="#2e7d32" />
                <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#2e7d32', fontWeight: 600 }}>{fileName}</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px', color: '#2e7d32' }}>Uploaded Successfully</p>
              </>
            ) : (
              <>
                <UploadCloud size={24} color="var(--primary)" />
                <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>Click to upload image</p>
              </>
            )}
            <input 
              type="file" 
              name="receipt" 
              accept="image/*" 
              className={styles.fileInput} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name)
                }
              }}
              required 
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      <div className={styles.depositNotice}>
        <h4>⚠️ වැදගත් (Notice):</h4>
        <ul>
          <li>1. Double-check that the bank details are correct.</li>
          <li>2. Minimum deposit amount is 1000 LKR.</li>
          <li>3. Deposits may take up to 24 hours to be successful.</li>
        </ul>
      </div>
    </div>
  )
}

export default function Deposit() {
  return (
    <Suspense fallback={<div className={styles.depositBox}>Loading...</div>}>
      <DepositContent />
    </Suspense>
  )
}
