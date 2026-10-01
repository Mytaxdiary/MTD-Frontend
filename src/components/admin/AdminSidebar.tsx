'use client'

import { useRouter, usePathname } from 'next/navigation'
import B from '@/styles/theme'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser, userInitials } from '@/components/auth/CurrentUserProvider'
import BrandLogo from '@/components/ui/BrandLogo'
import {
  GridIcon,
  UsersIcon,
  SendIcon,
  SettingsIcon,
  SignOutIcon,
  ClockIcon,
} from '@/components/ui/icons'

const SIDEBAR_WIDTH = 244

const NAV = [
  { href: '/admin', label: 'Overview', icon: GridIcon, match: (p: string) => p === '/admin' },
  {
    href: '/admin/firms',
    label: 'Firms',
    icon: UsersIcon,
    match: (p: string) => p.startsWith('/admin/firms'),
  },
  {
    href: '/admin/enquiries',
    label: 'Enquiries',
    icon: SendIcon,
    match: (p: string) => p.startsWith('/admin/enquiries'),
  },
  {
    href: '/admin/audit',
    label: 'Audit log',
    icon: ClockIcon,
    match: (p: string) => p.startsWith('/admin/audit'),
  },
  {
    href: '/admin/support',
    label: 'Support',
    icon: SettingsIcon,
    match: (p: string) => p.startsWith('/admin/support'),
  },
] as const

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const { user, loading } = useCurrentUser()

  const displayName = user?.name ?? (loading ? 'Loading...' : 'Admin')
  const initials = userInitials(user?.name)

  return (
    <nav
      aria-label="Admin navigation"
      style={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${B.sidebarBgTop} 0%, ${B.sidebarBg} 34%, ${B.sidebarBg} 100%)`,
        borderRight: `1px solid ${B.sidebarBorder}`,
      }}
    >
      <div style={{ padding: '16px 14px 10px' }}>
        <BrandLogo width={216} priority />
        <div
          style={{
            marginTop: 10,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: B.sidebarLabel,
            paddingLeft: 2,
          }}
        >
          PLATFORM ADMIN
        </div>
      </div>

      <div style={{ padding: '8px 12px', flex: 1 }}>
        {NAV.map((item) => {
          const active = item.match(pathname)
          const Icon = item.icon
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              aria-current={active ? 'page' : undefined}
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
              }}
            >
              <span
                style={{
                  display: 'flex',
                  width: 18,
                  color: active ? '#22D3EE' : 'currentColor',
                }}
              >
                <Icon />
              </span>
              {item.label}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '14px', borderTop: `1px solid ${B.sidebarBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(14,165,201,0.2)',
              color: '#22D3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayName}
            </div>
            <div style={{ fontSize: 11.5, color: B.sidebarLabel }}>Product owner</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout({ redirectTo: '/admin/login' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid transparent',
            background: 'transparent',
            color: B.sidebarText,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          <SignOutIcon />
          Sign out
        </button>
      </div>
    </nav>
  )
}
