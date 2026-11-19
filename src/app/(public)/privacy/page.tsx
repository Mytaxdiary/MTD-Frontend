import Link from 'next/link'
import type { Metadata } from 'next'
import PrivacyBody from '@/features/legal/PrivacyBody'
import { SITE_HOME, SITE_LEGAL } from '@/features/marketing/nav'
import '@/features/legal/legal.css'

export const metadata: Metadata = {
  title: 'Privacy Policy | My Tax Diary',
  description: 'Privacy Policy for My Tax Diary Ltd.',
  alternates: { canonical: SITE_LEGAL.privacy },
}

export default function PrivacyPage() {
  return (
    <div className="mtd-legal-standalone">
      <nav className="mtd-legal-standalone__nav">
        <Link href={SITE_HOME} className="mtd-legal-standalone__brand">
          My Tax Diary
        </Link>
        <div className="mtd-legal-standalone__links">
          <Link href={SITE_LEGAL.terms}>Terms &amp; Conditions</Link>
          <Link href={SITE_LEGAL.cookies}>Cookies</Link>
          <Link href="/login">Sign in</Link>
        </div>
      </nav>

      <div className="mtd-legal-standalone__wrap">
        <header className="mtd-legal-standalone__header">
          <p className="mtd-legal-standalone__eyebrow">My Tax Diary Ltd, My Tax Diary Platform</p>
          <h1>Privacy Policy</h1>
          <p className="mtd-legal-standalone__meta">Effective date: 20 July 2026</p>
        </header>

        <PrivacyBody termsHref={SITE_LEGAL.terms} cookiesHref={SITE_LEGAL.cookies} />

        <div className="mtd-legal-standalone__footer">
          <Link href={SITE_LEGAL.terms}>Terms &amp; Conditions</Link>
          <Link href={SITE_LEGAL.cookies}>Cookies</Link>
          <Link href="/login">Sign in</Link>
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
          <span>My Tax Diary Ltd, Company No. 17312332</span>
        </div>
      </div>
    </div>
  )
}
