'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return { notifications }
}

export async function markAsRead(notificationId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  await prisma.notification.update({
    where: { id: notificationId, userId: session.id },
    data: { read: true }
  })

  revalidatePath('/notifications')
  return { success: true }
}

export async function markAllAsRead() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  await prisma.notification.updateMany({
    where: { userId: session.id, read: false },
    data: { read: true }
  })

  revalidatePath('/notifications')
  return { success: true }
}

export async function getUnreadNotificationsCount() {
  const session = await getSession()
  if (!session) return { count: 0 }

  const count = await prisma.notification.count({
    where: { userId: session.id, read: false }
  })

  return { count }
}
