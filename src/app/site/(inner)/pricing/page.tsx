import type { Metadata } from 'next'
import pricingHtml from '@/features/marketing/appsite-html/pricing'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple usage pricing for accounting firms: £50/month for up to 50 clients, with the per-client rate dropping as your book grows. Free 7-day trial, no card required.',
  alternates: { canonical: '/site/pricing' },
}

export default function MarketingPricingPage() {
  return <div dangerouslySetInnerHTML={{ __html: pricingHtml }} />
}
