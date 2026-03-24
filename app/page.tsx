import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from './page.module.css'
import { Wallet, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import HomeActions from './HomeActions'
import TelegramPopup from './TelegramPopup'

export default async function Home() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { transactions: { where: { type: 'UPGRADE' } } }
  })

  if (!user) return null

  const upgrades = user.transactions.map(t => ({
    amount: t.amount,
    activatedAt: t.createdAt.toISOString()
  }))

  return (
    <div className={styles.homeContainer}>
      <TelegramPopup />
      {/* Top Welcome Section */}
      <div className={styles.heroSection}>
        <div className={styles.welcomeText}>
          <p>ආයුබෝවන්, {user.mobile} 👋</p>
          <h2>ඔබේ ආයෝජන ගමන අරඹන්න</h2>
        </div>

        <div className={styles.balanceCard}>
          <div className={styles.balanceHeader}>
            <Wallet size={20} />
            <span>මුළු ශේෂය (Total Balance)</span>
          </div>
          <div className={styles.balanceAmount}>
            Rs {user.balance.toFixed(2)}
          </div>
        </div>

        <HomeActions upgrades={upgrades} />
      </div>

      <div className={styles.contentWrap}>
        {/* VIP Promotions Intro */}
        <div className={styles.promoSection}>
          <h3>🚀 විශේෂ ආයෝජන අවස්ථා</h3> {/* Special Investment Opportunities */}
          <div className={styles.promoCard}>
            <Image src="/vip1.png" alt="Drone Promo" width={100} height={100} className={styles.promoImg} />
            <div className={styles.promoDetails}>
              <h4>Apex VIP 1 ඩ්‍රෝන</h4>
              <p>දිනකට Rs 120 ලාභයක් (90 Days)</p>
              <Link href="/vip" className="btn-primary" style={{ padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Recharge
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Info */}
        <div className={styles.infoSection}>
          <h3>🛡️ අප ගැන (About Us)</h3>
          <Link href="/about" className={styles.infoCard}>
            <ShieldCheck size={32} color="var(--primary)" />
            <p>ApexDrone යනු ශ්‍රී ලංකාවේ ප්‍රමුඛතම ඩ්‍රෝන ආයෝජන වේදිකාවයි. නවීන තාක්ෂණයට ආයෝජනය කර ඉහල ප්‍රතිලාභ උපයා ගන්න. <strong>වැඩිදුර කියවන්න →</strong></p>
          </Link>
        </div>
      </div>
    </div>
  )
}
