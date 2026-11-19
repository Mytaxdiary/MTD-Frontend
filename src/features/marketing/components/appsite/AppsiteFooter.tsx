import { SITE_HOME, SITE_LEGAL, SITE_PAGES } from '@/features/marketing/nav'

/**
 * Shared marketing footer for inner pages. Markup mirrors the `.site-footer`
 * block in MTD-AppSite/*.html. Static — no interactivity required.
 */
export default function AppsiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-about reveal">
            <a href={SITE_HOME} className="logo footer-logo" aria-label="My Tax Diary home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/site/logo.png" alt="My Tax Diary" className="company-logo" />
            </a>
            <p>
              MTD Income Tax monitoring for accounting practices. See who has submitted, what is
              owed and when, all in one dashboard.
            </p>
          </div>

          <div className="foot-col reveal" style={{ ['--d' as string]: '.08s' } as React.CSSProperties}>
            <h5>Product</h5>
            <ul>
              <li>
                <a href={SITE_HOME}>Home</a>
              </li>
              <li>
                <a href={SITE_PAGES.features}>Features</a>
              </li>
              <li>
                <a href={SITE_PAGES.pricing}>Pricing</a>
              </li>
              <li>
                <a href={SITE_PAGES.contact}>Contact</a>
              </li>
            </ul>
          </div>

          <div className="foot-col reveal" style={{ ['--d' as string]: '.16s' } as React.CSSProperties}>
            <h5>Account</h5>
            <ul>
              <li>
                <a href="/login">Sign in</a>
              </li>
              <li>
                <a href="/register">Start free trial</a>
              </li>
              <li>
                <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
              </li>
            </ul>
          </div>

          <div className="foot-col reveal" style={{ ['--d' as string]: '.24s' } as React.CSSProperties}>
            <h5>Legal</h5>
            <ul>
              <li>
                <a href={SITE_LEGAL.terms}>Terms</a>
              </li>
              <li>
                <a href={SITE_LEGAL.privacy}>Privacy</a>
              </li>
              <li>
                <a href={SITE_LEGAL.cookies}>Cookies</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 My Tax Diary Ltd</span>
          <span>Company No. 17312332 · ICO ZC190729</span>
        </div>
      </div>
    </footer>
  )
}
