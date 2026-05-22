import B from '@/styles/theme'

export type SectionKey = 'firm' | 'hmrc' | 'sandbox-invitations' | 'team' | 'notifications' | 'billing'

const SECTIONS: { k: SectionKey; l: string; i: string }[] = [
  { k: 'firm', l: 'Firm details', i: '⊡' },
  { k: 'hmrc', l: 'HMRC connection', i: '⟷' },
  { k: 'sandbox-invitations', l: 'Sandbox invitations', i: '✉' },
  { k: 'team', l: 'Team members', i: '☷' },
  { k: 'notifications', l: 'Notifications', i: '⊙' },
  { k: 'billing', l: 'Plan & billing', i: '◇' },
]

interface Props {
  active: SectionKey
  onChange: (k: SectionKey) => void
}

export default function SettingsSidebar({ active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {SECTIONS.map((s) => (
        <div
          key={s.k}
          onClick={() => onChange(s.k)}
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
          }}
        >
          <span style={{ fontSize: 14, opacity: 0.7 }}>{s.i}</span>
          {s.l}
        </div>
      ))}
    </div>
  )
}
