'use client'

import { Home, Gift, Users, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.css'

export default function BottomNav() {
  const pathname = usePathname()
  
  // Do not show bottom nav on admin pages or login/register
  if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
    return null
  }

  const navItems = [
    { name: 'මුල් පිටුව', icon: Home, path: '/' }, // Home
    { name: 'ආයෝජන', icon: Gift, path: '/vip' }, // VIP/Invest
    { name: 'කණ්ඩායම', icon: Users, path: '/team' }, // Team
    { name: 'ගිණුම', icon: User, path: '/profile' } // Profile
  ]

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link href={item.path} key={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
            <item.icon size={24} className={styles.icon} />
            <span className={styles.navText}>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
