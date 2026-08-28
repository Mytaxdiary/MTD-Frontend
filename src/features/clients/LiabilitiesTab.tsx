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
  type HmrcChargeHistoryDetail,
  type HmrcPayment,
} from '@/services/clients.service'
import MessageModal from '@/features/clients/detail/MessageModal'
import { usePermissions } from '@/hooks/usePermissions'

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

function firstChargeReference(payment: HmrcPayment): string | undefined {
  return payment.allocations?.map((a) => a.chargeReference).find((ref) => !!ref)
}

function fmtChangeWhen(row: HmrcChargeHistoryDetail): string {
  if (row.changeTimestamp) {
    const d = new Date(row.changeTimestamp)
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    }
  }
  return fmtUkShortDate(row.changeDate) || '-'
}

const historyBtn: React.CSSProperties = {
  ...outlineBtn,
  padding: '4px 10px',
  fontSize: 11,
}

interface Props {
  client: ClientRecord
}

function buildPaymentDetailsMessage(
  clientName: string,
  totalBalance: number | null,
  overdueAmount: number | null,
  utr?: string,
): { subject: string; body: string } {
  const balanceLine =
    totalBalance != null
      ? `Your current outstanding balance with HMRC is ${fmtMoney(totalBalance)}.`
      : 'Please check your Self Assessment account for your latest balance.'
  const overdueLine =
    overdueAmount != null && overdueAmount > 0
      ? `\nOf this, ${fmtMoney(overdueAmount)} is overdue.`
      : ''
  const referenceLine = utr
    ? `Reference (your UTR): ${utr}`
    : 'Reference: your 10-digit Unique Taxpayer Reference (UTR)'

  return {
    subject: 'HMRC payment details',
    body: [
      `Hi ${clientName},`,
      '',
      balanceLine + overdueLine,
      '',
      'You can pay HMRC by bank transfer using these details:',
      '',
      'Sort code: 08-32-10',
      'Account number: 12001039',
      referenceLine,
      '',
      'You can also pay online at https://www.gov.uk/pay-self-assessment-tax-bill',
      '',
      'If you have any questions, reply here in the portal or get in touch.',
      '',
      'Kind regards',
    ].join('\n'),
  }
}

