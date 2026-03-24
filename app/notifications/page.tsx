'use client'

import { useEffect, useState } from 'react'
import { getNotifications, markAsRead, markAllAsRead } from '@/app/actionsNotifications'
import styles from './Notifications.module.css'
import { Bell, CheckCircle, Clock } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    const res = await getNotifications()
    if (res.notifications) {
      setNotifications(res.notifications)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  if (loading) return <div className={styles.loader}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
         <div className={styles.titleArea}>
            <Bell size={24} className={styles.bellIcon} />
            <h2>දැනුම්දීම් (Notifications)</h2>
         </div>
         {notifications.some(n => !n.read) && (
           <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
             සියල්ල කියවූ ලෙස සලකුණු කරන්න
           </button>
         )}
      </div>

      <div className={styles.list}>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`${styles.item} ${n.read ? styles.read : styles.unread}`}
              onClick={() => !n.read && handleMarkAsRead(n.id)}
            >
              <div className={styles.itemHeader}>
                <span className={`${styles.type} ${styles[n.type.toLowerCase()]}`}>{n.type}</span>
                <span className={styles.time}><Clock size={12} /> {new Date(n.createdAt).toLocaleTimeString()}</span>
              </div>
              <h3 className={styles.itemTitle}>{n.title}</h3>
              <p className={styles.itemMessage}>{n.message}</p>
              {!n.read && <div className={styles.unreadDot} />}
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <Bell size={48} />
            <p>ඔබට තවමත් දැනුම්දීම් නැත.</p>
          </div>
        )}
      </div>
    </div>
  )
}
