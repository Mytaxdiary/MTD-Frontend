import { getPaywallCopy, BILLING_PRICING_HREF, BILLING_START_TRIAL_HREF } from '@/lib/billing/billingCopy'

describe('getPaywallCopy', () => {
  it('uses trial-ended copy for TRIAL_EXPIRED', () => {
    const copy = getPaywallCopy('TRIAL_EXPIRED')
    expect(copy.title).toMatch(/trial has ended/i)
    expect(copy.primaryHref).toBe(BILLING_PRICING_HREF)
    expect(copy.primaryLabel).toMatch(/pricing/i)
  })

  it('uses domain-lock copy for TRIAL_DOMAIN_USED', () => {
    const copy = getPaywallCopy('TRIAL_DOMAIN_USED')
    expect(copy.title).toMatch(/email domain/i)
    expect(copy.secondaryHref).toBe('/site/contact')
  })

  it('defaults to subscription-required copy', () => {
    const copy = getPaywallCopy('SUBSCRIPTION_REQUIRED')
    expect(copy.title).toMatch(/Subscription required/i)
  })

  it('keeps start-trial href on /register', () => {
    expect(BILLING_START_TRIAL_HREF).toBe('/register')
  })
})
