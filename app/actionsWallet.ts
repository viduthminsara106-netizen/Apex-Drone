'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { join } from 'path'
import { writeFile } from 'fs/promises'

export async function depositAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const amount = parseFloat(formData.get('amount') as string)
  if (isNaN(amount) || amount <= 0) return { error: 'Invalid amount' }

  const file = formData.get('receipt') as File
  let receiptUrl = ''

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${session.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
    const filepath = join(process.cwd(), 'public', 'receipts', filename)
    // Ensure directory exists or ignore for simple local setup. Let's just put it in public directly to avoid mkdir issues
    const publicPath = join(process.cwd(), 'public', filename)
    await writeFile(publicPath, buffer)
    receiptUrl = `/${filename}`
  } else {
    return { error: 'රිසිට්පතක් අවශ්‍යයි (Receipt is required)' }
  }

  await prisma.transaction.create({
    data: {
      userId: session.id,
      type: 'DEPOSIT',
      amount,
      status: 'PENDING',
      receiptUrl
    }
  })

  revalidatePath('/')
  return { success: true }
}

export async function withdrawAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const amount = parseFloat(formData.get('amount') as string)
  if (isNaN(amount) || amount <= 0) return { error: 'Invalid amount' }

  if (amount % 100 !== 0) {
    return { error: 'ලබාගන්නා මුදල 100 හි ගුණාකාරයක් විය යුතුය (Amount must be a multiple of 100)' }
  }

  const bankName = formData.get('bankName') as string
  const bankAccount = formData.get('bankAccount') as string
  const bankHolder = formData.get('bankHolder') as string

  if (!bankName || !bankAccount || !bankHolder) {
    return { error: 'සියලු තොරතුරු ඇතුලත් කරන්න (Enter all details)' }
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user || user.balance < amount) return { error: 'ප්‍රමාණවත් ශේෂයක් නොමැත (Insufficient balance)' }

  // Deduct balance instantly
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      balance: user.balance - amount,
      bankName,
      bankAccount,
      bankHolder
    }
  })

  await prisma.transaction.create({
    data: {
      userId: session.id,
      type: 'WITHDRAW',
      amount,
      status: 'PENDING'
    }
  })

  revalidatePath('/')
  return { success: true }
}
