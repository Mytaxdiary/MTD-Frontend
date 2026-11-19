'use client'

import { usePathname } from 'next/navigation'
import { SITE_HOME, SITE_NAV, SITE_PAGES } from '@/features/marketing/nav'

/**
 * Shared marketing header for inner pages (features/pricing/contact/legal).
 * Markup mirrors MTD-AppSite/*.html `.site-header`. Interactivity (sticky
 * shadow + burger toggle) is handled by /public/site/site.js. Cross-page
 * links are plain anchors so each marketing route loads its own stylesheet.
 */
const NAV = SITE_NAV

function isActive(pathname: string, href: string) {
  if (href === SITE_HOME) return pathname === '/site' || pathname === '/'
  if (href === SITE_PAGES.features) return pathname.startsWith('/site/features') || pathname.startsWith('/features')
  if (href === SITE_PAGES.pricing) return pathname.startsWith('/site/pricing') || pathname.startsWith('/pricing')
  if (href === SITE_PAGES.contact) return pathname.startsWith('/site/contact') || pathname.startsWith('/contact')
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AppsiteHeader() {
  const pathname = usePathname() || '/site'

  return (
    <header className="site-header">
      <div className="wrap nav">
        <a href={SITE_HOME} className="logo" aria-label="My Tax Diary home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/site/logo.png" alt="My Tax Diary" className="company-logo" />
        </a>

        <nav className="nav-links">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? 'active' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a href="/login" className="btn btn-ghost btn-sm">
            Sign in
          </a>
          <a href="/register" className="btn btn-primary btn-sm">
            Start free trial
          </a>
          <button className="burger" aria-label="Open menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className="mobile-menu" id="mobileMenu">
        <div className="wrap">
          <nav>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={isActive(pathname, item.href) ? 'active' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="m-cta">
            <a href="/login" className="btn btn-ghost">
              Sign in
            </a>
            <a href="/register" className="btn btn-primary">
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
