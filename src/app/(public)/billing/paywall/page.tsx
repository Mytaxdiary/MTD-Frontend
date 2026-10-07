'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AuthPageLayout from '@/components/auth/authPageLayout'
import B from '@/styles/theme'
import { parseBillingErrorCode } from '@/lib/billing/billingErrors'

function PaywallBody() {
  const params = useSearchParams()
  const code = parseBillingErrorCode(params.get('code') ?? params.get('message') ?? '')
  const message = params.get('message')

  const title =
    code === 'TRIAL_EXPIRED' ? 'Your free trial has ended' : 'Subscription required'

  const detail =
    message && !message.includes('[')
      ? message
      : code === 'TRIAL_EXPIRED'
        ? 'Subscribe to keep managing clients and quarterly submissions in My Tax Diary.'
        : 'A paid subscription is required to continue using the agent portal.'

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
  }

  const secondaryStyle: React.CSSProperties = {
    ...ctaStyle,
    background: B.white,
    color: B.navy,
    border: `1px solid ${B.border}`,
  }

  return (
    <AuthPageLayout
      subtitle={title}
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
      <p style={{ margin: '0 0 20px', fontSize: 14, color: B.muted, lineHeight: 1.6 }}>{detail}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/site/pricing" style={ctaStyle}>
          View pricing &amp; subscribe
        </Link>
        <Link href="/settings?section=billing" style={secondaryStyle}>
          Open Plan &amp; billing
        </Link>
        <Link href="/site/contact" style={secondaryStyle}>
          Contact support
        </Link>
      </div>
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
