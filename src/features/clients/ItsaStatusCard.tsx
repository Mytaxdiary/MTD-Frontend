'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { clientsService, type ClientRecord, type ItsaStatusResponse } from '@/services/clients.service'
import { currentUkTaxYear } from '@/lib/hmrc/taxYear'

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const outlineBtn: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

export default function ItsaStatusCard({ client }: { client: ClientRecord }) {
  const [taxYear, setTaxYear] = useState(currentUkTaxYear())
  const [history, setHistory] = useState(false)
  const [futureYears, setFutureYears] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ItsaStatusResponse | null>(null)

  const canFetch = !!client.authorisedAt

  const fetchItsaStatus = useCallback(async () => {
    if (!client.authorisedAt) return
    setLoading(true)
    setError(null)
    try {
      const result = await clientsService.getItsaStatus(client.id, {
        taxYear,
        history,
        futureYears,
      })
      setData(result)
    } catch (err: unknown) {
      setData(null)
      setError((err as Error)?.message ?? 'Failed to load ITSA status.')
    } finally {
      setLoading(false)
    }
  }, [client.id, client.authorisedAt, taxYear, history, futureYears])

  /** Load ITSA status when the client detail page opens (authorised clients only). */
  useEffect(() => {
    if (!client.authorisedAt) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    clientsService
      .getItsaStatus(client.id, {
        taxYear: currentUkTaxYear(),
        history: false,
        futureYears: true,
      })
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData(null)
          setError((err as Error)?.message ?? 'Failed to load ITSA status.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client.id, client.authorisedAt])

  return (
    <Card>
      <CardHeader
        title="HMRC ITSA status"
        sub="Self Assessment Individual Details v2.0 — live data from HMRC"
      />
      <div style={{ padding: '12px 20px 16px' }}>
        {!canFetch && (
          <div
            style={{
              marginBottom: 12,
              padding: '10px 12px',
              background: B.amberBg,
              border: '1px solid #FDE68A',
              borderRadius: 8,
              fontSize: 12,
              color: B.amberText,
            }}
          >
            This client must be fully authorised with HMRC before ITSA status can be retrieved.
            Accept the invitation and verify the relationship first.
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: B.muted }}>
            Tax year{' '}
            <input
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              placeholder="2024-25"
              style={{
                marginLeft: 6,
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${B.border}`,
                fontSize: 12,
                width: 88,
              }}
            />
          </label>
          <label style={{ fontSize: 12, color: B.text, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={history}
              onChange={(e) => setHistory(e.target.checked)}
            />
            History
          </label>
          <label style={{ fontSize: 12, color: B.text, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={futureYears}
              onChange={(e) => setFutureYears(e.target.checked)}
            />
            Future years
          </label>
          <button
            type="button"
            style={{
              ...outlineBtn,
              opacity: !canFetch || loading ? 0.6 : 1,
              cursor: !canFetch || loading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canFetch || loading}
            onClick={() => void fetchItsaStatus()}
          >
            {loading ? 'Loading…' : data ? 'Refresh' : 'Fetch from HMRC'}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 12px',
              background: B.redBg,
              border: '1px solid #FECACA',
              borderRadius: 8,
              fontSize: 12,
              color: B.redText,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {data?.itsaStatuses && data.itsaStatuses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.itsaStatuses.map((yearBlock) => (
              <div
                key={yearBlock.taxYear}
                style={{
                  border: `1px solid ${B.borderLight}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    background: B.surface,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Tax year {yearBlock.taxYear}
                </div>
                {(yearBlock.itsaStatusDetails ?? []).map((detail, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      borderTop: `1px solid ${B.borderLight}`,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{detail.status ?? '—'}</span>
                      <span style={{ color: B.muted }}>{fmtDate(detail.submittedOn)}</span>
                    </div>
                    {detail.statusReason && (
                      <div style={{ color: B.muted, marginTop: 4 }}>{detail.statusReason}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : loading ? (
          <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>Loading ITSA status from HMRC…</p>
        ) : (
          !error && (
            <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>
              {canFetch
                ? 'No ITSA status returned for this tax year.'
                : 'Authorise this client with HMRC to enable ITSA status.'}
            </p>
          )
        )}
      </div>
    </Card>
  )
}
