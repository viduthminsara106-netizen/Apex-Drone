import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/')
  }

  // Fetch all users with basic transaction stats
  const usersRaw = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      referrer: true,
      transactions: {
        orderBy: { createdAt: 'desc' }
      },
      referrals: { // Level 1
        include: {
          referrals: { // Level 2
            include: {
              referrals: true // Level 3
            }
          }
        }
      }
    }
  })

  const users = usersRaw.map(u => ({
    ...u,
    totalCommissions: u.transactions.filter((t: any) => t.type === 'COMMISSION').reduce((acc, t) => acc + t.amount, 0)
  }))

  // Fetch all deposits
  const allDeposits = await prisma.transaction.findMany({
    where: { type: 'DEPOSIT' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  // Fetch all withdrawals
  const allWithdraws = await prisma.transaction.findMany({
    where: { type: 'WITHDRAW' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <AdminClient 
      users={users} 
      deposits={allDeposits} 
      withdrawals={allWithdraws} 
    />
  )
}
