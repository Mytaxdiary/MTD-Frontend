'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/messages',  label: 'Messages' },
  { href: '/portal/files',     label: 'Files' },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/portal/login' || pathname === '/portal/setup' || pathname === '/portal/preview'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F1F5F9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 15,
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: '#1E3A5F',
          padding: '0 36px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}
      >
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 17, letterSpacing: '-0.2px' }}>
          NewEffect Client Portal
        </span>

        {!isAuthPage && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 7,
                    fontSize: 14,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.70)',
                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
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

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '28px 20px' }}>
        {children}
      </main>
    </div>
  )
}
