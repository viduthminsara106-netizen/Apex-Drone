import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { vipPackages } from '@/lib/constants'
import styles from './MyMiners.module.css'
import { Clock, Cpu } from 'lucide-react'
import { MyMinersClient } from './MyMinersClient'

export default async function MyMinersPage() {
  const session = await getSession()
  if (!session) return null

  const upgrades = await prisma.transaction.findMany({
    where: { userId: session.id, type: 'UPGRADE' },
    orderBy: { createdAt: 'desc' }
  })

  const ownedVips = upgrades.map(upg => {
    const pkg = vipPackages.find(p => p.price === upg.amount)
    return pkg ? { ...pkg, activatedAt: upg.createdAt.toISOString() } : null
  }).filter(Boolean) as (typeof vipPackages[0] & { activatedAt: string })[]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Cpu size={32} />
        <h1>මගේ මයිනර්ස් (My Active Miners)</h1>
      </div>

      <div className={styles.minerList}>
        {ownedVips.length > 0 ? (
          ownedVips.map((vip, idx) => (
            <div key={idx} className={styles.minerItem}>
                <img src={vip.image} alt={vip.name} className={styles.minerImg} />
                <div className={styles.minerDetails}>
                  <div className={styles.topInfo}>
                    <h3>{vip.name}</h3>
                    <span className={styles.runningBadge}>Running</span>
                  </div>
                  <p className={styles.profit}>Daily Profit: <strong>Rs {vip.profitDaily}</strong></p>
                  
                  <div className={styles.footerInfo}>
                    <div className={styles.infoRow}>
                       <span>Activated At:</span>
                       <span>{new Date(vip.activatedAt).toLocaleString()}</span>
                    </div>
                    <div className={styles.countdownRow}>
                        <span><Clock size={16} /> Next Profit In:</span>
                        <MyMinersClient activatedAt={vip.activatedAt} />
                    </div>
                  </div>
                </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <p>ඔබ සතුව තවමත් ක්‍රියාකාරී මයිනර් නොමැත.</p>
            <p>(You have no active miners yet)</p>
          </div>
        )}
      </div>
    </div>
  )
}
