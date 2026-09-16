'use client'

import { FormEvent, useMemo, useState } from 'react'
import { env } from '@/lib/env'

/**
 * Contact page body. Markup mirrors MTD-AppSite/contact.html (`.contact-grid`,
 * `.form-card`, `.field`/`.err`, `.form-done`), but submission is wired to the
 * real enquiries API instead of the static-site placeholder in site.js.
 */

type ContactFormProps = {
  initialPlan?: string
}

const PACKAGE_OPTIONS = [
  { label: 'Not sure yet', value: '' },
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Scale', value: 'scale' },
]

type FieldKey = 'name' | 'firm' | 'email' | 'phone' | 'message'

function apiBase(): string {
  return env.apiBaseUrl || 'http://localhost:3500/api/v1'
}

function emailOk(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

export default function AppsiteContactForm({ initialPlan = '' }: ContactFormProps) {
  const defaultPkg = useMemo(() => {
    const match = PACKAGE_OPTIONS.find((p) => p.value && p.value === initialPlan.toLowerCase())
    return match?.value ?? ''
  }, [initialPlan])

  const [name, setName] = useState('')
  const [firm, setFirm] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pkg, setPkg] = useState(defaultPkg)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const mailtoHref = useMemo(() => {
    const body = `Name: ${name}\nFirm: ${firm}\n\n${message}`
    return `mailto:info@mytaxdiary.co.uk?subject=${encodeURIComponent(
      'My Tax Diary enquiry',
    )}&body=${encodeURIComponent(body)}`
  }, [name, firm, message])

  function clearError(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validate(): boolean {
    const next: Partial<Record<FieldKey, string>> = {}
    if (!name.trim()) next.name = 'Your name is required.'
    if (!firm.trim()) next.firm = 'Firm name is required.'
    if (!email.trim()) next.email = 'Work email is required.'
    else if (!emailOk(email)) next.email = 'Enter a valid email address, for example name@firm.co.uk.'
    if (!message.trim()) next.message = 'How can we help? is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch(`${apiBase()}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          firm: firm.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim(),
          planInterest: pkg || undefined,
          sourcePage: '/site/contact',
          website,
        }),
      })

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { message?: string | string[] } | null
        const msg = payload?.message
        throw new Error(
          Array.isArray(msg)
            ? msg.join(', ')
            : typeof msg === 'string'
              ? msg
              : 'Could not send your enquiry. Please try again.',
        )
      }

      setSent(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not send your enquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow reveal">Contact</div>
          <h1 className="reveal" style={{ ['--d' as string]: '.06s' } as React.CSSProperties}>
            Talk to us about My Tax Diary
          </h1>
          <p className="reveal" style={{ ['--d' as string]: '.12s' } as React.CSSProperties}>
            Tell us about your firm and what you need for MTD ITSA. We will reply with package
            guidance or a follow-up conversation.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="contact-grid">
            <div className={`form-card reveal${sent ? ' sent' : ''}`} id="contactCard">
              <form id="contactForm" method="post" noValidate onSubmit={onSubmit}>
                <div className="field-row">
                  <div className={`field${errors.name ? ' bad' : ''}`}>
                    <label htmlFor="c-name">Your name</label>
                    <input
                      type="text"
                      id="c-name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        clearError('name')
                      }}
                    />
                    <span className="err">{errors.name}</span>
                  </div>
                  <div className={`field${errors.firm ? ' bad' : ''}`}>
                    <label htmlFor="c-firm">Firm name</label>
                    <input
                      type="text"
                      id="c-firm"
                      name="firm"
                      autoComplete="organization"
                      value={firm}
                      onChange={(e) => {
                        setFirm(e.target.value)
                        clearError('firm')
                      }}
                    />
                    <span className="err">{errors.firm}</span>
                  </div>
                </div>

                <div className="field-row">
                  <div className={`field${errors.email ? ' bad' : ''}`}>
                    <label htmlFor="c-email">Work email</label>
                    <input
                      type="email"
                      id="c-email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        clearError('email')
                      }}
                    />
                    <span className="err">{errors.email}</span>
                  </div>
                  <div className="field">
                    <label htmlFor="c-phone">
                      Phone <span className="opt">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="c-phone"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <span className="err"></span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="c-package">Package interest</label>
                  <select
                    id="c-package"
                    name="package"
                    value={pkg}
                    onChange={(e) => setPkg(e.target.value)}
                  >
                    {PACKAGE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="err"></span>
                </div>

                <div className={`field${errors.message ? ' bad' : ''}`}>
                  <label htmlFor="c-message">How can we help?</label>
                  <textarea
                    id="c-message"
                    name="message"
                    placeholder="Client volume, team size, go-live timing, or anything else we should know."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      clearError('message')
                    }}
                  />
                  <span className="err">{errors.message}</span>
                </div>

                {/* Honeypot — hidden from people, catches bots */}
                <div aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="c-website">Website</label>
                  <input
                    id="c-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {formError ? (
                  <p className="form-note" style={{ color: '#d14343' }}>
                    {formError}
                  </p>
                ) : null}

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send enquiry'}
                </button>
                <p className="form-note">
                  Or email us directly at{' '}
                  <a id="mailFallback" href={mailtoHref}>
                    info@mytaxdiary.co.uk
                  </a>
                </p>
              </form>

              <div className="form-done">
                <div className="ok-ring">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22b07d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>Thank you — enquiry received</h3>
                <p>
                  We will review your firm details and reply with package guidance or a short call
                  invite.
                </p>
              </div>
            </div>

            <div className="next-panel reveal" style={{ ['--d' as string]: '.12s' } as React.CSSProperties}>
              <h2>What happens next</h2>
              <ul className="next-list">
                <li>We review your enquiry and firm details.</li>
                <li>We reply with package guidance or a short call invite.</li>
                <li>You can also register and explore the product anytime.</li>
              </ul>
              <p className="mail">
                Prefer email? Write to <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
