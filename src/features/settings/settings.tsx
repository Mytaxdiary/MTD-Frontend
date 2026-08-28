'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import B from '@/styles/theme'
import SettingsSidebar, { SETTINGS_NAV, type SectionKey } from './components/SettingsSidebar'
import FirmDetailsSection from './components/FirmDetailsSection'
import HmrcSection from './components/HmrcSection'
import EmailSection from './components/EmailSection'
import TeamSection from './components/TeamSection'
import NotificationsSection from './components/NotificationsSection'
import BillingSection from './components/BillingSection'
import SandboxInvitationsSection from './components/SandboxInvitationsSection'
import SecuritySection from './components/SecuritySection'
import DataPrivacySection from './components/DataPrivacySection'
import { usePermissions } from '@/hooks/usePermissions'

export default function Settings(_props: { navigate?: (route: string) => void }) {
  const searchParams = useSearchParams()
  const perms = usePermissions()
  const [section, setSection] = useState<SectionKey>('security')
  const [navReady, setNavReady] = useState(false)

  const visibleNav = useMemo(() => {
    return SETTINGS_NAV.filter((s) => {
      if (s.k === 'team' || s.k === 'billing' || s.k === 'data-privacy') return perms.isOwner
      if (s.k === 'security') return true
      if (s.k === 'email') return perms.canViewSettings || perms.canChase
      if (s.k === 'sandbox-invitations') return perms.canAddClients
      return perms.canViewSettings
    })
  }, [perms.isOwner, perms.canViewSettings, perms.canChase, perms.canAddClients])

  const allowedKeys = useMemo(() => visibleNav.map((s) => s.k), [visibleNav])

  useEffect(() => {
    if (perms.loading || allowedKeys.length === 0) return
    const s = searchParams.get('section') as SectionKey | null
    const next = s && allowedKeys.includes(s) ? s : allowedKeys[0]
    setSection(next)
    setNavReady(true)
  }, [searchParams, perms.loading, allowedKeys])

  const subtitle = perms.isOwner
    ? 'Manage your firm, HMRC connection, team, and preferences'
    : perms.canViewSettings
      ? 'Manage firm connection and preferences'
      : 'Manage your security and email'

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '14px 28px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em' }}>Settings</div>
        <div style={{ fontSize: 15, color: B.muted, marginTop: 3 }}>{subtitle}</div>
      </div>

      <div style={{ padding: '18px 28px', flex: 1 }}>
        {perms.loading || !navReady ? (
          <div style={{ fontSize: 14, color: B.muted }}>Loading settings...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
            <SettingsSidebar active={section} onChange={setSection} sections={visibleNav} />

            <div>
              {section === 'firm' && perms.canViewSettings && <FirmDetailsSection />}
              {section === 'hmrc' && perms.canViewSettings && <HmrcSection />}
              {section === 'email' && (perms.canViewSettings || perms.canChase) && <EmailSection />}
              {section === 'sandbox-invitations' && perms.canAddClients && (
                <SandboxInvitationsSection />
              )}
              {section === 'team' && perms.isOwner && <TeamSection />}
              {section === 'notifications' && perms.canViewSettings && <NotificationsSection />}
              {section === 'security' && <SecuritySection />}
              {section === 'billing' && perms.isOwner && <BillingSection />}
              {section === 'data-privacy' && perms.isOwner && <DataPrivacySection />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
