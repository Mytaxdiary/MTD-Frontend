'use client'

import { useState } from 'react'
import SiteButton from '@/features/marketing/components/SiteButton'
import SiteContainer from '@/features/marketing/components/SiteContainer'
import { SITE_APP_REGISTER } from '@/features/marketing/nav'

type Billing = 'monthly' | 'annual'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For small firms starting MTD ITSA with a focused client list.',
    monthly: 49,
    annual: 39,
    cta: 'Get started',
    href: SITE_APP_REGISTER,
    enquireHref: '/site/contact?plan=starter',
    featured: false,
    points: [
      'Agent dashboard and client list',
      'HMRC connect for authorised clients',
      'Client portal access',
      'Email chase templates',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'For growing practices that need staff access and smoother chasing.',
    monthly: 99,
    annual: 79,
    cta: 'Get started',
    href: SITE_APP_REGISTER,
    enquireHref: '/site/contact?plan=growth',
    featured: true,
    points: [
      'Everything in Starter',
      'Staff invites and permissions',
      'Client assignment controls',
      'Portal chat and notifications',
      'Priority onboarding help',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    blurb: 'For larger teams that want volume capacity and closer support.',
    monthly: 179,
    annual: 149,
    cta: 'Contact us',
    href: '/site/contact?plan=scale',
    enquireHref: '/site/contact?plan=scale',
    featured: false,
    points: [
      'Everything in Growth',
      'Higher client capacity',
      'Advanced team controls',
      'Dedicated onboarding support',
      'Custom rollout discussion',
    ],
  },
] as const

const COMPARISON: { feature: string; starter: string; growth: string; scale: string }[] = [
  { feature: 'Agent dashboard', starter: 'Yes', growth: 'Yes', scale: 'Yes' },
  { feature: 'Client portal', starter: 'Yes', growth: 'Yes', scale: 'Yes' },
  { feature: 'HMRC MTD connection', starter: 'Yes', growth: 'Yes', scale: 'Yes' },
  { feature: 'Email chase', starter: 'Yes', growth: 'Yes', scale: 'Yes' },
  { feature: 'Staff permissions', starter: '—', growth: 'Yes', scale: 'Yes' },
  { feature: 'Client assignment', starter: '—', growth: 'Yes', scale: 'Yes' },
  { feature: 'Portal chat', starter: 'Basic', growth: 'Yes', scale: 'Yes' },
  { feature: 'Onboarding support', starter: 'Email', growth: 'Priority', scale: 'Dedicated' },
  { feature: 'Custom rollout', starter: '—', growth: '—', scale: 'Yes' },
]

const FAQS = [
  {
    q: 'Are these final prices?',
    a: 'Not yet. The figures below are draft placeholders so you can compare package shape. Final numbers will be confirmed with Adnan before go-live.',
  },
  {
    q: 'Can we switch packages later?',
    a: 'Yes. Start where you are and move up when your client volume or team size grows. Use the enquiry form if you want help choosing.',
  },
  {
    q: 'Is there a free trial?',
    a: 'You can register and explore the product. For a guided walkthrough or package advice, send an enquiry and we will follow up.',
  },
] as const

function priceLabel(billing: Billing, monthly: number, annual: number) {
  const amount = billing === 'monthly' ? monthly : annual
  return `£${amount}`
}

export default function PricingPlans() {
  const [billing, setBilling] = useState<Billing>('annual')

  return (
    <>
      <section className="mtd-page-hero">
        <SiteContainer>
          <p className="mtd-page-hero__eyebrow">Pricing</p>
          <h1>Simple packages for UK accounting firms</h1>
          <p>
            Choose a plan that matches your practice size. Draft prices shown for comparison —
            enquire if you want a package recommendation for your firm.
          </p>
          <div className="mtd-price-toggle" role="group" aria-label="Billing period">
            <button
              type="button"
              className="mtd-price-toggle__btn"
              data-active={billing === 'monthly'}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className="mtd-price-toggle__btn"
              data-active={billing === 'annual'}
              onClick={() => setBilling('annual')}
            >
              Annual <span className="mtd-price-toggle__save">Save ~20%</span>
            </button>
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section">
        <SiteContainer>
          <div className="mtd-price-grid">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className="mtd-price-card"
                data-featured={plan.featured ? 'true' : 'false'}
              >
                {plan.featured ? <span className="mtd-price-card__badge">Most popular</span> : null}
                <h2>{plan.name}</h2>
                <p className="mtd-price-card__blurb">{plan.blurb}</p>
                <p className="mtd-price-card__price">
                  <span>{priceLabel(billing, plan.monthly, plan.annual)}</span>
                  <small>/{billing === 'monthly' ? 'month' : 'month, billed annually'}</small>
                </p>
                <ul className="mtd-price-card__list">
                  {plan.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="mtd-price-card__actions">
                  <SiteButton
                    href={plan.href}
                    variant={plan.featured ? 'secondary' : 'ghost'}
                    block
                  >
                    {plan.cta}
                  </SiteButton>
                  {plan.id !== 'scale' ? (
                    <SiteButton href={plan.enquireHref} variant="ghost" block>
                      Enquire about {plan.name}
                    </SiteButton>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section mtd-home-section--surface">
        <SiteContainer>
          <div className="mtd-home-section__head">
            <h2>Compare packages</h2>
            <p>A quick view of what each draft plan includes.</p>
          </div>
          <div className="mtd-compare-wrap">
            <table className="mtd-compare">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Starter</th>
                  <th scope="col">Growth</th>
                  <th scope="col">Scale</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    <td>{row.starter}</td>
                    <td>{row.growth}</td>
                    <td>{row.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section">
        <SiteContainer>
          <div className="mtd-home-section__head">
            <h2>Pricing questions</h2>
            <p>Short answers while final package numbers are confirmed.</p>
          </div>
          <div className="mtd-price-faq">
            {FAQS.map((item) => (
              <div key={item.q} className="mtd-price-faq__item">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-cta">
        <SiteContainer>
          <h2>Need a package that fits your firm?</h2>
          <p>Tell us about your client volume and team size and we will help you choose.</p>
          <div className="mtd-home-cta__actions">
            <SiteButton href="/site/contact" variant="secondary">
              Enquire now
            </SiteButton>
            <SiteButton href="/site/features" variant="ghost">
              Review features
            </SiteButton>
          </div>
        </SiteContainer>
      </section>
    </>
  )
}
