'use client'

import AppSidebar from './appSidebar'
import TokenRefreshProvider from '@/components/auth/TokenRefreshProvider'
import CurrentUserProvider from '@/components/auth/CurrentUserProvider'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TokenRefreshProvider>
      <CurrentUserProvider>
        <div
          style={{
            display: 'flex',
            height: '100vh',
            fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
            background: '#F8FAFC',
            color: '#0F172A',
          }}
        >
          <AppSidebar />
          {children}
        </div>
      </CurrentUserProvider>
    </TokenRefreshProvider>
  )
}
