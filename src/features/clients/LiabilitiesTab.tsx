'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { fmtUkShortDate } from '@/lib/hmrc/quarterLabel'
import {
  filterLiabilityDocuments,
  formatLiabilityDescription,
  liabilityInterestAmount,
  liabilityRowStatus,
  sanitizeHmrcAmount,
} from '@/lib/hmrc/liabilityLabel'
import {
  clientsService,
  type ClientRecord,
  type HmrcPayment,
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

function fmtMoney(amount: number | null | undefined): string {
  if (amount == null) return '-'
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function StatusBadge({ status }: { status: 'paid' | 'upcoming' | 'overdue' }) {
  if (status === 'paid') {
    return (
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
        Paid
      </span>
    )
  }
  if (status === 'overdue') {
    return (
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 10px',
          borderRadius: 20,
          background: B.redBg,
          color: B.redText,
          border: '1px solid #FECACA',
        }}
      >
        Overdue
      </span>
    )
  }
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 20,
        background: B.amberBg,
        color: B.amberText,
        border: '1px solid #FDE68A',
      }}
    >
      Upcoming
    </span>
  )
}

function fmtPaymentMethod(method?: string): string {
  if (!method) return '-'
  const map: Record<string, string> = {
    A: 'Bank transfer',
    B: 'Direct Debit',
    C: 'Card',
    D: 'Cheque',
  }
  return map[method] ?? method
}

interface Props {
  client: ClientRecord
}

