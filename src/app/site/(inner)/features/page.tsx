import type { Metadata } from 'next'
import featuresHtml from '@/features/marketing/appsite-html/features'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Kanban and list status, digital handshake, deadlines and liabilities, chase, portal, and team permissions for MTD Income Tax.',
  alternates: { canonical: '/site/features' },
}

export default function MarketingFeaturesPage() {
  return <div dangerouslySetInnerHTML={{ __html: featuresHtml }} />
}