export default function LiabilitiesTab({ client }: Props) {
  const { canChase } = usePermissions()
  const [liabLoading, setLiabLoading] = useState(false)
  const [liabError, setLiabError] = useState<string | null>(null)
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [rows, setRows] = useState<ReturnType<typeof filterLiabilityDocuments>>([])
  const [totalBalance, setTotalBalance] = useState<number | null>(null)
  const [overdueAmount, setOverdueAmount] = useState<number | null>(null)

  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  const [payments, setPayments] = useState<HmrcPayment[]>([])
  const [showMsgModal, setShowMsgModal] = useState(false)

  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [historyRows, setHistoryRows] = useState<HmrcChargeHistoryDetail[]>([])
  const [historyLabel, setHistoryLabel] = useState<string | null>(null)
  const [historySource, setHistorySource] = useState<string | null>(null)

  const canFetch = !!client.authorisedAt
  const paymentMsg = buildPaymentDetailsMessage(
    client.name,
    totalBalance,
    overdueAmount,
    client.utr,
  )

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

  const openLiabilityHistory = useCallback(
    async (documentId: string, label: string) => {
      if (!client.authorisedAt) return
      setHistoryLabel(label)
      setHistorySource('Document ID and transaction ID')
      setHistoryLoading(true)
      setHistoryError(null)
      setHistoryRows([])
      try {
        const [byId, byTxn] = await Promise.allSettled([
          clientsService.getChargeHistory(client.id, documentId),
          clientsService.getChargeHistoryByTransactionId(client.id, documentId),
        ])
        const ok =
          byId.status === 'fulfilled'
            ? byId.value
            : byTxn.status === 'fulfilled'
              ? byTxn.value
              : null
        if (!ok) {
          const reason =
            byId.status === 'rejected'
              ? byId.reason
              : byTxn.status === 'rejected'
                ? byTxn.reason
                : null
          throw reason instanceof Error ? reason : new Error('Failed to load charge history.')
        }
        setHistoryRows(ok.chargeHistoryDetails ?? [])
      } catch (err: unknown) {
        setHistoryRows([])
        setHistoryError((err as Error)?.message ?? 'Failed to load charge history.')
      } finally {
        setHistoryLoading(false)
      }
    },
    [client.id, client.authorisedAt],
  )

  const openPaymentHistory = useCallback(
    async (payment: HmrcPayment) => {
      if (!client.authorisedAt) return
      const chargeReference = firstChargeReference(payment)
      const label = payment.paymentReference
        ? `Payment ${payment.paymentReference}`
        : 'Payment'
      setHistoryLabel(label)
      setHistorySource('Charge reference')
      setHistoryRows([])
      if (!chargeReference) {
        setHistoryLoading(false)
        setHistoryError('This payment has no HMRC charge reference, so history cannot be loaded.')
        return
      }
      setHistoryLoading(true)
      setHistoryError(null)
      try {
        const data = await clientsService.getChargeHistoryByChargeReference(
          client.id,
          chargeReference,
        )
        setHistoryRows(data.chargeHistoryDetails ?? [])
      } catch (err: unknown) {
        setHistoryRows([])
        setHistoryError((err as Error)?.message ?? 'Failed to load charge history.')
      } finally {
        setHistoryLoading(false)
      }
    },
    [client.id, client.authorisedAt],
  )

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
            right={
              <span style={{ fontSize: 12, color: B.muted }}>Source: SA Accounts API v4.0</span>
            }
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
                {['Description', 'Due date', 'Original', 'Outstanding', 'Interest', 'Status', ''].map(
                  (h, i) => (
                    <th
                      key={h || 'history'}
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {liabLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    Loading liabilities from HMRC...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    {canFetch
                      ? 'No liability charges returned for this period.'
                      : 'Authorise client to load data.'}
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
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
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
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          type="button"
                          style={{
                            ...historyBtn,
                            opacity: doc.documentId ? 1 : 0.5,
                            cursor: doc.documentId ? 'pointer' : 'not-allowed',
                          }}
                          disabled={!doc.documentId}
                          title={
                            doc.documentId
                              ? 'View HMRC charge history'
                              : 'No document ID from HMRC'
                          }
                          onClick={() =>
                            void openLiabilityHistory(
                              doc.documentId as string,
                              formatLiabilityDescription(doc),
                            )
                          }
                        >
                          History
                        </button>
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
                {['Date', 'Amount', 'Reference', 'Method', ''].map((h, i) => (
                  <th
                    key={h || 'history'}
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
                  <td colSpan={5} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    Loading payment history from HMRC...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '16px', color: B.muted, fontSize: 12 }}>
                    {canFetch
                      ? 'No payments found for the last 2 years.'
                      : 'Authorise client to load data.'}
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => {
                  const amount = sanitizeHmrcAmount(p.paymentAmount)
                  const chargeReference = firstChargeReference(p)
                  return (
                    <tr
                      key={`${p.paymentLot ?? i}-${p.paymentLotItem ?? i}`}
                      style={{ borderBottom: `1px solid ${B.borderLight}` }}
                    >
                      <td style={{ padding: '12px 16px' }}>{fmtUkShortDate(p.transactionDate)}</td>
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
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          type="button"
                          style={historyBtn}
                          title={
                            chargeReference
                              ? 'View HMRC charge history by charge reference'
                              : 'No charge reference on this payment'
                          }
                          onClick={() => void openPaymentHistory(p)}
                        >
                          History
                        </button>
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
          <CardHeader title="Charge history" />
          <div style={{ padding: '12px 20px 16px' }}>
            {!historyLabel && !historyLoading && !historyError ? (
              <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.6 }}>
                Click History on a liability to load document ID and transaction ID history, or on
                a payment to load history by charge reference.
              </div>
            ) : (
              <>
                {historyLabel && (
                  <div style={{ fontSize: 13, fontWeight: 600, color: B.text, marginBottom: 4 }}>
                    {historyLabel}
                  </div>
                )}
                {historySource && (
                  <div style={{ fontSize: 11, color: B.muted, marginBottom: 10 }}>
                    Source: {historySource}
                  </div>
                )}
                {historyLoading && (
                  <div style={{ fontSize: 12, color: B.muted }}>Loading charge history...</div>
                )}
                {historyError && (
                  <div
                    style={{
                      padding: '8px 10px',
                      background: B.redBg,
                      border: '1px solid #FECACA',
                      borderRadius: 6,
                      fontSize: 12,
                      color: B.redText,
                    }}
                  >
                    {historyError}
                  </div>
                )}
                {!historyLoading && !historyError && historyRows.length === 0 && historyLabel && (
                  <div style={{ fontSize: 12, color: B.muted }}>
                    No charge history returned for this item.
                  </div>
                )}
                {!historyLoading &&
                  historyRows.map((row, i) => (
                    <div
                      key={`${row.transactionId ?? i}-${row.changeTimestamp ?? row.changeDate ?? i}`}
                      style={{
                        padding: '10px 0',
                        borderTop: i === 0 ? `1px solid ${B.borderLight}` : undefined,
                        borderBottom: `1px solid ${B.borderLight}`,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: B.text }}>
                        {row.changeReason || row.description || 'Change'}
                      </div>
                      <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>
                        {fmtChangeWhen(row)}
                      </div>
                      {row.description && row.changeReason && (
                        <div style={{ fontSize: 12, color: B.text, marginTop: 4 }}>
                          {row.description}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          fontVariantNumeric: 'tabular-nums',
                          marginTop: 4,
                        }}
                      >
                        {fmtMoney(sanitizeHmrcAmount(row.totalAmount))}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </Card>
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
                ['Reference (UTR)', client.utr || 'Not set'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}
                >
                  <span style={{ fontSize: 13, color: '#0369A1' }}>{k}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: B.blueText,
                      fontStyle: k.includes('UTR') && !client.utr ? 'italic' : 'normal',
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        {canChase && (
        <Card>
          <CardHeader title="Send to client" />
          <div style={{ padding: '14px 20px' }}>
            <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.6, marginBottom: 12 }}>
              Send liability summary and payment details to the client&apos;s portal.
            </div>
            <button
              type="button"
              onClick={() => setShowMsgModal(true)}
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
        )}
      </div>

      {canChase && (
      <MessageModal
        show={showMsgModal}
        onClose={() => setShowMsgModal(false)}
        clientId={client.id}
        clientName={client.name}
        initialSubject={paymentMsg.subject}
        initialBody={paymentMsg.body}
      />
      )}
    </div>
  )
}
