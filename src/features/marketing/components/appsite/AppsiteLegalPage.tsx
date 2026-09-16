import type { ReactNode } from 'react'
import Link from 'next/link'
import '@/features/legal/legal.css'

type AppsiteLegalPageProps = {
  eyebrow: string
  title: string
  lead: string
  effectiveDate?: string
  children: ReactNode
  related?: { href: string; label: string }[]
}

/**
 * Legal page chrome for /site/terms|privacy|cookies.
 * Keeps the AppSite page-hero look, and renders the existing full legal bodies.
 */
export default function AppsiteLegalPage({
  eyebrow,
  title,
  lead,
  effectiveDate,
  children,
  related = [],
}: AppsiteLegalPageProps) {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{lead}</p>
          {effectiveDate ? (
            <p style={{ marginTop: 10, fontSize: 14, color: 'var(--muted)' }}>
              Effective date: {effectiveDate}
            </p>
          ) : null}
        </div>
      </section>

      <section>
        <div className="wrap">
          {/* No .reveal here — long legal docs never hit the 12% IO threshold, so they stayed opacity:0 */}
          <div style={{ maxWidth: 760 }}>
            {children}

            {related.length > 0 ? (
              <nav
                aria-label="Related legal pages"
                style={{
                  marginTop: 40,
                  paddingTop: 24,
                  borderTop: '1px solid var(--line)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 14,
                  fontSize: 14,
                  color: 'var(--body)',
                }}
              >
                {related.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ color: 'var(--accent-dark)', textDecoration: 'underline' }}
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="mailto:info@mytaxdiary.co.uk"
                  style={{ color: 'var(--accent-dark)', textDecoration: 'underline' }}
                >
                  info@mytaxdiary.co.uk
                </a>
                <span>My Tax Diary Ltd, Company No. 17312332</span>
              </nav>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
