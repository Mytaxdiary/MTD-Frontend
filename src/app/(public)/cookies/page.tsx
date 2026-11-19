import Link from 'next/link'
import type { Metadata } from 'next'
import CookiesBody from '@/features/legal/CookiesBody'
import { SITE_APP_LOGIN, SITE_HOME, SITE_LEGAL } from '@/features/marketing/nav'
import '@/features/legal/legal.css'

export const metadata: Metadata = {
  title: 'Cookies Policy | My Tax Diary',
  description: 'Cookies Policy for My Tax Diary Ltd.',
  alternates: { canonical: SITE_LEGAL.cookies },
}

export default function CookiesPage() {
  return (
    <div className="mtd-legal-standalone">
      <nav className="mtd-legal-standalone__nav">
        <Link href={SITE_HOME} className="mtd-legal-standalone__brand">
          My Tax Diary
        </Link>
        <div className="mtd-legal-standalone__links">
          <Link href={SITE_LEGAL.privacy}>Privacy Policy</Link>
          <Link href={SITE_LEGAL.terms}>Terms</Link>
          <Link href={SITE_APP_LOGIN}>Sign in</Link>
        </div>
      </nav>

      <div className="mtd-legal-standalone__wrap">
        <header className="mtd-legal-standalone__header">
          <p className="mtd-legal-standalone__eyebrow">My Tax Diary Ltd, My Tax Diary Platform</p>
          <h1>Cookies Policy</h1>
          <p className="mtd-legal-standalone__meta">Effective date: 20 July 2026</p>
        </header>

        <CookiesBody privacyHref={SITE_LEGAL.privacy} />

        <div className="mtd-legal-standalone__footer">
          <Link href={SITE_LEGAL.privacy}>Privacy Policy</Link>
          <Link href={SITE_LEGAL.terms}>Terms</Link>
          <Link href={SITE_APP_LOGIN}>Sign in</Link>
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
          <span>My Tax Diary Ltd, Company No. 17312332</span>
        </div>
      </div>
    </div>
  )
}
