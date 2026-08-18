export type IncomeTypeKind = 'SE' | 'Prop' | 'other'

function normalisedType(type: string): string {
  return type.trim().toLowerCase().replace(/[_ ]+/g, '-')
}

export function incomeTypeKind(type: string): IncomeTypeKind {
  const t = normalisedType(type)
  if (t === 'se' || t.includes('self-employment')) return 'SE'
  if (t === 'prop' || t.includes('uk-property') || t === 'property') return 'Prop'
  return 'other'
}

export function incomeTypeLabel(type: string, compact = false): string {
  const kind = incomeTypeKind(type)
  if (kind === 'SE') return compact ? 'Self-emp' : 'Self-employment'
  if (kind === 'Prop') return compact ? 'Property' : 'UK Property'
  return type.replace(/-/g, ' ')
}

export function matchesTypeFilter(types: string[], filter: string): boolean {
  if (filter === 'all') return true
  const kinds = types.map(incomeTypeKind)
  if (filter === 'both') return kinds.includes('SE') && kinds.includes('Prop')
  if (filter === 'SE') return kinds.includes('SE')
  if (filter === 'Prop') return kinds.includes('Prop')
  return types.includes(filter)
}
