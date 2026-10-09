'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import { billingService, type BillingQuote } from '@/services/billing.service'
import { getTrialRemaining } from '@/lib/billing/trialRemaining'
import { BILLING_PRICING_HREF } from '@/lib/billing/billingCopy'

const outlineBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
  textDecoration: 'none',
  display: 'inline-block',
}

const primaryBtn: React.CSSProperties = {
  ...outlineBtn,
  background: B.primaryBtn,
  borderColor: B.primaryBtn,
  color: '#fff',
  fontWeight: 600,
}

function formatGbp(n: number): string {
  return `£${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'trial':
      return 'Free trial'
    case 'active':
      return 'Active subscription'
    case 'past_due':
      return 'Payment past due'
    case 'cancelled':
      return 'Cancelled'
    case 'expired':
      return 'Trial expired'
    default:
      return status
  }
}

function statusColors(status: string): { bg: string; border: string; text: string } {
  switch (status) {
    case 'trial':
      return { bg: B.blueBg, border: '#BAE6FD', text: B.blueText }
    case 'active':
      return { bg: B.greenBg, border: '#BBF7D0', text: B.greenText }
    case 'past_due':
      return { bg: B.amberBg, border: '#FDE68A', text: B.amberText }
    case 'expired':
    case 'cancelled':
      return { bg: B.redBg, border: '#FECACA', text: B.redText }
    default:
      return { bg: B.surface, border: B.border, text: B.muted }
  }
}

export default function BillingSection() {
  const searchParams = useSearchParams()
  const [quote, setQuote] = useState<BillingQuote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<'checkout' | 'portal' | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'success') {
      setBanner('Payment received. Your subscription will show as active once Stripe confirms (usually a few seconds).')
    } else if (checkout === 'cancelled') {
      setBanner('Checkout was cancelled. You can subscribe any time.')
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await billingService.getQuote()
        if (!cancelled) setQuote(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load billing usage')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const status = quote?.billingStatus ?? 'active'
  const trial = getTrialRemaining(quote?.billingStatus, quote?.trialEndsAt)
  const colors = statusColors(status)
  const needsSubscribe =
    status === 'trial' || status === 'expired' || status === 'cancelled' || status === 'past_due'
  const canManage = !!quote?.hasStripeCustomer

  async function startCheckout() {
    setActionLoading('checkout')
    setError(null)
    try {
      const { url } = await billingService.createCheckoutSession()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start Checkout')
      setActionLoading(null)
    }
  }

  async function openPortal() {
    setActionLoading('portal')
    setError(null)
    try {
      const { url } = await billingService.createPortalSession()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open billing portal')
      setActionLoading(null)
    }
  }

  const rows = quote
    ? [
        ['Account status', statusLabel(status)],
        ...(trial
          ? ([
              ['Trial days left', `${trial.daysLeft} day${trial.daysLeft === 1 ? '' : 's'}`],
              ['Trial ends', trial.endsLabel],
            ] as const)
          : status === 'trial' && quote.trialEndsAt
            ? ([['Trial ends', formatDate(quote.trialEndsAt)]] as const)
            : []),
        ['Billable clients', String(quote.billableClients)],
        ['Included in base', String(quote.allowance)],
        ['Extra clients', String(quote.extraClients)],
        ['Base', formatGbp(quote.baseGbp)],
        ['Extras', formatGbp(quote.extrasGbp)],
        ['Monthly total', formatGbp(quote.totalExVatGbp)],
        ['Next renewal', quote.nextRenewalAt ? formatDate(quote.nextRenewalAt) : '—'],
      ]
    : []

  return (
    <Card>
      <CardHead titleSize={16} padding="16px 20px" title="Plan & billing" />
      <div style={{ padding: '20px' }}>
        {banner && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 7,
              background: B.blueBg,
              border: `1px solid #BAE6FD`,
              marginBottom: 16,
              fontSize: 13,
              color: B.blueText,
            }}
          >
            {banner}
          </div>
        )}

        <div
          style={{
            padding: '20px',
            background: colors.bg,
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.text,
                  letterSpacing: '0.04em',
                }}
              >
                CURRENT STATUS
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: B.navy, marginTop: 4 }}>
                {loading ? '…' : statusLabel(status)}
              </div>
              <div style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>
                {trial
                  ? `Free trial: ${trial.daysLeft} day${trial.daysLeft === 1 ? '' : 's'} left · ends ${trial.endsLabel}`
                  : `£50 / month for up to ${quote?.allowance ?? 50} clients`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: B.navy }}>
                {loading ? '…' : formatGbp(quote?.totalExVatGbp ?? 0)}
                <span style={{ fontSize: 13, fontWeight: 400, color: B.muted }}>/mo</span>
              </div>
              <div style={{ fontSize: 12, color: colors.text }}>monthly</div>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 7,
              background: B.redBg,
              border: `1px solid #FECACA`,
              marginBottom: 16,
              fontSize: 13,
              color: B.redText,
            }}
          >
            {error}
          </div>
        )}

        {rows.map(([k, v], i) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '9px 0',
              borderBottom: i < rows.length - 1 ? `1px solid ${B.borderLight}` : 'none',
            }}
          >
            <span style={{ fontSize: 13, color: B.muted }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
          </div>
        ))}

        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href={BILLING_PRICING_HREF} style={outlineBtn}>
            View pricing
          </Link>
          {needsSubscribe && (
            <button
              type="button"
              id="subscribe"
              style={{
                ...primaryBtn,
                opacity: actionLoading ? 0.7 : 1,
                cursor: actionLoading ? 'wait' : 'pointer',
              }}
              disabled={!!actionLoading}
              onClick={() => void startCheckout()}
            >
              {actionLoading === 'checkout' ? 'Redirecting…' : 'Subscribe'}
            </button>
          )}
          {canManage && (
            <button
              type="button"
              style={{
                ...outlineBtn,
                opacity: actionLoading ? 0.7 : 1,
                cursor: actionLoading ? 'wait' : 'pointer',
              }}
              disabled={!!actionLoading}
              onClick={() => void openPortal()}
            >
              {actionLoading === 'portal' ? 'Opening…' : 'Manage billing'}
            </button>
          )}
        </div>
        {needsSubscribe && (
          <p style={{ margin: '12px 0 0', fontSize: 12, color: B.muted, lineHeight: 1.5 }}>
            Subscribe opens Stripe Checkout for your current client count. You can update payment
            details later from Manage billing.
          </p>
        )}
      </div>
    </Card>
  )
}
