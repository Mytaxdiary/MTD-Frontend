import type { ReactNode } from 'react'
import Script from 'next/script'
import AppsiteHeader from '@/features/marketing/components/appsite/AppsiteHeader'
import AppsiteFooter from '@/features/marketing/components/appsite/AppsiteFooter'
import { env } from '@/lib/env'
import '@/features/marketing/styles/appsite-inner.css'

/**
 * Shared shell for inner marketing pages (features/pricing/contact/legal).
 * Loads the AppSite inner stylesheet + behaviour and wraps each page with the
 * shared header/footer. The home page (/site) has its own separate chrome.
 */
export default function MarketingInnerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppsiteHeader />
      {children}
      <AppsiteFooter />
      {/* Lets the plain-JS pricing calculator in site.js call the live API
          without hardcoding/duplicating the base URL in a static asset. */}
      <Script id="mtd-site-config" strategy="beforeInteractive">
        {`window.__MTD_API_BASE__ = ${JSON.stringify(env.apiBaseUrl)};`}
      </Script>
      <Script src="/site/site.js" strategy="afterInteractive" />
    </>
  )
}
