import type { Metadata } from 'next'
import LegalPage from '@/features/marketing/components/LegalPage'
import CookiesBody from '@/features/legal/CookiesBody'
import { SITE_LEGAL } from '@/features/marketing/nav'

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description:
    'Cookies Policy for My Tax Diary — how we use essential, preference, and analytics cookies.',
  alternates: { canonical: '/site/cookies' },
}

export default function MarketingCookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookies Policy"
      effectiveDate="20 July 2026"
      related={[
        { href: SITE_LEGAL.privacy, label: 'Privacy Policy' },
        { href: SITE_LEGAL.terms, label: 'Terms and Conditions' },
      ]}
    >
      <CookiesBody privacyHref={SITE_LEGAL.privacy} />
    </LegalPage>
  )
}
