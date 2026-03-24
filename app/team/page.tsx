import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import styles from './Team.module.css'
import { CopyButton } from './CopyButton'
import { TeamTabs } from './TeamTabs'

export default async function Team() {
  const session = await getSession()
  if (!session) return null

  // Fetch up to 3 levels recursively with their deposit totals
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      referrals: {
        include: {
          transactions: { where: { type: 'DEPOSIT', status: 'APPROVED' } },
          referrals: {
            include: {
              transactions: { where: { type: 'DEPOSIT', status: 'APPROVED' } },
              referrals: {
                include: {
                  transactions: { where: { type: 'DEPOSIT', status: 'APPROVED' } }
                }
              }
            }
          }
        }
      }
    }
  })

  if (!user) return null

  const commissionData = await prisma.transaction.aggregate({
    where: { userId: session.id, type: 'COMMISSION' },
    _sum: { amount: true }
  })
  const totalEarned = commissionData._sum.amount || 0

  const calculateUserDeposit = (u: any) => u.transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0)

  const l1 = user.referrals.map((u: any) => ({ ...u, deposit: calculateUserDeposit(u) }))
  const l2 = l1.flatMap((u: any) => u.referrals.map((ru: any) => ({ ...ru, deposit: calculateUserDeposit(ru) })))
  const l3 = l2.flatMap((u: any) => u.referrals.map((ru: any) => ({ ...ru, deposit: calculateUserDeposit(ru) })))

  const shareLink = `http://localhost:3000/register?ref=${user.id}`

  return (
    <div className={styles.teamContainer}>
      <div className={styles.earningsCard}>
        <span>මුළු කොමිස් මුදල (Total Commission)</span>
        <strong>Rs {totalEarned.toFixed(2)}</strong>
      </div>

      <div className={styles.shareCard}>
        <h3>🔗 ඔබේ ආරාධනා සබැඳිය (Share Link)</h3>
        <p>ඔබගේ යහළුවන්ට ආරාධනා කර ත්‍යාග ලබා ගන්න.</p>
        <div className={styles.linkBox}>
          <input type="text" readOnly value={shareLink} className="input-field" />
          <CopyButton text={shareLink} />
        </div>

        <div className={styles.ratesGrid}>
          <div className={styles.rateItem}>
            <span>Level 1</span>
            <strong>25%</strong>
          </div>
          <div className={styles.rateItem}>
            <span>Level 2</span>
            <strong>2%</strong>
          </div>
          <div className={styles.rateItem}>
            <span>Level 3</span>
            <strong>1%</strong>
          </div>
        </div>
      </div>

      <div className={styles.statsCard}>
        <div className={styles.statBox}>
          <span>L1 Members</span>
          <strong>{l1.length}</strong>
        </div>
        <div className={styles.statBox}>
          <span>L2 Members</span>
          <strong>{l2.length}</strong>
        </div>
        <div className={styles.statBox}>
          <span>L3 Members</span>
          <strong>{l3.length}</strong>
        </div>
      </div>

      <TeamTabs l1={l1} l2={l2} l3={l3} />
    </div>
  )
}
