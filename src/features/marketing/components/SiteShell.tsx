import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="mtd-site">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="mtd-site-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
