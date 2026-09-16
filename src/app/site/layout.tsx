import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import SiteAnalytics from '@/features/marketing/components/SiteAnalytics'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'https://mytaxdiary.co.uk'

const description =
  'The complete MTD for Income Tax solution for UK accountants. Agent portal, client portal, HMRC connection, chasing and staff controls.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'My Tax Diary — MTD ITSA software for UK accountants',
    template: '%s | My Tax Diary',
  },
  description,
  applicationName: 'My Tax Diary',
  keywords: [
    'MTD ITSA',
    'Making Tax Digital',
    'UK accountants',
    'tax agent software',
    'HMRC',
    'client portal',
    'My Tax Diary',
  ],
  authors: [{ name: 'My Tax Diary Ltd' }],
  creator: 'My Tax Diary Ltd',
  publisher: 'My Tax Diary Ltd',
  alternates: { canonical: '/site' },
  icons: {
    icon: [
      { url: '/site/favicon.ico', sizes: 'any' },
      { url: '/site/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/site/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/site/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
    ],
    apple: [{ url: '/site/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/site',
    siteName: 'My Tax Diary',
    title: 'My Tax Diary — MTD ITSA software for UK accountants',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Tax Diary — MTD ITSA software for UK accountants',
    description,
  },
  robots: { index: true, follow: true },
}

export default function MarketingSiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Fonts — matches MTD-AppSite <head> exactly */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Caveat:wght@500;600&display=swap"
        rel="stylesheet"
      />
      <SiteAnalytics />
      {children}
    </>
  )
}
