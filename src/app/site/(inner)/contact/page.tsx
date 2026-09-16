import type { Metadata } from 'next'
import AppsiteContactForm from '@/features/marketing/components/appsite/AppsiteContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us about your firm and what you need for MTD ITSA. We reply with package guidance.',
  alternates: { canonical: '/site/contact' },
}

type PageProps = {
  searchParams?: Promise<{ plan?: string }>
}

export default async function MarketingContactPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}
  const plan = typeof params.plan === 'string' ? params.plan : ''

  return <AppsiteContactForm initialPlan={plan} />
}
