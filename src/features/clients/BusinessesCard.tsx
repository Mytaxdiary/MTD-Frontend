'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import {
  clientsService,
  type BusinessDetailsResponse,
  type BusinessListItem,
  type ClientRecord,
  type UkPropertyFiguresResponse,
  type UkPropertyMoneyBlock,
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

function isUkPropertyType(type: string): boolean {
  return type === 'uk-property' || type.startsWith('uk-property')
}

function fmtMoney(amount: number | null | undefined): string {
  if (amount == null) return '-'
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function labelFromKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function flattenBlock(block?: UkPropertyMoneyBlock): Array<{ label: string; value: string }> {
  if (!block) return []
  const rows: Array<{ label: string; value: string }> = []
  const walk = (prefix: string, obj?: Record<string, unknown>) => {
    if (!obj) return
    for (const [key, value] of Object.entries(obj)) {
      if (value == null) continue
      if (typeof value === 'boolean') {
        rows.push({ label: `${prefix}${labelFromKey(key)}`, value: value ? 'Yes' : 'No' })
      } else if (typeof value === 'number') {
        rows.push({ label: `${prefix}${labelFromKey(key)}`, value: fmtMoney(value) })
      } else if (typeof value === 'object') {
        walk(`${prefix}${labelFromKey(key)} · `, value as Record<string, unknown>)
      }
    }
  }
  walk('Adjustment · ', block.adjustments)
  walk('Allowance · ', block.allowances)
  return rows
}

function fmtDate(iso?: string): string {
  if (!iso) return '-'
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
        fontSize: 13,
        borderBottom: `1px solid ${B.borderLight}`,
      }}
    >
      <span style={{ color: B.muted, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

function PropertyFiguresPanel({ figures }: { figures: UkPropertyFiguresResponse }) {
  const ukRows = flattenBlock(figures.annual?.ukProperty)
  const fhlRows = flattenBlock(figures.annual?.ukFhlProperty)
  const period = [figures.fromDate, figures.toDate].filter(Boolean).map(fmtDate).join(' to ')

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
      <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 8 }}>
        UK property figures · {figures.taxYear}
      </div>
      {period && (
        <div style={{ fontSize: 11, color: B.muted, marginBottom: 8 }}>Period: {period}</div>
      )}
      <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 8 }}>
        <span style={{ color: B.muted }}>
          Income <b style={{ color: B.text }}>{fmtMoney(figures.income)}</b>
        </span>
        <span style={{ color: B.muted }}>
          Expenses <b style={{ color: B.text }}>{fmtMoney(figures.expenses)}</b>
        </span>
        <span style={{ color: B.muted }}>
          Net{' '}
          <b style={{ color: figures.net < 0 ? B.redText : B.text }}>
            {figures.net < 0 ? `-${fmtMoney(Math.abs(figures.net))}` : fmtMoney(figures.net)}
          </b>
        </span>
      </div>
      {ukRows.map((row) => (
        <DetailRow key={row.label} label={row.label} value={row.value} />
      ))}
      {fhlRows.map((row) => (
        <DetailRow key={`fhl-${row.label}`} label={`FHL ${row.label}`} value={row.value} />
      ))}
      {figures.income === 0 &&
        figures.expenses === 0 &&
        ukRows.length === 0 &&
        fhlRows.length === 0 && (
          <div style={{ fontSize: 12, color: B.muted }}>
            No UK property income, expenses, or allowances returned for this tax year yet.
          </div>
        )}
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
            ? `${details.quarterlyTypeChoice.quarterlyPeriodType} (${details.quarterlyTypeChoice.taxYearOfChoice ?? 'N/A'})`
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
  propertyFigures,
  propertyLoading,
  propertyError,
}: {
  item: BusinessListItem
  clientId: string
  expanded: boolean
  onToggle: () => void
  propertyFigures: UkPropertyFiguresResponse | null
  propertyLoading: boolean
  propertyError: string | null
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
          <div
            style={{ fontSize: 13, fontWeight: 600, color: B.text, textTransform: 'capitalize' }}
          >
            {fmtType(item.typeOfBusiness)}
          </div>
          {item.tradingName && (
            <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>{item.tradingName}</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: B.muted }}>
            {item.businessId}
          </div>
          <div style={{ fontSize: 11, color: B.primary, marginTop: 2 }}>
            {expanded ? 'Hide' : 'Details'}
          </div>
        </div>
      </button>
      {item.typeOfBusiness === 'self-employment' && (
        <div
          style={{
            padding: '0 14px 10px',
            background: expanded ? B.surface : B.white,
          }}
        >
          <a
            href={`/quarterly-review?id=${encodeURIComponent(clientId)}&businessId=${encodeURIComponent(item.businessId)}`}
            style={{ fontSize: 12, fontWeight: 600, color: B.link, textDecoration: 'none' }}
          >
            Submit cumulative
          </a>
        </div>
      )}

      {expanded && (
        <div style={{ padding: '0 14px 14px', background: B.surface }}>
          {loadingDetails && (
            <p style={{ fontSize: 12, color: B.muted, margin: '8px 0 0' }}>
              Loading business details...
            </p>
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
          {propertyLoading && (
            <p style={{ fontSize: 12, color: B.muted, margin: '8px 0 0' }}>
              Loading UK property figures...
            </p>
          )}
          {propertyError && (
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
              {propertyError}
            </div>
          )}
          {propertyFigures && <PropertyFiguresPanel figures={propertyFigures} />}
        </div>
      )}
    </div>
  )
}

export default function BusinessesCard({
  client,
  onFirstBusiness,
  onBusinesses,
}: {
  client: ClientRecord
  onFirstBusiness?: (b: BusinessListItem | null) => void
  onBusinesses?: (list: BusinessListItem[]) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [propertyById, setPropertyById] = useState<
    Record<string, { loading: boolean; error: string | null; data: UkPropertyFiguresResponse | null }>
  >({})
  const [addingProperty, setAddingProperty] = useState(false)

  const canFetch = !!client.authorisedAt

  const applyBusinessList = useCallback(
    (list: BusinessListItem[]) => {
      setBusinesses(list)
      onFirstBusiness?.(list[0] ?? null)
      onBusinesses?.(list)
    },
    [onFirstBusiness, onBusinesses],
  )

  const fetchBusinesses = useCallback(async () => {
    if (!client.authorisedAt) return
    setLoading(true)
    setError(null)
    try {
      const result = await clientsService.listBusinesses(client.id)
      applyBusinessList(result.listOfBusinesses ?? [])
      setExpandedId(null)
    } catch (err: unknown) {
      applyBusinessList([])
      setError((err as Error)?.message ?? 'Failed to load businesses from HMRC.')
    } finally {
      setLoading(false)
    }
  }, [client.id, client.authorisedAt, applyBusinessList])

  const hasUkProperty = businesses.some((b) => isUkPropertyType(b.typeOfBusiness))
  const hasSelfEmployment = businesses.some((b) => b.typeOfBusiness === 'self-employment')
  const needsSandboxBusiness = !hasUkProperty || !hasSelfEmployment

  const addUkProperty = useCallback(async () => {
    if (!client.authorisedAt || addingProperty || !needsSandboxBusiness) return
    setAddingProperty(true)
    setError(null)
    try {
      const result = await clientsService.createUkPropertyTestBusiness(client.id)
      applyBusinessList(result.listOfBusinesses ?? [])
      setExpandedId(null)
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to create sandbox UK property business.')
    } finally {
      setAddingProperty(false)
    }
  }, [client.id, client.authorisedAt, addingProperty, needsSandboxBusiness, applyBusinessList])

  useEffect(() => {
    if (!client.authorisedAt) {
      setBusinesses([])
      setError(null)
      setExpandedId(null)
      setLoading(false)
      setPropertyById({})
      onFirstBusiness?.(null)
      onBusinesses?.([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    clientsService
      .listBusinesses(client.id)
      .then((result) => {
        if (!cancelled) applyBusinessList(result.listOfBusinesses ?? [])
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          applyBusinessList([])
          setError((err as Error)?.message ?? 'Failed to load businesses from HMRC.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client.id, client.authorisedAt, applyBusinessList, onFirstBusiness])

  useEffect(() => {
    const propertyBusinesses = businesses.filter((b) => isUkPropertyType(b.typeOfBusiness))
    if (!client.authorisedAt || propertyBusinesses.length === 0) {
      setPropertyById({})
      return
    }

    let cancelled = false
    setPropertyById((prev) => {
      const next = { ...prev }
      for (const biz of propertyBusinesses) {
        next[biz.businessId] = { loading: true, error: null, data: prev[biz.businessId]?.data ?? null }
      }
      return next
    })

    void Promise.all(
      propertyBusinesses.map(async (biz) => {
        try {
          const data = await clientsService.getUkPropertyFigures(client.id, biz.businessId)
          if (!cancelled) {
            setPropertyById((prev) => ({
              ...prev,
              [biz.businessId]: { loading: false, error: null, data },
            }))
          }
        } catch (err: unknown) {
          if (!cancelled) {
            setPropertyById((prev) => ({
              ...prev,
              [biz.businessId]: {
                loading: false,
                error: (err as Error)?.message ?? 'Failed to load UK property figures.',
                data: null,
              },
            }))
          }
        }
      }),
    )

    return () => {
      cancelled = true
    }
  }, [client.authorisedAt, client.id, businesses])

  return (
    <Card>
      <CardHeader
        title="HMRC businesses"
        sub="Business Details v2.0, income sources for this client"
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          {canFetch && needsSandboxBusiness && (
            <button
              type="button"
              style={{
                ...outlineBtn,
                opacity: addingProperty || loading ? 0.6 : 1,
                cursor: addingProperty || loading ? 'not-allowed' : 'pointer',
              }}
              disabled={addingProperty || loading}
              onClick={() => void addUkProperty()}
            >
              {addingProperty
                ? 'Adding sandbox businesses...'
                : !hasUkProperty && !hasSelfEmployment
                  ? 'Add sandbox businesses'
                  : !hasUkProperty
                    ? 'Add UK property (sandbox)'
                    : 'Add self-employment (sandbox)'}
            </button>
          )}
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
            {loading ? 'Loading...' : businesses.length > 0 ? 'Refresh' : 'Fetch from HMRC'}
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
            {businesses.map((item) => {
              const property = propertyById[item.businessId]
              return (
                <BusinessRow
                  key={item.businessId}
                  item={item}
                  clientId={client.id}
                  expanded={expandedId === item.businessId}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === item.businessId ? null : item.businessId))
                  }
                  propertyFigures={property?.data ?? null}
                  propertyLoading={property?.loading ?? false}
                  propertyError={property?.error ?? null}
                />
              )
            })}
          </div>
        ) : loading ? (
          <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>Loading businesses from HMRC...</p>
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
