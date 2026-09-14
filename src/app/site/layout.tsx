import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Outfit, DM_Sans } from 'next/font/google'
import SiteShell from '@/features/marketing/components/SiteShell'
import SiteAnalytics from '@/features/marketing/components/SiteAnalytics'
import '@/features/marketing/styles/site.css'
import '@/features/legal/legal.css'

const display = Outfit({
  subsets: ['latin'],
  variable: '--font-mtd-display',
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-mtd-body',
  display: 'swap',
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'https://mytaxdiary.co.uk'

const description =
  'MTD ITSA software for UK accountants. Agent portal, client portal, HMRC connection, chase, and staff permissions.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'My Tax Diary — MTD ITSA for UK accountants',
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
  alternates: {
    canonical: '/site',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/site',
    siteName: 'My Tax Diary',
    title: 'My Tax Diary — MTD ITSA for UK accountants',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Tax Diary — MTD ITSA for UK accountants',
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MarketingSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <SiteAnalytics />
      <SiteShell>{children}</SiteShell>
    </div>
  )
}
