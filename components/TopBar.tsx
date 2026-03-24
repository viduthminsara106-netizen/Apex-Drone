'use client'

import { Bell, ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUnreadNotificationsCount } from '@/app/actionsNotifications'
import styles from './TopBar.module.css'

export default function TopBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
       const res = await getUnreadNotificationsCount()
       if (typeof res.count === 'number') setUnreadCount(res.count)
    }
    fetchCount()
  }, [pathname])

  const isHome = pathname === '/'
  const isAuth = pathname === '/login' || pathname === '/register'

  if (isAuth) return null

  // Title mappings
  let title = 'ApexDrone'
  if (pathname === '/vip') title = 'ආයෝජන පැකේජ' // Investment Packages
  if (pathname === '/team') title = 'මගේ කණ්ඩායම' // My Team
  if (pathname === '/profile') title = 'මගේ ගිණුම' // My Account
  if (pathname === '/my-miners') title = 'මගේ මයිනර්ස්' // My Miners
  if (pathname === '/deposit') title = 'තැන්පතු කිරීම' // Deposit
  if (pathname === '/withdraw') title = 'මුදල් ලබා ගැනීම' // Withdraw
  if (pathname === '/notifications') title = 'දැනුම්දීම්' // Notifications
  if (pathname === '/about') title = 'අප ගැන' // About Us
  if (pathname.startsWith('/admin')) title = 'පරිපාලක පැනලය' // Admin Panel

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        {!isHome && (
          <button className={styles.backButton} onClick={() => router.back()}>
            <ArrowLeft size={24} color="white" />
          </button>
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>
        {isHome && (
          <Link href="/notifications" className={styles.bellWrapper}>
            <Bell size={24} color="white" />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>
        )}
      </div>
    </header>
  )
}
