'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function approveTransaction(transactionId: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const tx = await prisma.transaction.findUnique({ where: { id: transactionId } })
  if (!tx || tx.status !== 'PENDING') return { error: 'Invalid transaction' }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'APPROVED' }
    })

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: tx.userId,
        title: tx.type === 'DEPOSIT' ? 'Deposit Approved ✅' : 'Withdrawal Approved ✅',
        message: `Your ${tx.type.toLowerCase()} of Rs ${tx.amount} has been approved.`,
        type: tx.type
      }
    })

    // If it's a deposit, handle balance and commissions
    if (tx.type === 'DEPOSIT') {
      // 1. Give money to the user who deposited
      await prisma.user.update({
        where: { id: tx.userId },
        data: { balance: { increment: tx.amount } }
      })

      // 2. Handle 3-level commissions
      const user = await prisma.user.findUnique({
        where: { id: tx.userId },
        include: { referrer: { include: { referrer: { include: { referrer: true } } } } }
      })

      if (user?.referrer) {
        const levels = [
          { referrer: user.referrer, percentage: 0.25, label: 'Level 1' },
          { referrer: user.referrer.referrer, percentage: 0.02, label: 'Level 2' },
          { referrer: user.referrer.referrer?.referrer, percentage: 0.01, label: 'Level 3' }
        ]

        for (const level of levels) {
          if (level.referrer) {
            const comAmount = tx.amount * level.percentage
            await prisma.user.update({
              where: { id: level.referrer.id },
              data: { balance: { increment: comAmount } }
            })
            await prisma.transaction.create({
              data: {
                userId: level.referrer.id,
                type: 'COMMISSION',
                amount: comAmount,
                status: 'APPROVED'
              }
            })
            // Create Commission Notification
            await prisma.notification.create({
              data: {
                userId: level.referrer.id,
                title: 'Referral Earnings 💰',
                message: `You earned Rs ${comAmount.toFixed(2)} from a ${level.label} referral deposit.`,
                type: 'COMMISSION'
              }
            })
          }
        }
      }
    }

  revalidatePath('/admin')
  return { success: true }
}

export async function rejectTransaction(transactionId: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const tx = await prisma.transaction.findUnique({ where: { id: transactionId } })
  if (!tx || tx.status !== 'PENDING') return { error: 'Invalid transaction' }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'REJECTED' }
  })

  if (tx.type === 'WITHDRAW') {
    await prisma.user.update({
      where: { id: tx.userId },
      data: { balance: { increment: tx.amount } }
    })
  }

  // Create Rejection Notification
  await prisma.notification.create({
    data: {
      userId: tx.userId,
      title: `${tx.type} Rejected ❌`,
      message: `Your ${tx.type.toLowerCase()} of Rs ${tx.amount} was rejected by admin.`,
      type: tx.type
    }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function updateUserBalance(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const userId = formData.get('userId') as string
  const amount = parseFloat(formData.get('amount') as string)

  if (!userId || isNaN(amount)) return { error: 'Invalid data' }

  await prisma.user.update({
    where: { id: userId },
    data: { balance: amount }
  })

  // Create Notification
  await prisma.notification.create({
    data: {
      userId,
      title: 'Balance Adjusted 💳',
      message: `Admin has updated your balance to Rs ${amount.toFixed(2)}.`,
      type: 'ADMIN'
    }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function updateUserVIP(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const userId = formData.get('userId') as string
  const vipLevel = parseInt(formData.get('vipLevel') as string)

  if (!userId || isNaN(vipLevel)) return { error: 'Invalid data' }

  await prisma.user.update({
    where: { id: userId },
    data: { vipLevel }
  })

  // Create Notification
  await prisma.notification.create({
    data: {
      userId,
      title: 'VIP Status Update 🏆',
      message: `Your VIP level has been updated to Level ${vipLevel}.`,
      type: 'ADMIN'
    }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function banUserAction(userId: string, status: boolean) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  await prisma.user.update({
    where: { id: userId },
    data: { banned: status }
  })
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteUserAction(userId: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  // Clean up relations
  await prisma.transaction.deleteMany({ where: { userId } })
  // For SQLite simple delete, just delete the user, ignore referrals nested complex for MVP or set them to null
  await prisma.user.updateMany({
    where: { referrerId: userId },
    data: { referrerId: null }
  })
  await prisma.user.delete({ where: { id: userId } })

  revalidatePath('/admin')
  return { success: true }
}

import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function impersonateUser(userId: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser) return { error: 'User not found' }

  const newSession = await encrypt({ id: targetUser.id, mobile: targetUser.mobile, role: targetUser.role })
  const cookieStore = await cookies()
  cookieStore.set('session', newSession, { httpOnly: true, path: '/' })

  return { success: true }
}
