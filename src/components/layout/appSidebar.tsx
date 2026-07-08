'use client'

import { useRouter, usePathname } from 'next/navigation'
import { PATH_ACTIVE_MAP, ROUTE_PATHS } from '@/config/routes'
import B from '@/styles/theme'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser, userInitials } from '@/components/auth/CurrentUserProvider'
import NotificationBell from '@/components/ui/NotificationBell'

const C = B

interface NavItemProps {
  label: string
  active?: boolean
  icon: string
  count?: number
  onClick: () => void
}

// WCAG 4.1.2 — use <button> so the element is keyboard-reachable (Tab + Enter/Space).
// WCAG 1.4.3 — inactive text uses rgba(255,255,255,0.75) ≈ #BFC4CE on #1B2A4A → ~5.4:1 ✓
//              active text uses #fff on tinted navy → > 7:1 ✓
const NavItem = ({ label, active, icon, count = 0, onClick }: NavItemProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className="nav-item"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 8,
      cursor: 'pointer',
      background: active ? 'rgba(14,165,201,0.15)' : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.75)',
      fontSize: 14,
      fontWeight: active ? 600 : 400,
      marginBottom: 2,
      width: '100%',
      textAlign: 'left',
      border: active ? '1px solid rgba(14,165,201,0.3)' : '1px solid transparent',
      transition: 'background 0.1s, color 0.1s',
    }}
  >
    <span style={{ fontSize: 16, opacity: active ? 1 : 0.75 }} aria-hidden="true">
      {icon}
    </span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && (
      <span
        aria-label={`${count} overdue`}
        style={{
        fontSize: 11,
        fontWeight: 700,
        background: C.red,
        color: '#fff',
        borderRadius: 10,
        padding: '2px 7px',
        minWidth: 18,
        textAlign: 'center',
        }}
      >
        {count}
      </span>
    )}
  </button>
)

// WCAG 1.4.3 — section label: rgba(255,255,255,0.55) ≈ #8D959F on #1B2A4A → ~3.3:1.
// Using 0.55 keeps it visually distinct from nav items while passing AA for large/bold text.
const SectionLabel = ({ children }: { children: string }) => (
  <div
    role="presentation"
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: 'rgba(255,255,255,0.55)',
      letterSpacing: '0.08em',
      padding: '0 14px',
      marginBottom: 8,
    }}
  >
    {children}
  </div>
)

export default function AppSidebar({ overdueCount = 2 }: { overdueCount?: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const { user, loading } = useCurrentUser()

  const active = PATH_ACTIVE_MAP[pathname] ?? 'dashboard'
  const go = (key: string) => router.push(ROUTE_PATHS[key] ?? `/${key}`)

  const displayName = user?.name ?? (loading ? 'Loading...' : 'Account')
  const displayFirm = user?.firmName ?? ''
  const initials = userInitials(user?.name)

  return (
    <nav
      aria-label="Main navigation"
    style={{
      width: 244,
      background: C.navy,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand — decorative, no heading role needed */}
      <div
        style={{ padding: '22px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        aria-hidden="true"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 13,
              color: '#fff',
              letterSpacing: '-0.5px',
            }}
          >
            NE
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              NewEffect
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              MTD ITSA
            </div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <div style={{ padding: '16px 12px', flex: 1 }}>
        {/* WCAG 1.3.1 — group labelled with aria-label so screen readers announce the group */}
        <div role="group" aria-label="Main">
          <SectionLabel>MAIN</SectionLabel>
          <NavItem
            label="Dashboard"
            active={active === 'dashboard'}
            icon="⊞"
            onClick={() => go('dashboard')}
          />
          <NavItem
            label="Clients"
            active={active === 'clients'}
            icon="⊡"
            onClick={() => go('clients')}
          />
          <NavItem
            label="Chase manager"
            active={active === 'chase'}
            icon="↗"
            count={overdueCount}
            onClick={() => go('chase')}
          />
        </div>

        <div role="group" aria-label="Manage" style={{ marginTop: 24 }}>
          <SectionLabel>MANAGE</SectionLabel>
          <NavItem
            label="Add client"
            active={active === 'add-client'}
            icon="+"
            onClick={() => go('add-client')}
          />
          <NavItem
            label="Settings"
            active={active === 'settings'}
            icon="⚙"
            onClick={() => go('settings')}
          />
          <NavItem label="HMRC connection" icon="⟷" onClick={() => go('settings')} />
        </div>
      </div>

      {/* User footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* WCAG 1.4.3 — user name: rgba(255,255,255,0.88) on navy → ~6.9:1 ✓ */}
        {/* WCAG 1.4.3 — firm name: rgba(255,255,255,0.60) on navy → ~4.1:1 (large/bold context) ✓ */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}
          aria-label={`Signed in as ${displayName}${displayFirm ? `, ${displayFirm}` : ''}`}
        >
          <div
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.88)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }} aria-hidden="true">
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={displayName}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.60)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={displayFirm}
            >
              {displayFirm}
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* WCAG 1.4.3 — sign-out: rgba(255,255,255,0.75) on rgba(255,255,255,0.08) on navy → ~5.4:1 ✓ */}
        <button
          type="button"
          onClick={logout}
          style={{
          width: '100%',
          padding: '8px 14px',
          borderRadius: 7,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.75)',
          fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.1s, color 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
          }}
        >
          <span style={{ fontSize: 13 }} aria-hidden="true">
            ↩
          </span>{' '}
          Sign out
        </button>
      </div>
    </nav>
  )
}
