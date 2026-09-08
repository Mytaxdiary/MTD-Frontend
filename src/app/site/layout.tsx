import type { ReactNode } from 'react'
import { Outfit, DM_Sans } from 'next/font/google'
import SiteShell from '@/features/marketing/components/SiteShell'
import '@/features/marketing/styles/site.css'

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

export const metadata = {
  title: {
    default: 'My Tax Diary',
    template: '%s | My Tax Diary',
  },
  description:
    'MTD ITSA software for UK accountants. Agent portal, client portal, HMRC connection, chase, and staff permissions.',
}

export default function MarketingSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <SiteShell>{children}</SiteShell>
    </div>
  )
}
