'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/messages',  label: 'Messages' },
  { href: '/portal/files',     label: 'Files' },
]
/**
 * Client portal layout — intentionally minimal (no agent sidebar).
 * Clients see a completely separate UI from the agent portal.
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/portal/login' || pathname === '/portal/setup'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: '#1E3A5F',
          padding: '0 32px',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
          NewEffect · Client Portal
        </span>

        {/* Nav links — only show on authenticated pages */}
        {!isAuthPage && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
        {children}
      </main>
    </div>
  )
}
