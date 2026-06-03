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
