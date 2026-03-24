'use client'

import { useState, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import styles from './page.module.css'

export default function TelegramPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hasClosed = sessionStorage.getItem('telegram-popup-closed')
    if (!hasClosed) {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    sessionStorage.setItem('telegram-popup-closed', 'true')
  }

  if (!show) return null

  return (
    <div className={styles.popupOverlay} onClick={handleClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closePopupBtn} onClick={handleClose}>
          <X size={24} />
        </button>
        
        <div className={styles.telegramIcon}>
          <Send size={32} />
        </div>

        <h2>Join Official Channel</h2>
        <p>Stay updated with the latest drone investment tips, news, and exclusive offers on our Telegram channel.</p>

        <a 
          href="https://t.me/dronepaex" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.joinBtn}
          onClick={handleClose}
        >
          <Send size={18} />
          Join Now
        </a>
      </div>
    </div>
  )
}
