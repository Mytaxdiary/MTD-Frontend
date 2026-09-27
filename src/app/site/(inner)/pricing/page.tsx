import type { Metadata } from 'next'
import pricingHtml from '@/features/marketing/appsite-html/pricing'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Draft MTD packages for accounting firms. Compare Starter, Growth and Scale by client journey features and team capacity.',
  alternates: { canonical: '/site/pricing' },
}

export default function MarketingPricingPage() {
  return <div dangerouslySetInnerHTML={{ __html: pricingHtml }} />
}
