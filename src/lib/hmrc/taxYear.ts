/** Current UK tax year label (6 April boundary), e.g. 2025-26 */
export function currentUkTaxYear(): string {
  const now = new Date()
  let startYear = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  if (month < 3 || (month === 3 && day < 6)) {
    startYear -= 1
  }
  const endShort = String((startYear + 1) % 100).padStart(2, '0')
  return `${startYear}-${endShort}`
}

/** Inclusive HMRC date range for a tax year label like 2026-27 → 6 Apr 2026 to 5 Apr 2027. */
export function taxYearDateRange(taxYear: string): { fromDate: string; toDate: string } {
  const startYear = parseInt(taxYear.split('-')[0] ?? '', 10)
  if (!Number.isFinite(startYear)) {
    const current = currentUkTaxYear()
    return taxYearDateRange(current)
  }
  return {
    fromDate: `${startYear}-04-06`,
    toDate: `${startYear + 1}-04-05`,
  }
}
