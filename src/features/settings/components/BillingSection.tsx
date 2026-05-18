import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'

const BILLING_ROWS = [
  ['Clients', '12 active (£36/mo)'],
  ['Monthly total', '£135/mo'],
  ['Next charge', '1 May 2026'],
  ['Payment', 'Visa ending 4242'],
]

const outlineBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

export default function BillingSection() {
  return (
    <Card>
      <CardHead titleSize={15} padding="16px 20px" title="Plan & billing" />
      <div style={{ padding: '20px' }}>
        <div
          style={{
            padding: '20px',
            background: B.blueBg,
            borderRadius: 10,
            border: '1px solid #BAE6FD',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: B.blueText,
                  letterSpacing: '0.04em',
                }}
              >
                CURRENT PLAN
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: B.navy, marginTop: 4 }}>
                Agent Portal
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: B.navy }}>
                £99
                <span style={{ fontSize: 13, fontWeight: 400, color: B.muted }}>/mo</span>
              </div>
              <div style={{ fontSize: 12, color: B.blueText }}>+ £3/client/mo</div>
            </div>
          </div>
        </div>

        {BILLING_ROWS.map(([k, v], i) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '9px 0',
              borderBottom: i < BILLING_ROWS.length - 1 ? `1px solid ${B.borderLight}` : 'none',
            }}
          >
            <span style={{ fontSize: 12, color: B.muted }}>{k}</span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{v}</span>
          </div>
        ))}

        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <button style={outlineBtn}>Update payment</button>
          <button style={outlineBtn}>View invoices</button>
        </div>
      </div>
    </Card>
  )
}
