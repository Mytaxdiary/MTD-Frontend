'use client'

import { FormEvent, useMemo, useState } from 'react'
import SiteButton from '@/features/marketing/components/SiteButton'
import SiteContainer from '@/features/marketing/components/SiteContainer'
import { env } from '@/lib/env'

type ContactEnquiryFormProps = {
  initialPlan?: string
}

type FormState = {
  name: string
  firm: string
  email: string
  phone: string
  message: string
  planInterest: string
  website: string
}

const PLAN_OPTIONS = [
  { value: '', label: 'Not sure yet' },
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'scale', label: 'Scale' },
] as const

function apiBase(): string {
  return env.apiBaseUrl || 'http://localhost:3500/api/v1'
}

export default function ContactEnquiryForm({ initialPlan = '' }: ContactEnquiryFormProps) {
  const defaultPlan = useMemo(() => {
    const match = PLAN_OPTIONS.find((p) => p.value && p.value === initialPlan.toLowerCase())
    return match?.value ?? ''
  }, [initialPlan])

  const [form, setForm] = useState<FormState>({
    name: '',
    firm: '',
    email: '',
    phone: '',
    message: '',
    planInterest: defaultPlan,
    website: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch(`${apiBase()}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          firm: form.firm.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim(),
          planInterest: form.planInterest || undefined,
          sourcePage: '/site/contact',
          website: form.website,
        }),
      })

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { message?: string | string[] }
          | null
        const msg = payload?.message
        throw new Error(
          Array.isArray(msg)
            ? msg.join(', ')
            : typeof msg === 'string'
              ? msg
              : 'Could not send your enquiry. Please try again.',
        )
      }

      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your enquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <section className="mtd-home-section">
        <SiteContainer>
          <div className="mtd-contact-success">
            <p className="mtd-page-hero__eyebrow">Enquiry sent</p>
            <h2>Thanks — we have received your message</h2>
            <p>
              Someone from My Tax Diary will get back to you shortly. If your enquiry is urgent,
              email us at info@mytaxdiary.co.uk.
            </p>
            <div className="mtd-page-hero__ctas">
              <SiteButton href="/site/features" variant="secondary">
                Explore features
              </SiteButton>
              <SiteButton href="/site/pricing" variant="ghost">
                View pricing
              </SiteButton>
            </div>
          </div>
        </SiteContainer>
      </section>
    )
  }

  return (
    <>
      <section className="mtd-page-hero">
        <SiteContainer>
          <p className="mtd-page-hero__eyebrow">Contact</p>
          <h1>Talk to us about My Tax Diary</h1>
          <p>
            Tell us about your firm and what you need for MTD ITSA. We will reply with package
            guidance or a follow-up conversation.
          </p>
        </SiteContainer>
      </section>

      <section className="mtd-home-section">
        <SiteContainer>
          <div className="mtd-contact-layout">
            <form className="mtd-contact-form" onSubmit={onSubmit} noValidate>
              <div className="mtd-contact-form__row">
                <label className="mtd-field">
                  <span>Your name</span>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </label>
                <label className="mtd-field">
                  <span>Firm name</span>
                  <input
                    name="firm"
                    autoComplete="organization"
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.firm}
                    onChange={(e) => update('firm', e.target.value)}
                  />
                </label>
              </div>

              <div className="mtd-contact-form__row">
                <label className="mtd-field">
                  <span>Work email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </label>
                <label className="mtd-field">
                  <span>
                    Phone <em>(optional)</em>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </label>
              </div>

              <label className="mtd-field">
                <span>Package interest</span>
                <select
                  name="planInterest"
                  value={form.planInterest}
                  onChange={(e) => update('planInterest', e.target.value)}
                >
                  {PLAN_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mtd-field">
                <span>How can we help?</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={6}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Client volume, team size, go-live timing, or anything else we should know."
                />
              </label>

              {/* Honeypot — visually hidden from people */}
              <label className="mtd-hp" aria-hidden tabIndex={-1}>
                <span>Website</span>
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </label>

              {error ? <p className="mtd-contact-form__error">{error}</p> : null}

              <SiteButton type="submit" variant="secondary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send enquiry'}
              </SiteButton>
            </form>

            <aside className="mtd-contact-aside">
              <h2>What happens next</h2>
              <ul>
                <li>We review your enquiry and firm details.</li>
                <li>We reply with package guidance or a short call invite.</li>
                <li>You can also register and explore the product anytime.</li>
              </ul>
              <p>
                Prefer email? Write to{' '}
                <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
              </p>
            </aside>
          </div>
        </SiteContainer>
      </section>
    </>
  )
}
