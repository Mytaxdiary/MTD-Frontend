import type { Metadata } from 'next'
import Script from 'next/script'
import homeHtml from '@/features/marketing/appsite-html/home'
import '@/features/marketing/styles/appsite-home.css'

export const metadata: Metadata = {
  title: { absolute: 'My Tax Diary: MTD Income Tax monitoring for accounting firms' },
  description:
    "See every client's MTD ITSA status, liabilities and due dates in one dashboard, with automatic chasers and a client view. Read-only from HMRC. Built by accountants.",
  alternates: { canonical: '/site' },
}

export default function MarketingHomePage() {
  return (
    <>
      {/* Verbatim MTD-AppSite home markup; behaviour from /public/site/home.js */}
      <div dangerouslySetInnerHTML={{ __html: homeHtml }} />
      <Script src="/site/home.js" strategy="afterInteractive" />
    </>
  )
}
