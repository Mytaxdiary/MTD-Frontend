import type { Metadata } from 'next'
import Script from 'next/script'
import homeHtml from '@/features/marketing/appsite-html/home'
import '@/features/marketing/styles/appsite-home.css'

export const metadata: Metadata = {
  title: { absolute: 'My Tax Diary — MTD Income Tax for accounting firms' },
  description:
    'Track client journeys for Making Tax Digital: deadlines, liabilities, kanban and list status, digital handshake, chase, and portal access. Built by accountants.',
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
