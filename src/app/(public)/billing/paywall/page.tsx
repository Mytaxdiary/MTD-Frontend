'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import AuthPageLayout from '@/components/auth/authPageLayout'
import B from '@/styles/theme'
import { parseBillingErrorCode } from '@/lib/billing/billingErrors'
import { getPaywallCopy } from '@/lib/billing/billingCopy'
import { billingService } from '@/services/billing.service'

function PaywallBody() {
  const params = useSearchParams()
  const raw = params.get('code') ?? params.get('message') ?? ''
  const code = parseBillingErrorCode(raw)
  const copy = getPaywallCopy(code)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prefer our stable copy; only show API message when it is clean (no [CODE] suffix).
  const apiMessage = params.get('message')
  const detail =
    apiMessage && !apiMessage.includes('[') && apiMessage.trim().length > 0
      ? apiMessage
      : copy.detail

  const ctaStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '11px 18px',
    borderRadius: 8,
    border: 'none',
    background: B.primary,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
  }

  const secondaryStyle: React.CSSProperties = {
    ...ctaStyle,
    background: B.white,
    color: B.navy,
    border: `1px solid ${B.border}`,
  }

  async function subscribe() {
    setBusy(true)
    setError(null)
    try {
      const { url } = await billingService.createCheckoutSession()
      window.location.href = url
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not start Checkout'
      // No session / not owner → send them to sign in, then back here after expired login.
      if (/401|unauthor/i.test(msg) || /sign in|login/i.test(msg)) {
        window.location.href = '/login'
        return
      }
      setError(msg)
      setBusy(false)
    }
  }

  return (
    <AuthPageLayout
      subtitle={copy.title}
      footerContent={
        <>
          Already subscribed?{' '}
          <Link
            href="/login"
            style={{ color: B.link, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
          >
            Sign in again
          </Link>
        </>
      }
    >
      <p style={{ margin: '0 0 14px', fontSize: 14, color: B.muted, lineHeight: 1.6 }}>{detail}</p>

      <ul
        style={{
          margin: '0 0 20px',
          padding: '0 0 0 18px',
          fontSize: 13.5,
          color: B.text,
          lineHeight: 1.55,
        }}
      >
        {copy.bullets.map((b) => (
          <li key={b} style={{ marginBottom: 6 }}>
            {b}
          </li>
        ))}
      </ul>

      {error && (
        <p style={{ margin: '0 0 12px', fontSize: 13, color: B.redText, lineHeight: 1.5 }}>{error}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="button" style={ctaStyle} disabled={busy} onClick={() => void subscribe()}>
          {busy ? 'Redirecting to Stripe…' : 'Subscribe with Stripe'}
        </button>
        <Link href={copy.primaryHref} style={secondaryStyle}>
          {copy.primaryLabel}
        </Link>
        <Link href={copy.secondaryHref} style={secondaryStyle}>
          {copy.secondaryLabel}
        </Link>
        <Link href="/login" style={secondaryStyle}>
          Back to sign in
        </Link>
      </div>

      <p
        style={{
          margin: '18px 0 0',
          fontSize: 12,
          color: B.muted,
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        If Subscribe fails, sign in as the firm owner first, then try again from this page.
      </p>
    </AuthPageLayout>
  )
}

export default function BillingPaywallPage() {
  return (
    <Suspense
      fallback={
        <AuthPageLayout subtitle="Subscription required">
          <p style={{ fontSize: 14, color: B.muted }}>Loading…</p>
        </AuthPageLayout>
      }
    >
      <PaywallBody />
    </Suspense>
  )
}
