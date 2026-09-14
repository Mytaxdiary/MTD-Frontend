import Link from 'next/link'
import type { Metadata } from 'next'
import TermsBody from '@/features/legal/TermsBody'
import '@/features/legal/legal.css'

export const metadata: Metadata = {
  title: 'Terms and Conditions | My Tax Diary',
  description: 'Terms and Conditions for My Tax Diary Ltd.',
}

export default function TermsPage() {
  return (
    <div className="mtd-legal-standalone">
      <nav className="mtd-legal-standalone__nav">
        <Link href="/" className="mtd-legal-standalone__brand">
          My Tax Diary
        </Link>
        <div className="mtd-legal-standalone__links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/login">Sign in</Link>
        </div>
      </nav>

      <div className="mtd-legal-standalone__wrap">
        <header className="mtd-legal-standalone__header">
          <p className="mtd-legal-standalone__eyebrow">My Tax Diary Ltd, My Tax Diary Platform</p>
          <h1>Terms and Conditions</h1>
          <p className="mtd-legal-standalone__meta">Effective date: 20 July 2026</p>
        </header>

        <TermsBody privacyHref="/privacy-policy" />

        <div className="mtd-legal-standalone__footer">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/login">Sign in</Link>
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
          <span>My Tax Diary Ltd, Company No. 17312332</span>
        </div>
      </div>
    </div>
  )
}
