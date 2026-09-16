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
            <a href="/site" className="logo footer-logo" aria-label="My Tax Diary home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/site/logo.png" alt="My Tax Diary" className="company-logo" />
            </a>
            <p>
              MTD ITSA software for UK accountants. Agent portal, client portal, HMRC, chase, and
              staff.
            </p>
          </div>

          <div className="foot-col reveal" style={{ ['--d' as string]: '.08s' } as React.CSSProperties}>
            <h5>Product</h5>
            <ul>
              <li>
                <a href="/site">Home</a>
              </li>
              <li>
                <a href="/site/features">Features</a>
              </li>
              <li>
                <a href="/site/pricing">Pricing</a>
              </li>
              <li>
                <a href="/site/contact">Contact</a>
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
                <a href="/register">Get started</a>
              </li>
              <li>
                <a href="mailto:info@mytaxdiary.co.uk">Contact email</a>
              </li>
            </ul>
          </div>

          <div className="foot-col reveal" style={{ ['--d' as string]: '.24s' } as React.CSSProperties}>
            <h5>Legal</h5>
            <ul>
              <li>
                <a href="/site/terms">Terms</a>
              </li>
              <li>
                <a href="/site/privacy">Privacy</a>
              </li>
              <li>
                <a href="/site/cookies">Cookies</a>
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
