import type { ReactNode } from 'react'
import Link from 'next/link'
import SiteContainer from '@/features/marketing/components/SiteContainer'

type LegalPageProps = {
  eyebrow: string
  title: string
  effectiveDate: string
  children: ReactNode
  related?: { href: string; label: string }[]
}

export default function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  children,
  related = [],
}: LegalPageProps) {
  return (
    <>
      <section className="mtd-page-hero mtd-legal-hero">
        <SiteContainer>
          <p className="mtd-page-hero__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>Effective date: {effectiveDate}</p>
        </SiteContainer>
      </section>

      <section className="mtd-home-section mtd-legal-doc">
        <SiteContainer>
          {children}
          {related.length > 0 ? (
            <nav className="mtd-legal-related" aria-label="Related legal pages">
              {related.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
              <span>My Tax Diary Ltd, Company No. 17312332</span>
            </nav>
          ) : null}
        </SiteContainer>
      </section>
    </>
  )
}
