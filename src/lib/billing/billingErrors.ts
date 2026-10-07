export type BillingGateCode = 'TRIAL_EXPIRED' | 'SUBSCRIPTION_REQUIRED' | 'TRIAL_DOMAIN_USED'

const CODES: BillingGateCode[] = ['TRIAL_EXPIRED', 'SUBSCRIPTION_REQUIRED', 'TRIAL_DOMAIN_USED']

/** Extract stable billing code from Nest Unauthorized/Conflict messages. */
export function parseBillingErrorCode(message: string | null | undefined): BillingGateCode | null {
  if (!message) return null
  for (const code of CODES) {
    if (message.includes(`[${code}]`) || message.includes(code)) {
      return code
    }
  }
  return null
}

export function isBillingGateCode(code: string | null | undefined): code is BillingGateCode {
  return code === 'TRIAL_EXPIRED' || code === 'SUBSCRIPTION_REQUIRED'
}

export function paywallPath(code: BillingGateCode, message?: string): string {
  const params = new URLSearchParams({ code })
  if (message) params.set('message', message)
  return `/billing/paywall?${params.toString()}`
}
