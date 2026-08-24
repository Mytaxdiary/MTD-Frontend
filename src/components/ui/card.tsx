import B from '@/styles/theme'

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: B.white,
        borderRadius: 12,
        border: `1px solid ${B.border}`,
        boxShadow: B.cardShadow,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  title: string
  sub?: string
  right?: React.ReactNode
  titleSize?: number
  padding?: string
}

export function CardHeader({
  title,
  sub,
  right,
  titleSize = 16,
  padding = '13px 18px',
}: CardHeaderProps) {
  if (right) {
    return (
      <div
        style={{
          padding,
          borderBottom: `1px solid ${B.border}`,
          background: B.surface,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: titleSize, fontWeight: 700 }}>{title}</div>
          {sub && <div style={{ fontSize: 13, color: B.muted, marginTop: 3 }}>{sub}</div>}
        </div>
        {right}
      </div>
    )
  }
  return (
    <div style={{ padding, borderBottom: `1px solid ${B.border}`, background: B.surface }}>
      <div style={{ fontSize: titleSize, fontWeight: 700 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: B.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}
