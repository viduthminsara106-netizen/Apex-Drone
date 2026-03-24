import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import styles from './page.module.css'
import { BuyButton } from './BuyButton'

import { vipPackages } from '@/lib/constants'

export default async function VIP() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({ 
    where: { id: session.id },
    include: { transactions: { where: { type: 'UPGRADE' } } }
  })
  if (!user) return null

  const ownedPrices = user.transactions.map((t: any) => t.amount)

  return (
    <div className={styles.vipContainer}>
      <div className={styles.balanceHeader}>
        <p>ශේෂය: <strong>Rs {user.balance.toFixed(2)}</strong></p>
        <p>ඔබගේ මට්ටම: <strong>VIP {user.vipLevel}</strong></p>
      </div>

      <div className={styles.packageList}>
        {vipPackages.map(pkg => {
          const isOwned = ownedPrices.includes(pkg.price) || (user.vipLevel >= pkg.level && user.vipLevel !== 0 && !ownedPrices.length && pkg.level === user.vipLevel); // Fallback for manual admin override logic
          return (
            <div key={pkg.level} className={styles.packageCard}>
              <img src={pkg.image} alt={pkg.name} className={styles.img} style={{ width: 100, height: 100 }} />
              <div className={styles.details}>
                <h3>{pkg.name}</h3>
                <p>Recharge: Rs {pkg.price}</p>
                <p>Duration: {pkg.duration} Days</p>
                <p className={styles.profitText}>Daily Profit: Rs {pkg.profitDaily}</p>
                
                {isOwned ? (
                  <button className={styles.btnOwned} disabled>Owned</button>
                ) : (
                  <BuyButton vipLevel={pkg.level} price={pkg.price} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
