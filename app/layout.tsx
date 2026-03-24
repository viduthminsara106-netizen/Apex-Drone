import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ApexDrone Platform',
  description: 'Advanced drone investment platform',
}

import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="si" suppressHydrationWarning>
      <body>
        <div className="app-container">
          <TopBar />
          <main className="main-content">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
