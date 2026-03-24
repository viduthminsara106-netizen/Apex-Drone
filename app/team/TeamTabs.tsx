'use client'

import { useState } from 'react'
import styles from './Team.module.css'

export function TeamTabs({ l1, l2, l3 }: { l1: any[], l2: any[], l3: any[] }) {
  const [activeTab, setActiveTab] = useState(1)

  const currentList = activeTab === 1 ? l1 : activeTab === 2 ? l2 : l3
  const tabLabel = activeTab === 1 ? 'L1 කණ්ඩායම' : activeTab === 2 ? 'L2 කණ්ඩායම' : 'L3 කණ්ඩායම'

  return (
    <>
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab(1)} className={`${styles.tab} ${activeTab === 1 ? styles.activeTab : ''}`}>Level 1</button>
        <button onClick={() => setActiveTab(2)} className={`${styles.tab} ${activeTab === 2 ? styles.activeTab : ''}`}>Level 2</button>
        <button onClick={() => setActiveTab(3)} className={`${styles.tab} ${activeTab === 3 ? styles.activeTab : ''}`}>Level 3</button>
      </div>

      <div className={styles.teamList}>
        <h3>👥 {tabLabel} ({currentList.length})</h3>
        {currentList.length === 0 ? (
          <p className={styles.noData}>සාමාජිකයින් නොමැත</p>
        ) : (
          currentList.map((ref: any) => (
            <div key={ref.id} className={styles.teamMember}>
              <div className={styles.memberDetails}>
                <span>{ref.mobile.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}</span>
                <span className={styles.memberDeposit}>පැටවූ මුදල (Deposit): Rs {ref.deposit.toFixed(2)}</span>
              </div>
              <span className={styles.vipTag}>VIP {ref.vipLevel}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
