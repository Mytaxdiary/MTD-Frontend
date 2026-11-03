import type { Metadata } from 'next'
import featuresHtml from '@/features/marketing/appsite-html/features'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Track MTD submission status, liabilities and due dates from HMRC, send client chasers and give clients a portal. Works alongside your filing software.',
  openGraph: {
    title: 'Features | My Tax Diary',
    description:
      'Track MTD submission status, liabilities and due dates from HMRC, send client chasers and give clients a portal. Works alongside your filing software.',
    url: '/site/features',
  },
  twitter: {
    title: 'Features | My Tax Diary',
    description:
      'Track MTD submission status, liabilities and due dates from HMRC, send client chasers and give clients a portal. Works alongside your filing software.',
  },
  alternates: { canonical: '/site/features' },
}

export default function MarketingFeaturesPage() {
  return <div dangerouslySetInnerHTML={{ __html: featuresHtml }} />
}
