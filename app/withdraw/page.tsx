import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WithdrawClient } from './WithdrawClient'

export default async function WithdrawPage() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { bankName: true, bankAccount: true, bankHolder: true }
  })

  const defaultBank = user ? {
    name: user.bankName || '',
    account: user.bankAccount || '',
    holder: user.bankHolder || ''
  } : undefined

  return <WithdrawClient defaultBank={defaultBank} />
}
