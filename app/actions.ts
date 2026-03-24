'use server'

import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function loginAction(formData: FormData) {
  const mobile = formData.get('mobile') as string
  const password = formData.get('password') as string

  if (!mobile || !password) {
    return { error: 'සියලුම තොරතුරු ඇතුළත් කරන්න' } // Enter all info
  }

  const user = await prisma.user.findUnique({
    where: { mobile }
  })

  // Hack to auto-create admin if it doesn't exist upon first login attempt
  if (!user && mobile === '12345678' && password === '12345678') {
    const hashedPassword = await bcrypt.hash('12345678', 10)
    await prisma.user.create({
      data: {
        mobile: '12345678',
        password: hashedPassword,
        role: 'ADMIN',
      }
    })
    const newUser = await prisma.user.findUnique({ where: { mobile: '12345678' } })
    const session = await encrypt({ id: newUser!.id, mobile: newUser!.mobile, role: newUser!.role })
    const cookieStore = await cookies()
    cookieStore.set('session', session, { httpOnly: true, path: '/' })
    return { success: true, redirect: '/admin' }
  }

  if (!user) {
    return { error: 'ගිණුමක් සොයාගත නොහැක' } // Account not found
  }

  if ((user as any).banned) {
    return { error: 'මෙම ගිණුම තහනම් කර ඇත (Account is Banned)' }
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return { error: 'මුරපදය වැරදියි' } // Password wrong
  }

  const session = await encrypt({ id: user.id, mobile: user.mobile, role: user.role })
  const cookieStore = await cookies()
  cookieStore.set('session', session, { httpOnly: true, path: '/' })

  return { success: true, redirect: user.role === 'ADMIN' ? '/admin' : '/' }
}

export async function registerAction(formData: FormData) {
  const mobile = formData.get('mobile') as string
  const password = formData.get('password') as string
  const referrerId = formData.get('referrerId') as string

  if (!mobile || !password) {
    return { error: 'සියලුම තොරතුරු ඇතුළත් කරන්න' }
  }

  const existing = await prisma.user.findUnique({ where: { mobile } })
  if (existing) {
    return { error: 'මෙම දුරකථන අංකය දැනටමත් ලියාපදිංචි කර ඇත' } // Number already registered
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Validate referrer
  let realReferrerId = null
  if (referrerId) {
    const referrer = await prisma.user.findUnique({ where: { id: referrerId } })
    if (referrer) realReferrerId = referrer.id
  }

  const user = await prisma.user.create({
    data: {
      mobile,
      password: hashedPassword,
      referrerId: realReferrerId,
      role: 'USER',
    }
  })

  const session = await encrypt({ id: user.id, mobile: user.mobile, role: user.role })
  const cookieStore = await cookies()
  cookieStore.set('session', session, { httpOnly: true, path: '/' })

  return { success: true, redirect: '/' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return { success: true }
}
