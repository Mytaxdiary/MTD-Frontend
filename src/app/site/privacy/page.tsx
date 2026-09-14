import type { Metadata } from 'next'
import LegalPage from '@/features/marketing/components/LegalPage'
import PrivacyBody from '@/features/legal/PrivacyBody'
import { SITE_LEGAL } from '@/features/marketing/nav'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for My Tax Diary Ltd — how we collect and use personal data for UK accountancy firms.',
  alternates: { canonical: '/site/privacy' },
}

export default function MarketingPrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="20 July 2026"
      related={[
        { href: SITE_LEGAL.terms, label: 'Terms and Conditions' },
        { href: SITE_LEGAL.cookies, label: 'Cookies Policy' },
      ]}
    >
      <PrivacyBody termsHref={SITE_LEGAL.terms} cookiesHref={SITE_LEGAL.cookies} />
    </LegalPage>
  )
}
