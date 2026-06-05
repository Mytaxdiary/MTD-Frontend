'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import {
  clientsService,
  type BusinessDetailsResponse,
  type BusinessListItem,
  type ClientRecord,
} from '@/services/clients.service'

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

function fmtType(type: string): string {
  return type.replace(/-/g, ' ')
}

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '6px 0',
        fontSize: 12,
        borderBottom: `1px solid ${B.borderLight}`,
      }}
    >
      <span style={{ color: B.muted, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

function BusinessDetailsPanel({ details }: { details: BusinessDetailsResponse }) {
  const address = [
    details.businessAddressLineOne,
    details.businessAddressLineTwo,
    details.businessAddressLineThree,
    details.businessAddressLineFour,
    details.businessAddressPostcode,
    details.businessAddressCountryCode,
  ]
    .filter(Boolean)
    .join(', ')

  const accountingPeriods = (details.accountingPeriods ?? [])
    .map((p) => `${fmtDate(p.start)} → ${fmtDate(p.end)}`)
    .join('; ')

  return (
    <div
      style={{
        marginTop: 10,
        padding: '12px 14px',
        background: B.white,
        borderRadius: 8,
        border: `1px solid ${B.borderLight}`,
      }}
    >
      <DetailRow label="Trading name" value={details.tradingName} />
      <DetailRow label="Year of migration" value={details.yearOfMigration} />
      <DetailRow label="Commencement" value={fmtDate(details.commencementDate)} />
      <DetailRow label="Cessation" value={fmtDate(details.cessationDate)} />
      <DetailRow
        label="First accounting period"
        value={
          details.firstAccountingPeriodStartDate
            ? `${fmtDate(details.firstAccountingPeriodStartDate)} → ${fmtDate(details.firstAccountingPeriodEndDate)}`
            : undefined
        }
      />
      <DetailRow label="Accounting periods" value={accountingPeriods || undefined} />
      <DetailRow
        label="Quarterly period type"
        value={
          details.quarterlyTypeChoice?.quarterlyPeriodType
            ? `${details.quarterlyTypeChoice.quarterlyPeriodType} (${details.quarterlyTypeChoice.taxYearOfChoice ?? '—'})`
            : undefined
        }
      />
      <DetailRow label="Address" value={address || undefined} />
    </div>
  )
}

function BusinessRow({
  item,
  clientId,
  expanded,
  onToggle,
}: {
  item: BusinessListItem
  clientId: string
  expanded: boolean
  onToggle: () => void
}) {
  const [details, setDetails] = useState<BusinessDetailsResponse | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  useEffect(() => {
    if (!expanded) return
    if (details?.businessId === item.businessId) return

    let cancelled = false
    setLoadingDetails(true)
    setDetailError(null)

    clientsService
      .getBusinessDetails(clientId, item.businessId)
      .then((result) => {
        if (!cancelled) setDetails(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setDetails(null)
          setDetailError((err as Error)?.message ?? 'Failed to load business details.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetails(false)
      })

    return () => {
      cancelled = true
    }
  }, [expanded, clientId, item.businessId, details?.businessId])

  return (
    <div
      style={{
        border: `1px solid ${B.borderLight}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          background: expanded ? B.surface : B.white,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: B.text, textTransform: 'capitalize' }}>
            {fmtType(item.typeOfBusiness)}
          </div>
          {item.tradingName && (
            <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>{item.tradingName}</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: B.muted }}>{item.businessId}</div>
          <div style={{ fontSize: 11, color: B.primary, marginTop: 2 }}>{expanded ? 'Hide' : 'Details'}</div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 14px 14px', background: B.surface }}>
          {loadingDetails && (
            <p style={{ fontSize: 12, color: B.muted, margin: '8px 0 0' }}>Loading business details…</p>
          )}
          {detailError && (
            <div
              style={{
                marginTop: 8,
                padding: '8px 10px',
                background: B.redBg,
                border: '1px solid #FECACA',
                borderRadius: 6,
                fontSize: 12,
                color: B.redText,
              }}
            >
              {detailError}
            </div>
          )}
          {details && <BusinessDetailsPanel details={details} />}
        </div>
      )}
    </div>
  )
}

export default function BusinessesCard({ client }: { client: ClientRecord }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const canFetch = !!client.authorisedAt

  const fetchBusinesses = useCallback(async () => {
    if (!client.authorisedAt) return
    setLoading(true)
    setError(null)
    try {
      const result = await clientsService.listBusinesses(client.id)
      setBusinesses(result.listOfBusinesses ?? [])
      setExpandedId(null)
    } catch (err: unknown) {
      setBusinesses([])
      setError((err as Error)?.message ?? 'Failed to load businesses from HMRC.')
    } finally {
      setLoading(false)
    }
  }, [client.id, client.authorisedAt])

  useEffect(() => {
    if (!client.authorisedAt) {
      setBusinesses([])
      setError(null)
      setExpandedId(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    clientsService
      .listBusinesses(client.id)
      .then((result) => {
        if (!cancelled) setBusinesses(result.listOfBusinesses ?? [])
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setBusinesses([])
          setError((err as Error)?.message ?? 'Failed to load businesses from HMRC.')
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
        title="HMRC businesses"
        sub="Business Details v2.0 — income sources for this client"
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
            This client must be fully authorised with HMRC before business details can be retrieved.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button
            type="button"
            style={{
              ...outlineBtn,
              opacity: !canFetch || loading ? 0.6 : 1,
              cursor: !canFetch || loading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canFetch || loading}
            onClick={() => void fetchBusinesses()}
          >
            {loading ? 'Loading…' : businesses.length > 0 ? 'Refresh' : 'Fetch from HMRC'}
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

        {businesses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {businesses.map((item) => (
              <BusinessRow
                key={item.businessId}
                item={item}
                clientId={client.id}
                expanded={expandedId === item.businessId}
                onToggle={() =>
                  setExpandedId((prev) => (prev === item.businessId ? null : item.businessId))
                }
              />
            ))}
          </div>
        ) : loading ? (
          <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>Loading businesses from HMRC…</p>
        ) : (
          !error && (
            <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>
              {canFetch
                ? 'No business income sources returned for this client.'
                : 'Authorise this client with HMRC to view their businesses.'}
            </p>
          )
        )}
      </div>
    </Card>
  )
}
