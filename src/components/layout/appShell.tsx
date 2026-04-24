'use client'

import AppSidebar from './appSidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
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
  )
}
