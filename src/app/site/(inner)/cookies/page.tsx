import type { Metadata } from 'next'
import AppsiteLegalPage from '@/features/marketing/components/appsite/AppsiteLegalPage'
import CookiesBody from '@/features/legal/CookiesBody'
import { SITE_LEGAL } from '@/features/marketing/nav'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'The cookies this site sets and what they are used for.',
  alternates: { canonical: '/site/cookies' },
}

export default function MarketingCookiesPage() {
  return (
    <AppsiteLegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      lead="The cookies this site sets and what they are used for."
      effectiveDate="20 July 2026"
      related={[
        { href: SITE_LEGAL.privacy, label: 'Privacy Policy' },
        { href: SITE_LEGAL.terms, label: 'Terms and Conditions' },
      ]}
    >
      <CookiesBody privacyHref={SITE_LEGAL.privacy} />
    </AppsiteLegalPage>
  )
}
