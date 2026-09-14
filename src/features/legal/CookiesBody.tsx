import Link from 'next/link'
import { LegalBullets, LegalP, LegalSection } from './primitives'

type Props = {
  privacyHref: string
}

export default function CookiesBody({ privacyHref }: Props) {
  return (
    <div className="mtd-legal-stack">
      <LegalSection num="1" title="About This Policy">
        <LegalP>
          This Cookies Policy explains how My Tax Diary Ltd (&quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;) uses cookies and similar technologies on the My Tax Diary website and
          platform (the &quot;Service&quot;). It should be read with our{' '}
          <Link href={privacyHref}>Privacy Policy</Link>.
        </LegalP>
        <LegalP>Effective date: 20 July 2026.</LegalP>
      </LegalSection>

      <LegalSection num="2" title="What Are Cookies?">
        <LegalP>
          Cookies are small text files stored on your device when you visit a website. They help the
          site remember preferences, keep you signed in, and understand how the Service is used.
          Similar technologies may include local storage and pixels.
        </LegalP>
      </LegalSection>

      <LegalSection num="3" title="Cookies We Use">
        <LegalBullets
          items={[
            'Essential cookies: required for the Service to work, including authentication and session cookies that keep you logged in securely. These do not require consent.',
            'Security cookies: help protect accounts and detect abuse.',
            'Preference cookies: remember choices such as cookie consent status.',
            'Analytics cookies: help us understand how pages are used so we can improve the Service. We use Google Analytics where configured. Non-essential analytics cookies are only set with your consent where a consent banner is shown.',
          ]}
        />
      </LegalSection>

      <LegalSection num="4" title="Marketing Site and App">
        <LegalP>
          On the marketing pages, we may use analytics only when a measurement ID is configured and,
          where required, after you consent. Inside the signed-in product, essential cookies are
          required for login and security. Portal and agent sessions use httpOnly cookies set by our
          API.
        </LegalP>
      </LegalSection>

      <LegalSection num="5" title="Managing Cookies">
        <LegalP>
          You can control non-essential cookies through any cookie banner we display, and through
          your browser settings (block, delete, or alert on cookies). Blocking essential cookies may
          prevent sign-in and core features from working.
        </LegalP>
        <LegalP>
          If you previously consented to analytics, you can withdraw consent at any time via the
          banner controls (where available) or by clearing cookies in your browser.
        </LegalP>
      </LegalSection>

      <LegalSection num="6" title="More Information">
        <LegalP>
          For how we handle personal data more broadly, see our{' '}
          <Link href={privacyHref}>Privacy Policy</Link>. Questions:{' '}
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>.
        </LegalP>
      </LegalSection>
    </div>
  )
}
