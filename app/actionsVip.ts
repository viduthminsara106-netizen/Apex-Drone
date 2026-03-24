'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function buyVipAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const targetVipLevel = parseInt(formData.get('vipLevel') as string)
  const price = parseFloat(formData.get('price') as string)

  const user = await prisma.user.findUnique({ 
    where: { id: session.id },
    include: { transactions: { where: { type: 'UPGRADE' } } }
  })
  
  if (!user) return { error: 'User not found' }

  // Check if this exact VIP was already bought by checking upgrade transactions
  const alreadyOwned = user.transactions.some((t: any) => t.amount === price)
  if (alreadyOwned) return { error: 'Already own this VIP package' }

  if (user.balance < price) return { error: 'Insufficient balance' }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      balance: user.balance - price,
      vipLevel: Math.max(user.vipLevel, targetVipLevel)
    }
  })

  // Log transaction
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'UPGRADE',
      amount: price,
      status: 'APPROVED'
    }
  })

  revalidatePath('/vip')
  return { success: true }
}
