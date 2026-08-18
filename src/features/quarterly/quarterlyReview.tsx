'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import B from '@/styles/theme'
import { currentUkTaxYear } from '@/lib/hmrc/taxYear'
import {
  clientsService,
  type ClientRecord,
  type SeCumulativeSummaryResponse,
} from '@/services/clients.service'

function fmtGbp(n: number): string {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function fmtDate(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const outlineBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

const primaryBtn: React.CSSProperties = {
  padding: '8px 18px',
  borderRadius: 8,
  border: 'none',
  background: B.primaryBtn,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  color: '#fff',
}

export default function QuarterlyReview() {
  const router = useRouter()
  const params = useSearchParams()
  const clientId = params.get('id')
  const businessId = params.get('businessId')
  const taxYear = params.get('taxYear') || currentUkTaxYear()

  const [client, setClient] = useState<ClientRecord | null>(null)
  const [data, setData] = useState<SeCumulativeSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const backToClient = () => {
    if (clientId) router.push(`/clients/detail?id=${encodeURIComponent(clientId)}`)
    else router.push('/clients')
  }

  useEffect(() => {
    if (!clientId || !businessId) {
      setLoading(false)
      setError('Open this screen from a self-employment business on the client overview.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setSubmitted(false)

    Promise.all([
      clientsService.getOne(clientId),
      clientsService.getSeCumulative(clientId, businessId, taxYear),
    ])
      .then(([c, summary]) => {
        if (cancelled) return
        setClient(c)
        setData(summary)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError((err as Error)?.message ?? 'Failed to load cumulative figures.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [clientId, businessId, taxYear])

  const canSubmit = !!data && data.source !== 'empty' && !!data.periodDates && !submitted
  const income = (data?.periodIncome.turnover ?? 0) + (data?.periodIncome.other ?? 0)
  const expenses = data?.periodExpenses.consolidatedExpenses ?? 0
  const net = income - expenses

  async function handleSubmit() {
    if (!clientId || !businessId || !data?.periodDates || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await clientsService.submitSeCumulative(clientId, businessId, taxYear, {
        periodDates: data.periodDates,
        periodIncome: data.periodIncome,
        periodExpenses: data.periodExpenses,
      })
      setData(result)
      setSubmitted(true)
      setConfirming(false)
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'HMRC rejected the cumulative submission.')
      setConfirming(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '12px 28px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        <button type="button" onClick={() => router.push('/clients')} style={{ ...outlineBtn, padding: '4px 8px', border: 'none' }}>
          Clients
        </button>
        <span style={{ color: B.xlight }}>/</span>
        <button type="button" onClick={backToClient} style={{ ...outlineBtn, padding: '4px 8px', border: 'none' }}>
          {client?.name ?? 'Client'}
        </button>
        <span style={{ color: B.xlight }}>/</span>
        <span style={{ fontWeight: 600 }}>Self-employment cumulative submit</span>
      </div>

      <div style={{ padding: '20px 28px 32px', maxWidth: 720 }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Review cumulative update
        </div>
        <div style={{ fontSize: 14, color: B.muted, marginTop: 4 }}>
          {client?.name ?? 'Client'}
          {data?.tradingName ? ` · ${data.tradingName}` : ''}
          {` · Tax year ${taxYear}`}
          {data?.periodDates
            ? ` · ${fmtDate(data.periodDates.periodStartDate)} – ${fmtDate(data.periodDates.periodEndDate)}`
            : ''}
        </div>

        {loading && (
          <p style={{ fontSize: 13, color: B.muted, marginTop: 20 }}>Loading figures from HMRC...</p>
        )}

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: '10px 12px',
              background: B.redBg,
              border: '1px solid #FECACA',
              borderRadius: 8,
              fontSize: 13,
              color: B.redText,
            }}
          >
            {error}
          </div>
        )}

        {!loading && data && (
          <>
            {data.source === 'sandbox-test' && (
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 12px',
                  background: B.amberBg,
                  border: '1px solid #FDE68A',
                  borderRadius: 8,
                  fontSize: 12,
                  color: B.amberText,
                }}
              >
                No cumulative summary is on HMRC yet. These are sandbox test figures for the latest
                completed quarter. Production will not invent figures — it will only submit retrieved
                digital records.
              </div>
            )}

            {data.source === 'empty' && (
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 12px',
                  background: B.amberBg,
                  border: '1px solid #FDE68A',
                  borderRadius: 8,
                  fontSize: 12,
                  color: B.amberText,
                }}
              >
                There are no HMRC or accounting figures to submit for this self-employment business.
              </div>
            )}

            {data.source === 'hmrc' && (
              <div style={{ marginTop: 12, fontSize: 12, color: B.muted }}>
                Figures retrieved from HMRC
                {data.submittedOn ? ` · last submitted ${fmtDate(data.submittedOn)}` : ''}.
              </div>
            )}

            <div
              style={{
                marginTop: 16,
                padding: '16px 18px',
                background: B.white,
                border: `1px solid ${B.borderLight}`,
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                Cumulative figures · {taxYear}
              </div>
              <Row label="Turnover" value={fmtGbp(data.periodIncome.turnover)} />
              <Row label="Other income" value={fmtGbp(data.periodIncome.other)} />
              <Row label="Consolidated expenses" value={fmtGbp(data.periodExpenses.consolidatedExpenses)} />
              <Row
                label="Net"
                value={net < 0 ? `-${fmtGbp(Math.abs(net))}` : fmtGbp(net)}
              />
            </div>

            {submitted && (
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 12px',
                  background: B.greenBg,
                  border: '1px solid #A7F3D0',
                  borderRadius: 8,
                  fontSize: 13,
                  color: B.greenText,
                }}
              >
                HMRC accepted the cumulative submission. Figures above are the retrieved summary
                after submit.
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button type="button" style={outlineBtn} onClick={backToClient}>
                Back to client
              </button>
              {canSubmit && (
                <button
                  type="button"
                  style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}
                  disabled={submitting}
                  onClick={() => setConfirming(true)}
                >
                  {data.source === 'hmrc' ? 'Amend and submit to HMRC' : 'Submit to HMRC'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {confirming && data?.periodDates && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            padding: 20,
          }}
        >
          <div
            style={{
              background: B.white,
              borderRadius: 12,
              padding: 24,
              maxWidth: 440,
              width: '100%',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>Submit to HMRC?</div>
            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.5 }}>
              This will call Create or Amend a Self-Employment Cumulative Period Summary for{' '}
              <b>{taxYear}</b> ({fmtDate(data.periodDates.periodStartDate)} –{' '}
              {fmtDate(data.periodDates.periodEndDate)}). Income {fmtGbp(income)}, expenses{' '}
              {fmtGbp(expenses)}.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button
                type="button"
                style={outlineBtn}
                disabled={submitting}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}
                disabled={submitting}
                onClick={() => void handleSubmit()}
              >
                {submitting ? 'Submitting...' : 'Confirm submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '7px 0',
        fontSize: 13,
        borderBottom: `1px solid ${B.borderLight}`,
      }}
    >
      <span style={{ color: B.muted }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}
