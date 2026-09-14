'use client'

import Script from 'next/script'
import { env } from '@/lib/env'

/**
 * Loads Google Analytics only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Deploy / analytics IDs are ops-owned — leave unset in local/dev.
 */
export default function SiteAnalytics() {
  const id = env.gaMeasurementId
  if (!id) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="mtd-ga" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
