import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import styles from './Profile.module.css'
import { LogoutButton } from './LogoutButton'
import { Wallet, Shield, Hash, ArrowRightLeft, Send, ArrowRight } from 'lucide-react'
import { BankSection } from './BankSection'

export default async function Profile() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!user) return null

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerCard}>
        <div className={styles.avatar}>
          {user.mobile.substring(0, 2)}
        </div>
        <div className={styles.userInfo}>
          <h3>{user.mobile}</h3>
          <p>සාමාජික (Member)</p>
        </div>
        <div className={styles.vipBadge}>VIP {user.vipLevel}</div>
      </div>

      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <Wallet size={24} className={styles.icon} />
          <div>
            <span>ශේෂය (Balance)</span>
            <strong>Rs {user.balance.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <BankSection initialBank={{
        name: user.bankName || '',
        holder: user.bankHolder || '',
        account: user.bankAccount || ''
      }} />

      <a href="https://t.me/dronepaex" target="_blank" rel="noopener noreferrer" className={styles.telegramCard}>
        <div className={styles.telegramIconWrap}>
          <Send size={24} color="white" />
        </div>
        <div className={styles.telegramText}>
          <h4>Join Official Telegram</h4>
          <p>Get latest updates and support</p>
        </div>
        <ArrowRight size={20} style={{ marginLeft: 'auto', opacity: 0.5 }} />
      </a>

      <div className={styles.sectionTitle}>
        <ArrowRightLeft size={18} />
        <h4>මෑතකාලීන ගනුදෙනු (Recent Transactions)</h4>
      </div>

      <div className={styles.txList}>
        {user.transactions.length === 0 ? (
          <p className={styles.noData}>ගනුදෙනු නොමැත</p>
        ) : (
          user.transactions.map((tx: any) => (
            <div key={tx.id} className={styles.txCard}>
              <div className={styles.txType}>
                <span className={styles[tx.type.toLowerCase()]} />
                <h4>{tx.type}</h4>
                <small>{tx.createdAt.toLocaleDateString()}</small>
              </div>
              <div className={styles.txAmount}>
                <strong className={tx.type === 'WITHDRAW' ? styles.negative : styles.positive}>
                  {tx.type === 'WITHDRAW' ? '-' : '+'} Rs {tx.amount.toFixed(2)}
                </strong>
                <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()]}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.actions}>
        <LogoutButton />
      </div>
    </div>
  )
}
