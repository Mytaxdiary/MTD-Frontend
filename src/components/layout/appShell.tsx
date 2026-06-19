'use client'

import AppSidebar from './appSidebar'
import TokenRefreshProvider from '@/components/auth/TokenRefreshProvider'
import CurrentUserProvider from '@/components/auth/CurrentUserProvider'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TokenRefreshProvider>
      <CurrentUserProvider>
        {/* WCAG 2.4.1 — Skip navigation link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
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
          <main
            id="main-content"
            tabIndex={-1}
            style={{ flex: 1, minWidth: 0, overflowY: 'auto', outline: 'none' }}
          >
            {children}
          </main>
        </div>
      </CurrentUserProvider>
    </TokenRefreshProvider>
  )
}
