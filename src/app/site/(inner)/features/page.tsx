import type { Metadata } from 'next'
import featuresHtml from '@/features/marketing/appsite-html/features'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'MTD ITSA monitoring for firms: submission status from HMRC, liabilities and due dates, automatic chasers, and a client dashboard. We do not file; your software does.',
  alternates: { canonical: '/site/features' },
}

export default function MarketingFeaturesPage() {
  return <div dangerouslySetInnerHTML={{ __html: featuresHtml }} />
}
