import type { Metadata } from 'next'
import Script from 'next/script'
import homeHtml from '@/features/marketing/appsite-html/home'
import '@/features/marketing/styles/appsite-home.css'

export const metadata: Metadata = {
  title: { absolute: 'My Tax Diary: MTD Income Tax monitoring for accountants' },
  description:
    "See every client's MTD Income Tax status, what they owe and when, in one dashboard. Read-only HMRC data, client chasers and a client portal.",
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
