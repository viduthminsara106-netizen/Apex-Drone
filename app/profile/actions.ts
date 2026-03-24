'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateBankAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const bankName = formData.get('bankName') as string
  const bankHolder = formData.get('bankHolder') as string
  const bankAccount = formData.get('bankAccount') as string

  if (!bankName || !bankHolder || !bankAccount) {
    return { error: 'Please fill in all details' }
  }

  await prisma.user.update({
    where: { id: session.id },
    data: {
      bankName,
      bankHolder,
      bankAccount
    }
  })

  revalidatePath('/profile')
  revalidatePath('/withdraw')
  return { success: true }
}
