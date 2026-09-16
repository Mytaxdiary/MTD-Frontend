import type { Metadata } from 'next'
import AppsiteLegalPage from '@/features/marketing/components/appsite/AppsiteLegalPage'
import PrivacyBody from '@/features/legal/PrivacyBody'
import { SITE_LEGAL } from '@/features/marketing/nav'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How My Tax Diary Ltd handles personal data. ICO registration ZC190729.',
  alternates: { canonical: '/site/privacy' },
}

export default function MarketingPrivacyPage() {
  return (
    <AppsiteLegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lead="How My Tax Diary Ltd handles personal data. ICO registration ZC190729."
      effectiveDate="20 July 2026"
      related={[
        { href: SITE_LEGAL.terms, label: 'Terms and Conditions' },
        { href: SITE_LEGAL.cookies, label: 'Cookies Policy' },
      ]}
    >
      <PrivacyBody termsHref={SITE_LEGAL.terms} cookiesHref={SITE_LEGAL.cookies} />
    </AppsiteLegalPage>
  )
}
