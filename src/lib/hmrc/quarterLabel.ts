/** Short UK date: "2 Aug 2025" (no leading zero on day) */
export function fmtUkShortDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleDateString('en-GB', { month: 'short' })
  return `${day} ${month} ${d.getFullYear()}`
}

/** Period range like mock: "6 Apr – 5 Jul 2025" */
export function fmtUkPeriodRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const part = (d: Date, withYear: boolean) => {
    const day = d.getDate()
    const month = d.toLocaleDateString('en-GB', { month: 'short' })
    return withYear ? `${day} ${month} ${d.getFullYear()}` : `${day} ${month}`
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${part(s, false)} – ${part(e, true)}`
  }
  return `${part(s, true)} – ${part(e, true)}`
}

/** UK MTD quarter label from obligation period start (6 Apr–5 Jul = Q1, etc.) */
export function ukQuarterFromPeriodStart(periodStartDate: string): string {
  const d = new Date(periodStartDate)
  const month = d.getMonth()
  const day = d.getDate()

  if (month === 3 && day >= 6) return 'Q1'
  if (month >= 4 && month <= 5) return 'Q1'
  if (month === 6 && day <= 5) return 'Q1'

  if (month === 6 && day >= 6) return 'Q2'
  if (month >= 7 && month <= 8) return 'Q2'
  if (month === 9 && day <= 5) return 'Q2'

  if (month === 9 && day >= 6) return 'Q3'
  if (month >= 10 && month <= 11) return 'Q3'
  if (month === 0 && day <= 5) return 'Q3'

  if (month === 0 && day >= 6) return 'Q4'
  if (month >= 1 && month <= 2) return 'Q4'
  if (month === 3 && day <= 5) return 'Q4'

  return 'Q?'
}
