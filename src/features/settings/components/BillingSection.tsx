'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import { billingService, type BillingQuote } from '@/services/billing.service'

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

function formatGbp(n: number): string {
  return `£${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}

export default function BillingSection() {
  const [quote, setQuote] = useState<BillingQuote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  const rows = quote
    ? [
        ['Billable clients', String(quote.billableClients)],
        ['Included in base', String(quote.allowance)],
        ['Extra clients', String(quote.extraClients)],
        ['Base (ex-VAT)', formatGbp(quote.baseGbp)],
        ['Extras (ex-VAT)', formatGbp(quote.extrasGbp)],
        ['Monthly total (ex-VAT)', formatGbp(quote.totalExVatGbp)],
      ]
    : []

  return (
    <Card>
      <CardHead titleSize={16} padding="16px 20px" title="Plan & billing" />
      <div style={{ padding: '20px' }}>
        <div
          style={{
            padding: '20px',
            background: B.blueBg,
            borderRadius: 10,
            border: '1px solid #BAE6FD',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: B.blueText,
                  letterSpacing: '0.04em',
                }}
              >
                CURRENT PLAN
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: B.navy, marginTop: 4 }}>
                Usage pricing
              </div>
              <div style={{ fontSize: 12, color: B.blueText, marginTop: 4 }}>
                £50 / month for up to {quote?.allowance ?? 50} clients (ex-VAT)
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: B.navy }}>
                {loading ? '…' : formatGbp(quote?.totalExVatGbp ?? 0)}
                <span style={{ fontSize: 13, fontWeight: 400, color: B.muted }}>/mo</span>
              </div>
              <div style={{ fontSize: 12, color: B.blueText }}>ex-VAT · monthly</div>
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
          <Link href="/site/pricing" style={outlineBtn}>
            View pricing
          </Link>
          <span style={{ ...outlineBtn, opacity: 0.55, cursor: 'default' }}>
            Checkout (Stripe — coming next)
          </span>
        </div>
      </div>
    </Card>
  )
}
