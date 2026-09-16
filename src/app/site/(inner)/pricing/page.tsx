import type { Metadata } from 'next'
import pricingHtml from '@/features/marketing/appsite-html/pricing'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple MTD ITSA packages for UK accounting firms. Compare Starter, Growth and Scale.',
  alternates: { canonical: '/site/pricing' },
}

export default function MarketingPricingPage() {
  return <div dangerouslySetInnerHTML={{ __html: pricingHtml }} />
}
