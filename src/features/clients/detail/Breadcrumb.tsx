import B from '@/styles/theme'

interface Props {
  clientLoading: boolean
  displayName: string
  navigate: (route: string) => void
}

export default function ClientDetailBreadcrumb({ clientLoading, displayName, navigate }: Props) {
  return (
    <div
      style={{
        padding: '12px 32px',
        background: B.white,
        borderBottom: `1px solid ${B.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        flexShrink: 0,
      }}
    >
      <span
        style={{ color: B.primary, cursor: 'pointer', fontWeight: 500 }}
        onClick={() => navigate('clients')}
      >
        Clients
      </span>
      <span style={{ color: B.xlight }}>/</span>
      <span style={{ fontWeight: 600 }}>{clientLoading ? 'Loading...' : displayName}</span>
    </div>
  )
}
