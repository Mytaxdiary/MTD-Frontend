'use client'

import { useRouter, usePathname } from 'next/navigation'
import { PATH_ACTIVE_MAP, ROUTE_PATHS } from '@/config/routes'

const C = {
  navy: '#1B2A4A',
  primary: '#0EA5C9',
  primaryDark: '#0284A8',
  red: '#EF4444',
}

interface NavItemProps {
  label: string
  active?: boolean
  icon: string
  count?: number
  onClick: () => void
}

const NavItem = ({ label, active, icon, count = 0, onClick }: NavItemProps) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
      borderRadius: 8, cursor: 'pointer',
      background: active ? 'rgba(14,165,201,0.12)' : 'transparent',
      color: active ? C.primary : 'rgba(255,255,255,0.65)',
      fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2,
    }}
  >
    <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && (
      <span style={{ fontSize: 10, fontWeight: 700, background: C.red, color: '#fff', borderRadius: 10, padding: '1px 7px', minWidth: 18, textAlign: 'center' }}>
        {count}
      </span>
    )}
  </div>
)

export default function AppSidebar({ overdueCount = 2 }: { overdueCount?: number }) {
  const router = useRouter()
  const pathname = usePathname()

  const active = PATH_ACTIVE_MAP[pathname] ?? 'dashboard'
  const go = (key: string) => router.push(ROUTE_PATHS[key] ?? `/${key}`)

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{ width: 230, background: C.navy, display: 'flex', flexDirection: 'column', flexShrink: 0 }}
    >
      {/* Brand */}
      <div style={{ padding: '22px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '-0.5px' }}>
            NE
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>NewEffect</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>MTD ITSA</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', padding: '0 14px', marginBottom: 8 }}>
          MAIN
        </div>
        <NavItem label="Dashboard"      active={active === 'dashboard'}  icon="⊞" onClick={() => go('dashboard')} />
        <NavItem label="Clients"        active={active === 'clients'}    icon="⊡" onClick={() => go('clients')} />
        <NavItem label="Chase manager"  active={active === 'chase'}      icon="↗" count={overdueCount} onClick={() => go('chase')} />

        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', padding: '0 14px', marginTop: 24, marginBottom: 8 }}>
          MANAGE
        </div>
        <NavItem label="Add client"       active={active === 'add-client'} icon="+"  onClick={() => go('add-client')} />
        <NavItem label="Settings"         active={active === 'settings'}   icon="⚙"  onClick={() => go('settings')} />
        <NavItem label="HMRC connection"                                    icon="⟷" onClick={() => go('settings')} />
      </div>

      {/* User footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 20, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            JW
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Jane Walker</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Walker &amp; Co Accountants</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