export default function LiabilitiesTab({ client }: Props) {
  const [liabLoading, setLiabLoading] = useState(false)
  const [liabError, setLiabError] = useState<string | null>(null)
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [rows, setRows] = useState<ReturnType<typeof filterLiabilityDocuments>>([])
  const [totalBalance, setTotalBalance] = useState<number | null>(null)
  const [overdueAmount, setOverdueAmount] = useState<number | null>(null)

  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  const [payments, setPayments] = useState<HmrcPayment[]>([])

  const canFetch = !!client.authorisedAt

  const fetchLiabilities = useCallback(async () => {
    if (!client.authorisedAt) return
    setLiabLoading(true)
    setLiabError(null)
    try {
      const data = await clientsService.getBalanceAndTransactions(client.id, {
        onlyOpenItems: onlyOpen || undefined,
        calculateAccruedInterest: true,
      })
      setRows(filterLiabilityDocuments(data.documentDetails))
      setTotalBalance(sanitizeHmrcAmount(data.balanceDetails?.totalBalance))
      setOverdueAmount(sanitizeHmrcAmount(data.balanceDetails?.overdueAmount))
    } catch (err: unknown) {
      setRows([])
      setTotalBalance(null)
      setOverdueAmount(null)
      setLiabError((err as Error)?.message ?? 'Failed to load HMRC liabilities.')
    } finally {
      setLiabLoading(false)
    }
  }, [client.id, client.authorisedAt, onlyOpen])

  const fetchPayments = useCallback(async () => {
    if (!client.authorisedAt) return
    setPaymentsLoading(true)
    setPaymentsError(null)
    try {
      const data = await clientsService.getPaymentsAndAllocations(client.id)
      setPayments(data.payments ?? [])
    } catch (err: unknown) {
      setPayments([])
      setPaymentsError((err as Error)?.message ?? 'Failed to load payment history from HMRC.')
    } finally {
      setPaymentsLoading(false)
    }
  }, [client.id, client.authorisedAt])

  useEffect(() => {
    if (!canFetch) {
      setRows([])
      setLiabError(null)
      setPayments([])
      setPaymentsError(null)
      return
    }
    void fetchLiabilities()
    void fetchPayments()
  }, [canFetch, fetchLiabilities, fetchPayments])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Liabilities ─────────────────────────────── */}
        <Card>
          <CardHeader
            title="HMRC liabilities"
            right={<span style={{ fontSize: 12, color: B.muted }}>Source: SA Accounts API v4.0</span>}
          />

          {!canFetch && (
            <div
              style={{
                margin: '12px 20px 0',
                padding: '10px 12px',
                background: B.amberBg,
                border: '1px solid #FDE68A',
                borderRadius: 8,
                fontSize: 12,
                color: B.amberText,
              }}
            >
              Authorise this client with HMRC to load live liabilities.
            </div>
          )}

          {canFetch && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: '12px 20px 0',
              }}
            >
              {(totalBalance != null || overdueAmount != null) && (
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: B.muted }}>
                  {totalBalance != null && (
                    <span>
                      Total balance: <b style={{ color: B.text }}>{fmtMoney(totalBalance)}</b>
                    </span>
                  )}
                  {overdueAmount != null && overdueAmount > 0 && (
                    <span>
                      Overdue: <b style={{ color: B.redText }}>{fmtMoney(overdueAmount)}</b>
                    </span>
                  )}
                </div>
              )}
              <label
                style={{
                  fontSize: 12,
                  color: B.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginLeft: 'auto',
                }}
              >
                <input
                  type="checkbox"
                  checked={onlyOpen}
                  onChange={(e) => setOnlyOpen(e.target.checked)}
                />
                Open items only
              </label>
              <button
                type="button"
                style={{
                  ...outlineBtn,
                  opacity: liabLoading ? 0.6 : 1,
                  cursor: liabLoading ? 'not-allowed' : 'pointer',
                }}
                disabled={liabLoading}
                onClick={() => void fetchLiabilities()}
              >
                {liabLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          )}

          {liabError && (
            <div
              style={{
                margin: '12px 20px 0',
                padding: '10px 12px',
                background: B.redBg,
                border: '1px solid #FECACA',
                borderRadius: 8,
                fontSize: 12,
                color: B.redText,
              }}
            >
              {liabError}
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                {['Description', 'Due date', 'Original', 'Outstanding', 'Interest', 'Status'].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: i >= 2 && i <= 4 ? 'right' : 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: B.light,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {liabLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    Loading liabilities from HMRC...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    {canFetch ? 'No liability charges returned for this period.' : 'Authorise client to load data.'}
                  </td>
                </tr>
              ) : (
                rows.map((doc, i) => {
                  const status = liabilityRowStatus(doc)
                  const interest = liabilityInterestAmount(doc)
                  const original = sanitizeHmrcAmount(doc.originalAmount)
                  const outstanding = sanitizeHmrcAmount(doc.outstandingAmount)
                  return (
                    <tr
                      key={`${doc.documentId ?? i}-${doc.documentDueDate ?? i}`}
                      style={{
                        borderBottom: `1px solid ${B.borderLight}`,
                        background: i % 2 === 1 ? '#FAFBFC' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                        {formatLiabilityDescription(doc)}
                      </td>
                      <td style={{ padding: '12px 16px', color: B.muted }}>
                        {fmtUkShortDate(doc.documentDueDate)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtMoney(original)}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 600,
                          color: outstanding != null && outstanding > 0 ? B.text : B.light,
                        }}
                      >
                        {outstanding != null && outstanding > 0 ? fmtMoney(outstanding) : '-'}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          color: interest != null && interest > 0 ? B.text : B.light,
                        }}
                      >
                        {interest != null && interest > 0 ? fmtMoney(interest) : '-'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </Card>

        {/* ── Payment history ──────────────────────────── */}
        <Card>
          <CardHeader
            title="Payment history"
            right={
              canFetch ? (
                <button
                  type="button"
                  style={{
                    ...outlineBtn,
                    opacity: paymentsLoading ? 0.6 : 1,
                    cursor: paymentsLoading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={paymentsLoading}
                  onClick={() => void fetchPayments()}
                >
                  {paymentsLoading ? 'Loading...' : 'Refresh'}
                </button>
              ) : undefined
            }
          />

          {paymentsError && (
            <div
              style={{
                margin: '12px 20px 0',
                padding: '10px 12px',
                background: B.redBg,
                border: '1px solid #FECACA',
                borderRadius: 8,
                fontSize: 12,
                color: B.redText,
              }}
            >
              {paymentsError}
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                {['Date', 'Amount', 'Reference', 'Method'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: i === 1 ? 'right' : 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentsLoading && payments.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    Loading payment history from HMRC...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    {canFetch ? 'No payments found for the last 2 years.' : 'Authorise client to load data.'}
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => {
                  const amount = sanitizeHmrcAmount(p.paymentAmount)
                  return (
                    <tr key={`${p.paymentLot ?? i}-${p.paymentLotItem ?? i}`} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                      <td style={{ padding: '12px 16px' }}>
                        {fmtUkShortDate(p.transactionDate)}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontWeight: 600,
                          fontVariantNumeric: 'tabular-nums',
                          color: B.greenText,
                        }}
                      >
                        {amount != null ? fmtMoney(amount) : '-'}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          fontFamily: 'monospace',
                          fontSize: 11,
                          color: B.muted,
                        }}
                      >
                        {p.paymentReference ?? '-'}
                      </td>
                      <td style={{ padding: '12px 16px', color: B.muted }}>
                        {fmtPaymentMethod(p.paymentMethod)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Right sidebar ───────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardHeader title="HMRC payment details" />
          <div style={{ padding: '12px 20px' }}>
            <div
              style={{
                padding: '14px',
                background: B.blueBg,
                borderRadius: 8,
                border: '1px solid #BAE6FD',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: B.blueText, marginBottom: 8 }}>
                Pay by bank transfer
              </div>
              {[
                ['Sort code', '08-32-10'],
                ['Account number', '12001039'],
                ['Reference', '12345 67890'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}
                >
                  <span style={{ fontSize: 12, color: '#0369A1' }}>{k}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: B.blueText,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Send to client" />
          <div style={{ padding: '14px 20px' }}>
            <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.6, marginBottom: 12 }}>
              Send liability summary and payment details to the client&apos;s portal.
            </div>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: 'none',
                background: B.primary,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Message client with payment details
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
