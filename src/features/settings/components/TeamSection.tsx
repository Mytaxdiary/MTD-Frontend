import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'

const MEMBERS = [
  { n: 'Jane Walker', e: 'jane@walkerco.co.uk', r: 'Admin', s: 'Active', i: 'JW' },
  { n: 'Tom Richards', e: 'tom@walkerco.co.uk', r: 'Accountant', s: 'Active', i: 'TR' },
  { n: 'Suki Patel', e: 'suki@walkerco.co.uk', r: 'Bookkeeper', s: 'Invited', i: 'SP' },
]

export default function TeamSection() {
  return (
    <Card>
      <CardHead titleSize={15} padding="16px 20px" title="Team members" />
      <div style={{ padding: '8px 20px 14px' }}>
        {MEMBERS.map((m, idx) => (
          <div
            key={m.e}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0',
              borderBottom: idx < MEMBERS.length - 1 ? `1px solid ${B.borderLight}` : 'none',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                background: B.blueBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: B.blueText,
                border: '1px solid #BAE6FD',
              }}
            >
              {m.i}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.n}</div>
              <div style={{ fontSize: 11, color: B.light }}>{m.e}</div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: B.muted,
                padding: '2px 10px',
                borderRadius: 20,
                background: B.surface,
                border: `1px solid ${B.borderLight}`,
              }}
            >
              {m.r}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 10,
                background: m.s === 'Active' ? B.greenBg : B.amberBg,
                color: m.s === 'Active' ? B.greenText : B.amberText,
              }}
            >
              {m.s}
            </span>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              background: B.white,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              color: B.text,
            }}
          >
            + Invite team member
          </button>
        </div>
      </div>
    </Card>
  )
}
