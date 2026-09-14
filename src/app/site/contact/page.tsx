import ContactEnquiryForm from '@/features/marketing/components/ContactEnquiryForm'

export const metadata = {
  title: 'Contact',
  description:
    'Enquire about My Tax Diary packages for UK accountants. Tell us about your firm and MTD ITSA needs.',
  alternates: { canonical: '/site/contact' },
}

type PageProps = {
  searchParams?: Promise<{ plan?: string }>
}

export default async function MarketingContactPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}
  const plan = typeof params.plan === 'string' ? params.plan : ''

  return <ContactEnquiryForm initialPlan={plan} />
}
