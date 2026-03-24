'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { approveTransaction, rejectTransaction, updateUserBalance, updateUserVIP, banUserAction, deleteUserAction, impersonateUser } from '@/app/actionsAdmin'
import styles from './Admin.module.css'
import { Users, ArrowDownCircle, ArrowUpCircle, Search, RefreshCcw, X, History, Network, Pencil, Crown, Save } from 'lucide-react'

// ──────────────── Types ────────────────
interface Tx { id: string; type: string; amount: number; status: string; notes?: string; createdAt: string }
interface Ref { id: string; mobile: string; vipLevel: number; balance: number; referrals?: Ref[] }
interface User {
  id: string; mobile: string; role: string; banned: boolean; balance: number; vipLevel: number
  referrer?: { mobile: string }
  totalCommissions: number
  transactions: Tx[]
  referrals: Ref[]
}

// ──────────────── Transaction Modal ────────────────
function TxModal({ user, onClose }: { user: User; onClose: () => void }) {
  const typeLabel: Record<string, string> = {
    DEPOSIT: 'Deposit', WITHDRAW: 'Withdrawal', PROFIT: 'Daily Profit',
    COMMISSION: 'Referral Earn', UPGRADE: 'VIP Upgrade'
  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Transaction History - {user.mobile}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.modalTable}>
          <div className={`${styles.tableRow} ${styles.tableHead}`}>
            <span>Type</span><span>Amount</span><span>Status</span><span>Notes</span><span>Date</span>
          </div>
          {user.transactions.length > 0 ? user.transactions.map(tx => {
            const isPos = ['DEPOSIT', 'PROFIT', 'COMMISSION'].includes(tx.type)
            return (
              <div key={tx.id} className={styles.tableRow}>
                <span>{typeLabel[tx.type] ?? tx.type}</span>
                <span className={isPos ? styles.amtPos : styles.amtNeg}>
                  {isPos ? '+' : '-'}{tx.amount.toFixed(2)} LKR
                </span>
                <span>
                  <span className={`${styles.statusPill} ${styles['s_' + tx.status.toLowerCase()]}`}>
                    {tx.status.toLowerCase()}
                  </span>
                </span>
                <span className={styles.notesCell}>{tx.notes ?? '—'}</span>
                <span className={styles.dateCell}>{new Date(tx.createdAt).toLocaleString()}</span>
              </div>
            )
          }) : <p className={styles.emptyModal}>No transactions found.</p>}
        </div>
      </div>
    </div>
  )
}

// ──────────────── Referral Modal ────────────────
function RefModal({ user, onClose }: { user: User; onClose: () => void }) {
  const level2 = user.referrals.flatMap((r) => r.referrals ?? [])
  const level3 = level2.flatMap((r) => r.referrals ?? [])

  const LevelTable = ({ members, label, pct, color }: { members: Ref[]; label: string; pct: string; color: string }) => (
    <div className={styles.refSection}>
      <div className={styles.refLevelHead} style={{ color }}>
        <Users size={16} /> {label} ({members.length}) - <span>{pct} Commission</span>
      </div>
      {members.length > 0 ? (
        <div className={styles.refTable}>
          <div className={`${styles.refRow} ${styles.refHead}`}>
            <span>Mobile</span><span>VIP</span><span>Balance</span>
          </div>
          {members.map(m => (
            <div key={m.id} className={styles.refRow}>
              <span>{m.mobile}</span>
              <span style={{ color: '#f0a500' }}>Level {m.vipLevel}</span>
              <span style={{ color: '#00c853' }}>{m.balance.toFixed(2)} LKR</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.refEmpty}>No referrals</div>
      )}
    </div>
  )

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Referral Chain - {user.mobile}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.refBody}>
          <LevelTable members={user.referrals} label="Level 1" pct="25%" color="#e040fb" />
          <LevelTable members={level2} label="Level 2" pct="3%" color="#e040fb" />
          <LevelTable members={level3} label="Level 3" pct="1%" color="#e040fb" />
        </div>
      </div>
    </div>
  )
}

// ──────────────── Edit User Modal ────────────────
import { vipPackages } from '@/lib/constants'

const VIP_OPTIONS = [
  { level: 0, label: 'No VIP' },
  ...vipPackages.map(p => ({ level: p.level, label: `${p.name} - ${p.price} LKR (${p.profitDaily} LKR/day)` }))
]

function EditUserModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: () => void }) {
  const [balance, setBalance] = useState(user.balance.toString())
  const [depositBal, setDepositBal] = useState('0')
  const [vipLevel, setVipLevel] = useState(user.vipLevel)
  const [saving, setSaving] = useState(false)

  const handleUpdate = async () => {
    setSaving(true)
    // Update balance (add deposited balance to current)
    const newBal = parseFloat(balance) + parseFloat(depositBal || '0')
    const fd = new FormData()
    fd.set('userId', user.id)
    fd.set('amount', newBal.toString())
    await updateUserBalance(fd)

    // Update VIP
    if (vipLevel !== user.vipLevel) {
      const vfd = new FormData()
      vfd.set('userId', user.id)
      vfd.set('vipLevel', vipLevel.toString())
      await updateUserVIP(vfd)
    }
    setSaving(false)
    onSave()
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editHeader}>
          <h3>Edit User</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.editBody}>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Mobile Number</label>
            <p className={styles.editValue}>{user.mobile}</p>
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Current VIP Level</label>
            <p className={styles.editValueGold}>{user.vipLevel}</p>
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Balance (LKR)</label>
            <input type="number" value={balance} onChange={e => setBalance(e.target.value)} step="0.01" className={styles.editInput} />
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Deposited Balance (LKR)</label>
            <input type="number" value={depositBal} onChange={e => setDepositBal(e.target.value)} step="0.01" className={styles.editInput} placeholder="0" />
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}><Crown size={14} /> Activate VIP Package</label>
            <select value={vipLevel} onChange={e => setVipLevel(parseInt(e.target.value))} className={styles.editSelect}>
              {VIP_OPTIONS.map(p => (
                <option key={p.level} value={p.level}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.editFooter}>
          <button onClick={onClose} className={styles.editCancelBtn}>Cancel</button>
          <button onClick={handleUpdate} disabled={saving} className={styles.editUpdateBtn}>
            <Save size={15} /> {saving ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ──────────────── Main AdminClient ────────────────
export default function AdminClient({ users, deposits, withdrawals }: { users: User[], deposits: any[], withdrawals: any[] }) {
  const [activeTab, setActiveTab] = useState<'users' | 'deposits' | 'withdraws'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [txUser, setTxUser] = useState<User | null>(null)
  const [refUser, setRefUser] = useState<User | null>(null)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const handleRefresh = () => { setIsRefreshing(true); router.refresh(); setTimeout(() => setIsRefreshing(false), 600) }

  const filteredUsers = users.filter(u => u.mobile.includes(searchQuery) || u.role.includes(searchQuery))
  const filteredDeposits = deposits.filter(d => d.user.mobile.includes(searchQuery))
  const filteredWithdraws = withdrawals.filter(w => w.user.mobile.includes(searchQuery) || (w.user.bankHolder && w.user.bankHolder.toLowerCase().includes(searchQuery.toLowerCase())))

  const handleApprove = async (id: string) => { setLoadingId(id); await approveTransaction(id); setLoadingId(null) }
  const handleReject  = async (id: string) => { setLoadingId(id); await rejectTransaction(id);  setLoadingId(null) }
  const handleBan     = async (id: string, banned: boolean) => {
    if (confirm(`${banned ? 'Unban' : 'Ban'} this user?`)) { setLoadingId('ban-'+id); await banUserAction(id, !banned); setLoadingId(null) }
  }
  const handleDelete  = async (id: string) => {
    if (confirm('Permanently delete this user and all their data?')) { setLoadingId('del-'+id); await deleteUserAction(id); setLoadingId(null) }
  }

  const totalUsers = users.length
  const totalPendingDep  = deposits.filter(d => d.status === 'PENDING').length
  const totalPendingWith = withdrawals.filter(w => w.status === 'PENDING').length

  return (
    <div className={styles.adminContainer}>
      {/* Modals */}
      {txUser   && <TxModal  user={txUser}  onClose={() => setTxUser(null)}  />}
      {refUser  && <RefModal user={refUser} onClose={() => setRefUser(null)} />}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleRefresh} />}

      <div className={styles.headerRow}>
        <div className={styles.titleWithAction}>
          <h2>Admin Dashboard</h2>
          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCcw size={18} className={isRefreshing ? styles.spinning : ''} /> Refresh
          </button>
        </div>
        <a href="/" className={styles.homeLink}>Exit to App</a>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => setActiveTab('users')}>
          <Users size={32} color="var(--primary)" />
          <div><h3>Total Users</h3><p>{totalUsers}</p></div>
        </div>
        <div className={styles.statCard} onClick={() => setActiveTab('deposits')}>
          <ArrowDownCircle size={32} color="#2e7d32" />
          <div><h3>Pending Deposits</h3><p>{totalPendingDep}</p></div>
        </div>
        <div className={styles.statCard} onClick={() => setActiveTab('withdraws')}>
          <ArrowUpCircle size={32} color="#d32f2f" />
          <div><h3>Pending Withdraws</h3><p>{totalPendingWith}</p></div>
        </div>
      </div>

      <div className={styles.tabsRow}>
        <button className={activeTab === 'users'    ? styles.tabActive : styles.tabBtn} onClick={() => setActiveTab('users')}>Users</button>
        <button className={activeTab === 'deposits' ? styles.tabActive : styles.tabBtn} onClick={() => setActiveTab('deposits')}>Deposits</button>
        <button className={activeTab === 'withdraws'? styles.tabActive : styles.tabBtn} onClick={() => setActiveTab('withdraws')}>Withdrawals</button>
      </div>

      <div className={styles.searchRow}>
        <Search size={20} color="var(--text-secondary)" />
        <input type="text" placeholder="Search by Mobile, Role, or details..." value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)} className={styles.searchInput} />
      </div>

      <div className={styles.tabContent}>
        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className={styles.listWrap}>
            {filteredUsers.map(u => (
              <div key={u.id} className={styles.listItem}>
                <div className={styles.itemMain}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong>{u.mobile}</strong>
                    {u.role === 'ADMIN' && <span className={styles.badge}>ADMIN</span>}
                    {u.banned && <span className={styles.badgeRed}>BANNED</span>}
                    <span className={styles.comText}>VIP {u.vipLevel}</span>
                  </div>
                  <div className={styles.subText}>
                    Referred By: {u.referrer?.mobile ?? 'None'} |{' '}
                    <span className={styles.comText}> Referral Earnings: Rs {u.totalCommissions?.toFixed(2) ?? '0.00'}</span>
                  </div>
                  {/* Action buttons: view history, referral chain, edit */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setTxUser(u)} className={styles.viewBtn}>
                      <History size={13} /> Transactions
                    </button>
                    <button onClick={() => setRefUser(u)} className={`${styles.viewBtn} ${styles.viewBtnPurple}`}>
                      <Network size={13} /> Referral Chain
                    </button>
                    <button onClick={() => setEditUser(u)} className={`${styles.viewBtn} ${styles.viewBtnGold}`}>
                      <Pencil size={13} /> Edit User
                    </button>
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <button onClick={async () => { setLoadingId('imp-'+u.id); const res = await impersonateUser(u.id); if (res.success) router.push('/') }}
                    disabled={loadingId === 'imp-'+u.id} className={styles.btnSuccess} style={{background: '#1976d2'}}>
                    Impersonate
                  </button>
                  <button onClick={() => handleBan(u.id, u.banned)} disabled={loadingId === 'ban-'+u.id} className={styles.btnWarning}>
                    {u.banned ? 'Unban' : 'Ban'}
                  </button>
                  <button onClick={() => handleDelete(u.id)} disabled={loadingId === 'del-'+u.id} className={styles.btnDanger}>Delete</button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && <p className={styles.empty}>No users found.</p>}
          </div>
        )}

        {/* ── DEPOSITS TAB ── */}
        {activeTab === 'deposits' && (
          <div className={styles.listWrap}>
            {filteredDeposits.map(d => (
              <div key={d.id} className={styles.listItem}>
                <div className={styles.itemMain}>
                  <strong>
                    Deposit: Rs {d.amount}
                    <span className={`${styles.badge} ${d.status === 'PENDING' ? '' : (d.status === 'APPROVED' ? styles.bgSuccess : styles.bgRed)}`} style={{marginLeft: '0.5rem'}}>{d.status}</span>
                  </strong>
                  <div className={styles.subText}>User: {d.user.mobile} | Balance: Rs {d.user.balance}</div>
                  {d.receiptUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={d.receiptUrl} target="_blank" rel="noreferrer">
                        <img src={d.receiptUrl} alt="Receipt" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                      </a>
                    </div>
                  )}
                </div>
                {d.status === 'PENDING' && (
                  <div className={styles.actionRow}>
                    <button onClick={() => handleApprove(d.id)} disabled={loadingId === d.id} className={styles.btnSuccess}>Approve</button>
                    <button onClick={() => handleReject(d.id)}  disabled={loadingId === d.id} className={styles.btnDanger}>Reject</button>
                  </div>
                )}
              </div>
            ))}
            {filteredDeposits.length === 0 && <p className={styles.empty}>No deposits found.</p>}
          </div>
        )}

        {/* ── WITHDRAWALS TAB ── */}
        {activeTab === 'withdraws' && (
          <div className={styles.listWrap}>
            {filteredWithdraws.map(w => (
              <div key={w.id} className={styles.listItem}>
                <div className={styles.itemMain}>
                  <strong>
                    Withdraw: Rs {w.amount}
                    <span className={`${styles.badge} ${w.status === 'PENDING' ? '' : (w.status === 'APPROVED' ? styles.bgSuccess : styles.bgRed)}`} style={{marginLeft: '0.5rem'}}>{w.status}</span>
                  </strong>
                  <div className={styles.subText}>User: {w.user.mobile} | Balance: Rs {w.user.balance}</div>
                  <div className={styles.bankBox}>
                    <p>Holder: {w.user.bankHolder}</p>
                    <p>Bank: {w.user.bankName}</p>
                    <p>Acc No: {w.user.bankAccount}</p>
                  </div>
                </div>
                {w.status === 'PENDING' && (
                  <div className={styles.actionRow}>
                    <button onClick={() => handleApprove(w.id)} disabled={loadingId === w.id} className={styles.btnSuccess}>Approve</button>
                    <button onClick={() => handleReject(w.id)}  disabled={loadingId === w.id} className={styles.btnDanger}>Reject</button>
                  </div>
                )}
              </div>
            ))}
            {filteredWithdraws.length === 0 && <p className={styles.empty}>No withdrawals found.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
