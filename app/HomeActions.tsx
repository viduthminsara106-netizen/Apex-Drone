'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpCircle, ArrowDownCircle, Cpu, Users, Info, Clock } from 'lucide-react'
import styles from './page.module.css'
import { vipPackages } from '@/lib/constants'
import Image from 'next/image'

function Countdown({ activatedAt }: { activatedAt: string }) {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime()
      const start = new Date(activatedAt).getTime()
      const cycle = 24 * 60 * 60 * 1000
      const elapsed = now - start
      const remaining = cycle - (elapsed % cycle)

      const h = Math.floor(remaining / (1000 * 60 * 60))
      const m = Math.floor((remaining / (1000 * 60)) % 60)
      const s = Math.floor((remaining / 1000) % 60)
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [activatedAt])

  return <span>{timeLeft}</span>
}

export default function HomeActions({ upgrades }: { upgrades: { amount: number, activatedAt: string }[] }) {
  return (
    <>
      <div className={styles.quickActions}>
        <Link href="/deposit" className={styles.actionBtn}>
          <div className={styles.iconWrapperDep}>
            <ArrowDownCircle size={28} />
          </div>
          <span>Recharge</span>
        </Link>
        <Link href="/withdraw" className={styles.actionBtn}>
          <div className={styles.iconWrapperWith}>
            <ArrowUpCircle size={28} />
          </div>
          <span>Withdraw</span>
        </Link>
        <Link 
          href="/my-miners" 
          className={styles.actionBtn} 
        >
          <div className={styles.iconWrapperMiner}>
             <Cpu size={28} />
          </div>
          <span>My Miner</span>
        </Link>
        <Link href="/team" className={styles.actionBtn}>
          <div className={styles.iconWrapperTeam}>
            <Users size={28} />
          </div>
          <span>Team</span>
        </Link>
        <Link href="/about" className={styles.actionBtn}>
          <div className={styles.iconWrapperAbout}>
            <Info size={28} />
          </div>
          <span>About Us</span>
        </Link>
      </div>
    </>
  )
}
