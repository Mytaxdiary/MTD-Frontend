import type { Metadata } from 'next'
import featuresHtml from '@/features/marketing/appsite-html/features'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Agent tools, client visibility, HMRC connection, chasing and staff controls for UK accountants.',
  alternates: { canonical: '/site/features' },
}

export default function MarketingFeaturesPage() {
  return <div dangerouslySetInnerHTML={{ __html: featuresHtml }} />
}
