'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { currentUkTaxYear } from '@/lib/hmrc/taxYear'
import {
  fmtUkPeriodRange,
  fmtUkShortDate,
  ukQuarterFromPeriodStart,
} from '@/lib/hmrc/quarterLabel'
import {
  clientsService,
  type BusinessListItem,
  type ClientRecord,
  type CrystallisationObligation,
  type ObligationDetail,
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

function businessLabel(b: BusinessListItem): string {
  const name = b.tradingName?.trim() || b.typeOfBusiness.replace(/-/g, ' ')
  return `${name} (${b.businessId})`
}

function ObligationTimeline({ details }: { details: ObligationDetail[] }) {
  const sorted = [...details].sort(
    (a, b) => new Date(a.periodStartDate).getTime() - new Date(b.periodStartDate).getTime(),
  )

  if (sorted.length === 0) {
    return (
      <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>
        No quarterly obligations returned for this business.
      </p>
    )
  }

  return (
    <>
      {sorted.map((ob, i) => {
        const fulfilled = ob.status.toLowerCase() === 'fulfilled'
        const quarter = ukQuarterFromPeriodStart(ob.periodStartDate)
        const period = fmtUkPeriodRange(ob.periodStartDate, ob.periodEndDate)

        return (
          <div key={`${ob.periodStartDate}-${ob.periodEndDate}`} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div
              style={{
                width: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  flexShrink: 0,
                  background: fulfilled ? B.green : B.light,
                  border: `2px solid ${B.white}`,
                  boxShadow: `0 0 0 2px ${fulfilled ? '#A7F3D0' : B.borderLight}`,
                }}
              />
              {i < sorted.length - 1 && (
                <div style={{ width: 2, flex: 1, background: B.borderLight, minHeight: 40 }} />
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: 20, paddingLeft: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{quarter}</span>
                  <span style={{ fontSize: 12, color: B.muted, marginLeft: 10 }}>{period}</span>
                </div>
                {fulfilled ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: B.greenBg,
                      color: B.greenText,
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    {ob.receivedDate ? `Submitted ${fmtUkShortDate(ob.receivedDate)}` : 'Submitted'}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: B.surface,
                      color: B.light,
                      border: `1px solid ${B.borderLight}`,
                    }}
                  >
                    Awaiting submission
                  </span>
                )}
              </div>
              {fulfilled && (
                <div
                  style={{
                    display: 'flex',
                    gap: 24,
                    marginTop: 8,
                    fontSize: 12,
                    color: B.muted,
                  }}
                >
                  <span>
                    Due: <b style={{ color: B.text }}>{fmtUkShortDate(ob.dueDate)}</b>
                  </span>
                </div>
              )}
              {!fulfilled && (
                <div style={{ marginTop: 8, fontSize: 12, color: B.light }}>
                  Due: {fmtUkShortDate(ob.dueDate)}, no data submitted yet
                </div>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

function CrystallisationTimeline({ items }: { items: CrystallisationObligation[] }) {
  if (items.length === 0) {
    return (
      <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>
        No final declaration obligations for this tax year.
      </p>
    )
  }

  return (
    <>
      {items.map((ob, i) => {
        const fulfilled = ob.status.toLowerCase() === 'fulfilled'
        const period = fmtUkPeriodRange(ob.periodStartDate, ob.periodEndDate)

        return (
          <div key={`${ob.periodStartDate}-${ob.dueDate}`} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div
              style={{
                width: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  flexShrink: 0,
                  background: fulfilled ? B.green : B.light,
                  border: `2px solid ${B.white}`,
                  boxShadow: `0 0 0 2px ${fulfilled ? '#A7F3D0' : B.borderLight}`,
                }}
              />
              {i < items.length - 1 && (
                <div style={{ width: 2, flex: 1, background: B.borderLight, minHeight: 40 }} />
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: 20, paddingLeft: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Final declaration</span>
                  <span style={{ fontSize: 12, color: B.muted, marginLeft: 10 }}>{period}</span>
                </div>
                {fulfilled ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: B.greenBg,
                      color: B.greenText,
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    {ob.receivedDate ? `Submitted ${fmtUkShortDate(ob.receivedDate)}` : 'Submitted'}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: B.surface,
                      color: B.light,
                      border: `1px solid ${B.borderLight}`,
                    }}
                  >
                    Awaiting submission
                  </span>
                )}
              </div>
              {fulfilled ? (
                <div style={{ marginTop: 8, fontSize: 12, color: B.muted }}>
                  Due: <b style={{ color: B.text }}>{fmtUkShortDate(ob.dueDate)}</b>
                </div>
              ) : (
                <div style={{ marginTop: 8, fontSize: 12, color: B.light }}>
                  Due: {fmtUkShortDate(ob.dueDate)}, no data submitted yet
                </div>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default function ObligationsCard({ client }: { client: ClientRecord }) {
  const displayTaxYear = currentUkTaxYear()

  const [businesses, setBusinesses] = useState<BusinessListItem[]>([])
  const [businessesLoading, setBusinessesLoading] = useState(false)
  const [businessesError, setBusinessesError] = useState<string | null>(null)
  const [selectedKey, setSelectedKey] = useState('')

  const [statusFilter, setStatusFilter] = useState('')
  const [obligationsLoading, setObligationsLoading] = useState(false)
  const [obligationsError, setObligationsError] = useState<string | null>(null)
  const [obligationDetails, setObligationDetails] = useState<ObligationDetail[]>([])

  const [taxYear, setTaxYear] = useState(currentUkTaxYear())
  const [crystalLoading, setCrystalLoading] = useState(false)
  const [crystalError, setCrystalError] = useState<string | null>(null)
  const [crystalObligations, setCrystalObligations] = useState<CrystallisationObligation[]>([])

  const canFetch = !!client.authorisedAt
  const selected = businesses.find((b) => b.businessId === selectedKey) ?? null

  const loadBusinesses = useCallback(async () => {
    if (!client.authorisedAt) return
    setBusinessesLoading(true)
    setBusinessesError(null)
    try {
      const result = await clientsService.listBusinesses(client.id)
      const list = result.listOfBusinesses ?? []
      setBusinesses(list)
      setSelectedKey((prev) => {
        if (prev && list.some((b) => b.businessId === prev)) return prev
        return list[0]?.businessId ?? ''
      })
    } catch (err: unknown) {
      setBusinesses([])
      setSelectedKey('')
      setBusinessesError((err as Error)?.message ?? 'Failed to load businesses.')
    } finally {
      setBusinessesLoading(false)
    }
  }, [client.id, client.authorisedAt])

  const loadObligations = useCallback(async () => {
    if (!client.authorisedAt || !selected) return
    setObligationsLoading(true)
    setObligationsError(null)
    try {
      const result = await clientsService.getIncomeAndExpenditureObligations(client.id, {
        businessId: selected.businessId,
        typeOfBusiness: selected.typeOfBusiness,
        status: statusFilter || undefined,
      })
      const group = (result.obligations ?? []).find((o) => o.businessId === selected.businessId)
      setObligationDetails(
        group?.obligationDetails ?? result.obligations?.[0]?.obligationDetails ?? [],
      )
    } catch (err: unknown) {
      setObligationDetails([])
      setObligationsError((err as Error)?.message ?? 'Failed to load obligations.')
    } finally {
      setObligationsLoading(false)
    }
  }, [client.id, client.authorisedAt, selected, statusFilter])

  const loadCrystallisation = useCallback(async () => {
    if (!client.authorisedAt) return
    setCrystalLoading(true)
    setCrystalError(null)
    try {
      const result = await clientsService.getCrystallisationObligations(client.id, {
        taxYear,
        status: statusFilter || undefined,
      })
      setCrystalObligations(result.obligations ?? [])
    } catch (err: unknown) {
      setCrystalObligations([])
      setCrystalError((err as Error)?.message ?? 'Failed to load final declaration obligations.')
    } finally {
      setCrystalLoading(false)
    }
  }, [client.id, client.authorisedAt, taxYear, statusFilter])

  useEffect(() => {
    if (!canFetch) {
      setBusinesses([])
      setSelectedKey('')
      setObligationDetails([])
      setCrystalObligations([])
      return
    }
    void loadBusinesses()
  }, [canFetch, loadBusinesses])

  useEffect(() => {
    if (!selected) {
      setObligationDetails([])
      return
    }
    void loadObligations()
  }, [selected, loadObligations])

  useEffect(() => {
    if (!canFetch) return
    void loadCrystallisation()
  }, [canFetch, loadCrystallisation])

  return (
    <Card>
      <CardHeader
        title={`Submission history ${displayTaxYear}`}
        right={
          <span style={{ fontSize: 11, color: B.light }}>
            Read-only. Filed via your accounting software.
          </span>
        }
      />
      <div style={{ padding: '16px 20px' }}>
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
            This client must be fully authorised with HMRC before obligations can be retrieved.
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <label style={{ fontSize: 12, color: B.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
            Business
            <select
              value={selectedKey}
              disabled={!canFetch || businessesLoading || businesses.length === 0}
              onChange={(e) => setSelectedKey(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${B.border}`,
                fontSize: 12,
                minWidth: 220,
                maxWidth: 360,
              }}
            >
              {businesses.length === 0 ? (
                <option value="">No businesses</option>
              ) : (
                businesses.map((b) => (
                  <option key={b.businessId} value={b.businessId}>
                    {businessLabel(b)}
                  </option>
                ))
              )}
            </select>
          </label>

          <label style={{ fontSize: 12, color: B.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
            Status
            <select
              value={statusFilter}
              disabled={!canFetch}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${B.border}`,
                fontSize: 12,
              }}
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </label>

          <button
            type="button"
            style={{
              ...outlineBtn,
              opacity: !canFetch || obligationsLoading ? 0.6 : 1,
              cursor: !canFetch || obligationsLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canFetch || !selected || obligationsLoading}
            onClick={() => {
              void loadObligations()
              void loadCrystallisation()
            }}
          >
            {obligationsLoading || crystalLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {businessesError && (
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
            {businessesError}
          </div>
        )}

        {obligationsError && (
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
            {obligationsError}
          </div>
        )}

        {obligationsLoading ? (
          <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>Loading obligations from HMRC...</p>
        ) : (
          <ObligationTimeline details={obligationDetails} />
        )}

        <div style={{ borderTop: `1px solid ${B.borderLight}`, marginTop: 20, paddingTop: 16 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Final declaration</span>
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
          </div>

          {crystalError && (
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
              {crystalError}
            </div>
          )}

          {crystalLoading ? (
            <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>
              Loading final declaration obligations...
            </p>
          ) : (
            <CrystallisationTimeline items={crystalObligations} />
          )}
        </div>
      </div>
    </Card>
  )
}
