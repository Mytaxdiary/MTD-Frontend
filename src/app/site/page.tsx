import type { Metadata } from 'next'
import Script from 'next/script'
import homeHtml from '@/features/marketing/appsite-html/home'
import '@/features/marketing/styles/appsite-home.css'

export const metadata: Metadata = {
  title: { absolute: 'My Tax Diary — MTD ITSA software for UK accountants' },
  description:
    'The complete MTD for Income Tax solution for UK accountants. Agent portal, client portal, HMRC connection, chasing and staff controls.',
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
