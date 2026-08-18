import { incomeTypeKind, incomeTypeLabel } from '@/lib/helpers/clientType'

type TypePillsProps = {
  types: string[]
  compact?: boolean
}

export default function TypePills({ types, compact = false }: TypePillsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {types.map((type) => {
        const kind = incomeTypeKind(type)
        const se = kind === 'SE'
        return (
          <span
            key={type}
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 10,
              background: se ? '#F0F9FF' : '#F5F3FF',
              color: se ? '#0C4A6E' : '#5B21B6',
              border: `1px solid ${se ? '#BAE6FD' : '#DDD6FE'}`,
              whiteSpace: 'nowrap',
              textTransform: kind === 'other' ? 'capitalize' : undefined,
            }}
          >
            {incomeTypeLabel(type, compact)}
          </span>
        )
      })}
    </div>
  )
}
