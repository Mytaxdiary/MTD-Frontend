'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import B from '@/styles/theme'
import SettingsSidebar, { type SectionKey } from './components/SettingsSidebar'
import FirmDetailsSection from './components/FirmDetailsSection'
import HmrcSection from './components/HmrcSection'
import TeamSection from './components/TeamSection'
import NotificationsSection from './components/NotificationsSection'
import BillingSection from './components/BillingSection'
import SandboxInvitationsSection from './components/SandboxInvitationsSection'
import SecuritySection from './components/SecuritySection'

const VALID_SECTIONS: SectionKey[] = [
  'firm',
  'hmrc',
  'sandbox-invitations',
  'team',
  'notifications',
  'security',
  'billing',
]

export default function Settings({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const searchParams = useSearchParams()
  const [section, setSection] = useState<SectionKey>('firm')

  useEffect(() => {
    const s = searchParams.get('section') as SectionKey | null
    if (s && VALID_SECTIONS.includes(s)) setSection(s)
  }, [searchParams])

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px 32px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Settings</div>
        <div style={{ fontSize: 14, color: B.muted, marginTop: 3 }}>
          Manage your firm, HMRC connection, team, and preferences
        </div>
      </div>

      <div style={{ padding: '24px 32px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
          <SettingsSidebar active={section} onChange={setSection} />

          <div>
            {section === 'firm' && <FirmDetailsSection />}
            {section === 'hmrc' && <HmrcSection />}
            {section === 'sandbox-invitations' && <SandboxInvitationsSection />}
            {section === 'team' && <TeamSection />}
            {section === 'notifications' && <NotificationsSection />}
            {section === 'security' && <SecuritySection />}
            {section === 'billing' && <BillingSection />}
          </div>
        </div>
      </div>
    </div>
  )
}
