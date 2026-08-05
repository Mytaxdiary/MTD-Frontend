'use client'

import { useRouter, usePathname } from 'next/navigation'
import { PATH_ACTIVE_MAP, ROUTE_PATHS } from '@/config/routes'
import B from '@/styles/theme'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser, userInitials } from '@/components/auth/CurrentUserProvider'
import NotificationBell from '@/components/ui/NotificationBell'
import {
  GridIcon,
  UsersIcon,
  SendIcon,
  PlusCircleIcon,
  SettingsIcon,
  LinkIcon,
  SignOutIcon,
} from '@/components/ui/icons'

const SIDEBAR_WIDTH = 244

/**
 * Faint circuit-trace motif behind the nav. Purely decorative — sits at low
 * opacity so nav text keeps its contrast ratio.
 */
const CircuitBackdrop = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 244 620"
    preserveAspectRatio="xMidYMid slice"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}
  >
    <defs>
      <linearGradient id="trace" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0EA5C9" stopOpacity="0.05" />
      </linearGradient>
      <radialGradient id="glow" cx="18%" cy="8%" r="55%">
        <stop offset="0%" stopColor="#0EA5C9" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#0EA5C9" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="244" height="620" fill="url(#glow)" />

    <g stroke="url(#trace)" strokeWidth="1" fill="none" opacity="0.55">
      <path d="M-10 96h58l26 26h44" />
      <path d="M244 150h-52l-24 24H96" />
      <path d="M-10 232h40l30 30h70l24 24h94" />
      <path d="M244 300h-70l-26 26H60l-28 28H-10" />
      <path d="M-10 430h74l28-28h58l26 26h68" />
      <path d="M244 500h-46l-26 26H74l-30 30H-10" />
      <path d="M40 96v56M168 174v40M104 262v52M148 326v46M92 402v44M198 526v40" />
    </g>

    <g fill="#22D3EE" opacity="0.5">
      <circle cx="48" cy="96" r="1.8" />
      <circle cx="168" cy="174" r="1.8" />
      <circle cx="104" cy="262" r="1.8" />
      <circle cx="148" cy="326" r="1.8" />
      <circle cx="92" cy="402" r="1.8" />
      <circle cx="198" cy="526" r="1.8" />
    </g>

    {/* Soft arc sweep near the footer, mirroring the reference artwork */}
    <g stroke="#22D3EE" fill="none" opacity="0.26">
      <path d="M-40 596c70-58 158-84 300-78" strokeWidth="1" />
      <path d="M-40 620c78-70 176-100 320-94" strokeWidth="0.8" opacity="0.6" />
    </g>
  </svg>
)

/** Circular brand mark: teal ring with the NE monogram. */
const BrandMark = () => (
  <div
    aria-hidden="true"
    style={{
      width: 38,
      height: 38,
      borderRadius: '50%',
      flexShrink: 0,
      position: 'relative',
      background: 'radial-gradient(circle at 30% 25%, #12384A 0%, #0A1120 70%)',
      border: '1.5px solid rgba(34,211,238,0.55)',
      boxShadow: '0 0 0 3px rgba(14,165,201,0.10), 0 0 14px rgba(34,211,238,0.28)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <span
      style={{
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '-0.04em',
        color: '#22D3EE',
      }}
    >
      NE
    </span>
  </div>
)

interface NavItemProps {
  label: string
  active?: boolean
  icon: React.ReactNode
  count?: number
  onClick: () => void
}

// WCAG 4.1.2 — a real <button> keeps the item keyboard reachable (Tab + Enter/Space).
// WCAG 1.4.3 — inactive label rgba(226,232,240,0.78) on #0A1120 → ~9:1; active #fff → ~15:1.
const NavItem = ({ label, active, icon, count = 0, onClick }: NavItemProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className="nav-item"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '10px 13px',
      borderRadius: 9,
      cursor: 'pointer',
      background: active ? B.sidebarActiveBg : 'transparent',
      color: active ? B.sidebarTextActive : B.sidebarText,
      fontSize: 14.5,
      fontWeight: active ? 600 : 450,
      marginBottom: 3,
      width: '100%',
      textAlign: 'left',
      border: `1px solid ${active ? B.sidebarActiveBorder : 'transparent'}`,
      transition: 'background 0.12s, color 0.12s',
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.background = B.sidebarHoverBg
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.background = 'transparent'
    }}
  >
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        color: active ? '#22D3EE' : 'currentColor',
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && (
      <span
        aria-label={`${count} overdue`}
        style={{
          fontSize: 11,
          fontWeight: 700,
          background: B.red,
          color: '#fff',
          borderRadius: 10,
          padding: '2px 7px',
          minWidth: 19,
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        {count}
      </span>
    )}
  </button>
)

const SectionLabel = ({ children }: { children: string }) => (
  <div
    role="presentation"
    style={{
      fontSize: 10.5,
      fontWeight: 700,
      color: B.sidebarLabel,
      letterSpacing: '0.11em',
      padding: '0 13px',
      marginBottom: 9,
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
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${B.sidebarBgTop} 0%, ${B.sidebarBg} 34%, ${B.sidebarBg} 100%)`,
        overflow: 'hidden',
      }}
    >
      <CircuitBackdrop />

      {/* Everything above the backdrop */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandMark />
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: '#FFFFFF' }}>New</span>
              <span style={{ color: '#22D3EE' }}>Effect</span>
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <div style={{ padding: '4px 12px', flex: 1, overflowY: 'auto' }}>
          <div role="group" aria-label="Main">
            <SectionLabel>MAIN</SectionLabel>
            <NavItem
              label="Dashboard"
              active={active === 'dashboard'}
              icon={<GridIcon />}
              onClick={() => go('dashboard')}
            />
            <NavItem
              label="Clients"
              active={active === 'clients'}
              icon={<UsersIcon />}
              onClick={() => go('clients')}
            />
            <NavItem
              label="Chase manager"
              active={active === 'chase'}
              icon={<SendIcon />}
              count={overdueCount}
              onClick={() => go('chase')}
            />
          </div>

          <div role="group" aria-label="Manage" style={{ marginTop: 26 }}>
            <SectionLabel>MANAGE</SectionLabel>
            <NavItem
              label="Add client"
              active={active === 'add-client'}
              icon={<PlusCircleIcon />}
              onClick={() => go('add-client')}
            />
            <NavItem
              label="Settings"
              active={active === 'settings'}
              icon={<SettingsIcon />}
              onClick={() => go('settings')}
            />
            <NavItem label="HMRC connection" icon={<LinkIcon />} onClick={() => go('settings')} />
          </div>
        </div>

        {/* User footer */}
        <div style={{ padding: '14px 14px 16px', borderTop: `1px solid ${B.sidebarBorder}` }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}
            aria-label={`Signed in as ${displayName}${displayFirm ? `, ${displayFirm}` : ''}`}
          >
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }} aria-hidden="true">
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.92)',
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
                  fontSize: 11.5,
                  color: 'rgba(148,163,184,0.85)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: 1,
                }}
                title={displayFirm}
              >
                {displayFirm}
              </div>
            </div>
            <NotificationBell />
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              width: '100%',
              padding: '10px 13px',
              borderRadius: 9,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(226,232,240,0.82)',
              fontSize: 13.5,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'rgba(226,232,240,0.82)'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                flexShrink: 0,
              }}
            >
              <SignOutIcon />
            </span>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
