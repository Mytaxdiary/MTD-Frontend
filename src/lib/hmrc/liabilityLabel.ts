import type { HmrcAccountDocumentDetail } from '@/services/clients.service'

const SANDBOX_SENTINEL = 99999999999.99

/** HMRC sandbox returns ±99999999999.99 as placeholder — treat as missing. */
export function sanitizeHmrcAmount(value?: number | null): number | null {
  if (value == null || Number.isNaN(value)) return null
  if (Math.abs(value) >= SANDBOX_SENTINEL - 1) return null
  return value
}

export function formatLiabilityDescription(doc: HmrcAccountDocumentDetail): string {
  const taxYear = doc.taxYear ? ` ${doc.taxYear}` : ''
  switch (doc.documentDescription) {
    case 'ITSA- POA 1':
      return `1st payment on account${taxYear}`
    case 'ITSA - POA 2':
      return `2nd payment on account${taxYear}`
    case 'ITSA- Bal Charge':
      return `Balancing payment${taxYear}`
    default:
      return `${doc.documentDescription ?? doc.documentText ?? 'Charge'}${taxYear}`
  }
}

export function liabilityInterestAmount(doc: HmrcAccountDocumentDetail): number | null {
  const interest = doc.latePaymentInterest
  if (!interest) return null
  return (
    sanitizeHmrcAmount(interest.interestOutstandingAmount) ??
    sanitizeHmrcAmount(interest.accruingInterestAmount) ??
    sanitizeHmrcAmount(interest.interestAmount)
  )
}

export type LiabilityRowStatus = 'paid' | 'upcoming' | 'overdue'

export function liabilityRowStatus(doc: HmrcAccountDocumentDetail): LiabilityRowStatus {
  const outstanding = doc.outstandingAmount ?? 0
  if (outstanding <= 0) return 'paid'
  if (!doc.documentDueDate) return 'upcoming'
  const due = new Date(doc.documentDueDate)
  due.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today ? 'overdue' : 'upcoming'
}

const NON_LIABILITY_DESCRIPTIONS = new Set(['Payment', 'Repayment', 'Clearing Document'])

/** Charge rows for the liabilities table (exclude payments/credits). */
export function filterLiabilityDocuments(
  docs: HmrcAccountDocumentDetail[] | undefined,
): HmrcAccountDocumentDetail[] {
  return (docs ?? []).filter((doc) => {
    const desc = doc.documentDescription ?? ''
    if (NON_LIABILITY_DESCRIPTIONS.has(desc)) return false
    if (doc.creditReason && !doc.documentDescription) return false
    const original = doc.originalAmount ?? 0
    const outstanding = doc.outstandingAmount ?? 0
    return original > 0 || outstanding > 0
  })
}
