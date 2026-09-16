import type { Metadata } from 'next'
import AppsiteLegalPage from '@/features/marketing/components/appsite/AppsiteLegalPage'
import TermsBody from '@/features/legal/TermsBody'
import { SITE_LEGAL } from '@/features/marketing/nav'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Terms and Conditions for My Tax Diary — MTD ITSA software for UK accountants and tax agents.',
  alternates: { canonical: '/site/terms' },
}

export default function MarketingTermsPage() {
  return (
    <AppsiteLegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      lead="The terms that apply when you use My Tax Diary."
      effectiveDate="20 July 2026"
      related={[
        { href: SITE_LEGAL.privacy, label: 'Privacy Policy' },
        { href: SITE_LEGAL.cookies, label: 'Cookies Policy' },
      ]}
    >
      <TermsBody privacyHref={SITE_LEGAL.privacy} />
    </AppsiteLegalPage>
  )
}
