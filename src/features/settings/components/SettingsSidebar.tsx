import B from '@/styles/theme'

export type SectionKey =
  | 'firm'
  | 'hmrc'
  | 'sandbox-invitations'
  | 'team'
  | 'notifications'
  | 'security'
  | 'billing'

const SECTIONS: { k: SectionKey; l: string; i: string }[] = [
  { k: 'firm', l: 'Firm details', i: '⊡' },
  { k: 'hmrc', l: 'HMRC connection', i: '⟷' },
  { k: 'sandbox-invitations', l: 'Sandbox invitations', i: '✉' },
  { k: 'team', l: 'Team members', i: '☷' },
  { k: 'notifications', l: 'Notifications', i: '⊙' },
  { k: 'security', l: 'Security & 2FA', i: '⊛' },
  { k: 'billing', l: 'Plan & billing', i: '◇' },
]

interface Props {
  active: SectionKey
  onChange: (k: SectionKey) => void
}

// WCAG 4.1.2 — use <button> so items are keyboard-reachable (Tab + Enter/Space).
// WCAG 1.4.3 — active text: B.text (#0F172A) on B.white (#FFFFFF) → 19.1:1 ✓
//              inactive text: B.muted (#64748B) on transparent/surface → 4.6:1 ✓
export default function SettingsSidebar({ active, onChange }: Props) {
  return (
    <nav aria-label="Settings navigation">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SECTIONS.map((s) => (
          <button
            key={s.k}
            type="button"
            className="settings-nav-item"
            onClick={() => onChange(s.k)}
            aria-current={active === s.k ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              background: active === s.k ? B.white : 'transparent',
              border: `1px solid ${active === s.k ? B.border : 'transparent'}`,
              fontSize: 13,
              fontWeight: active === s.k ? 600 : 400,
              color: active === s.k ? B.text : B.muted,
              width: '100%',
              textAlign: 'left',
              transition: 'background 0.1s, color 0.1s',
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.7 }} aria-hidden="true">
              {s.i}
            </span>
            {s.l}
          </button>
        ))}
      </div>
    </nav>
  )
}
