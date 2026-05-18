import B from '@/styles/theme'

interface Props {
  on: boolean
  onChange: (v: boolean) => void
  label: string
  isNew?: boolean
}

export default function SettingsToggle({ on, onChange, label, isNew }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: `1px solid ${B.borderLight}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        {isNew && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 4,
              background: B.primary,
              color: '#fff',
            }}
          >
            NEW
          </span>
        )}
      </div>
      <div
        onClick={() => onChange(!on)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: on ? B.primary : B.xlight,
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: '#fff',
            position: 'absolute',
            top: 2,
            left: on ? 20 : 2,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </div>
  )
}
