import type { BillingGateCode } from './billingErrors'

/** Marketing + paywall: start a new firm trial. */
export const BILLING_START_TRIAL_HREF = '/register'

/** Public pricing page (ex-VAT usage model). */
export const BILLING_PRICING_HREF = '/site/pricing'

/** In-app Plan & billing (owner Subscribe / Manage billing). */
export const BILLING_SUBSCRIBE_HREF = '/settings?section=billing'

export const BILLING_CONTACT_HREF = '/site/contact'

export interface PaywallCopy {
  title: string
  detail: string
  bullets: string[]
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

/** Stable, human copy for the agent paywall — keep in sync with marketing pricing FAQs. */
export function getPaywallCopy(code: BillingGateCode | null): PaywallCopy {
  if (code === 'TRIAL_DOMAIN_USED') {
    return {
      title: 'A free trial was already used for this email domain',
      detail:
        'Corporate domains only get one free trial. You can subscribe for a new firm, or contact support if you need the domain unlocked.',
      bullets: [
        'Personal mailboxes (gmail, outlook, yahoo) are not blocked',
        'Support can clear a corporate domain lock if needed',
        'Pricing is £50/month for up to 50 clients, ex VAT',
      ],
      primaryLabel: 'View pricing',
      primaryHref: BILLING_PRICING_HREF,
      secondaryLabel: 'Contact support',
      secondaryHref: BILLING_CONTACT_HREF,
    }
  }

  if (code === 'TRIAL_EXPIRED') {
    return {
      title: 'Your free trial has ended',
      detail:
        'Subscribe to keep managing clients, HMRC submissions, and the client portal in My Tax Diary. Your firm data stays safe while you decide.',
      bullets: [
        '£50/month covers your first 50 clients (ex VAT)',
        'Extra clients step down to a 50p floor',
        'Monthly billing only. Cancel anytime',
      ],
      primaryLabel: 'View pricing & subscribe',
      primaryHref: BILLING_PRICING_HREF,
      secondaryLabel: 'Contact support',
      secondaryHref: BILLING_CONTACT_HREF,
    }
  }

  // SUBSCRIPTION_REQUIRED + default
  return {
    title: 'Subscription required',
    detail:
      'A paid subscription is required to continue using the agent portal. Subscribe from pricing, or contact us if you think this is a mistake.',
    bullets: [
      'Same product for every firm. No feature packages',
      'Usage pricing based on billable clients',
      'VAT added separately on your invoice',
    ],
    primaryLabel: 'View pricing & subscribe',
    primaryHref: BILLING_PRICING_HREF,
    secondaryLabel: 'Contact support',
    secondaryHref: BILLING_CONTACT_HREF,
  }
}
