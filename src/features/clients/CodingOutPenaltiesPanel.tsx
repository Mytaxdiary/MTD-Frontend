'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { currentUkTaxYear } from '@/lib/hmrc/taxYear'
import {
  clientsService,
  type CodingOutAmountItem,
  type CodingOutStatusResponse,
  type CodingOutUnderpaymentsResponse,
  type ItsaPenaltiesResponse,
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

function taxYearOptions(count = 5): string[] {
  const current = currentUkTaxYear()
  const start = Number(current.slice(0, 4))
  const years: string[] = []
  for (let i = 0; i < count; i += 1) {
    const y = start - i
    years.push(`${y}-${String((y + 1) % 100).padStart(2, '0')}`)
  }
  return years
}

function newComponentId(): number {
  return Number(`${Date.now()}${Math.floor(Math.random() * 100)}`.slice(-12)) || Date.now()
}

function parseAmount(raw: string): number | undefined {
  const t = raw.trim()
  if (!t) return undefined
  const n = Number(t)
  if (!Number.isFinite(n) || n < 0) throw new Error('Amounts must be valid non-negative numbers.')
  return Math.round(n * 100) / 100
}

function parseId(raw: string, fallback: number): number {
  const t = raw.trim()
  if (!t) return fallback
  const n = Number(t)
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('Each coding out id must be a whole number of at least 1.')
  }
  return n
}

function AmountRows({ title, items }: { title: string; items?: CodingOutAmountItem[] }) {
  if (!items?.length) return null
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: B.text, marginBottom: 6 }}>{title}</div>
      {items.map((item, idx) => (
        <div
          key={`${title}-${item.id ?? idx}`}
          style={{
            fontSize: 12,
            color: B.muted,
            padding: '6px 0',
            borderBottom: `1px solid ${B.border}`,
          }}
        >
          {fmtMoney(item.amount)}
          {item.source ? ` · ${item.source}` : ''}
          {item.id != null ? ` · id ${item.id}` : ''}
        </div>
      ))}
    </div>
  )
}

function AmountOne({ title, item }: { title: string; item?: CodingOutAmountItem }) {
  if (!item) return null
  return <AmountRows title={title} items={[item]} />
}

type UpsertComponents = {
  payeUnderpayment?: Array<{ id: number; amount: number }>
  selfAssessmentUnderpayment?: Array<{ id: number; amount: number }>
  debt?: Array<{ id: number; amount: number }>
  inYearAdjustment?: { id: number; amount: number }
}

type Props = {
  clientId: string
  authorised: boolean
}

export default function CodingOutPenaltiesPanel({ clientId, authorised }: Props) {
  const years = useMemo(() => taxYearOptions(5), [])
  const [taxYear, setTaxYear] = useState(years[1] ?? years[0] ?? currentUkTaxYear())
  const [coding, setCoding] = useState<CodingOutUnderpaymentsResponse | null>(null)
  const [status, setStatus] = useState<CodingOutStatusResponse | null>(null)
  const [penalties, setPenalties] = useState<ItsaPenaltiesResponse | null>(null)
  const [codingError, setCodingError] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [penaltiesError, setPenaltiesError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  const [paye, setPaye] = useState('')
  const [payeId, setPayeId] = useState('')
  const [saUnder, setSaUnder] = useState('')
  const [saId, setSaId] = useState('')
  const [debt, setDebt] = useState('')
  const [debtId, setDebtId] = useState('')
  const [iya, setIya] = useState('')
  const [iyaId, setIyaId] = useState('')

  const loadAll = useCallback(async () => {
    if (!authorised) return
    setLoading(true)
    setCodingError(null)
    setStatusError(null)
    setPenaltiesError(null)
    try {
      const [c, s, p] = await Promise.all([
        clientsService.getCodingOutUnderpayments(clientId, taxYear).catch((err: Error) => {
          setCodingError(err.message)
          return null
        }),
        clientsService.getCodingOutStatus(clientId, taxYear).catch((err: Error) => {
          setStatusError(err.message)
          return null
        }),
        clientsService.getItsaPenalties(clientId).catch((err: Error) => {
          setPenaltiesError(err.message)
          return null
        }),
      ])
      setCoding(c)
      setStatus(s)
      setPenalties(p)

      const tc = c?.taxCodeComponents
      if (tc?.payeUnderpayment?.[0]) {
        setPaye(String(tc.payeUnderpayment[0].amount ?? ''))
        setPayeId(tc.payeUnderpayment[0].id != null ? String(tc.payeUnderpayment[0].id) : '')
      } else {
        setPaye('')
        setPayeId('')
      }
      if (tc?.selfAssessmentUnderpayment?.[0]) {
        setSaUnder(String(tc.selfAssessmentUnderpayment[0].amount ?? ''))
        setSaId(
          tc.selfAssessmentUnderpayment[0].id != null
            ? String(tc.selfAssessmentUnderpayment[0].id)
            : '',
        )
      } else {
        setSaUnder('')
        setSaId('')
      }
      if (tc?.debt?.[0]) {
        setDebt(String(tc.debt[0].amount ?? ''))
        setDebtId(tc.debt[0].id != null ? String(tc.debt[0].id) : '')
      } else {
        setDebt('')
        setDebtId('')
      }
      if (tc?.inYearAdjustment) {
        setIya(String(tc.inYearAdjustment.amount ?? ''))
        setIyaId(tc.inYearAdjustment.id != null ? String(tc.inYearAdjustment.id) : '')
      } else {
        setIya('')
        setIyaId('')
      }
    } finally {
      setLoading(false)
    }
  }, [authorised, clientId, taxYear])

  useEffect(() => {
    if (!authorised) {
      setCoding(null)
      setStatus(null)
      setPenalties(null)
      return
    }
    void loadAll()
  }, [authorised, loadAll])

  async function onSaveAmounts() {
    try {
      setBusy(true)
      setCodingError(null)
      const payeAmt = parseAmount(paye)
      const saAmt = parseAmount(saUnder)
      const debtAmt = parseAmount(debt)
      const iyaAmt = parseAmount(iya)
      const taxCodeComponents: UpsertComponents = {}
      if (payeAmt != null) {
        taxCodeComponents.payeUnderpayment = [
          { id: parseId(payeId, newComponentId()), amount: payeAmt },
        ]
      }
      if (saAmt != null) {
        taxCodeComponents.selfAssessmentUnderpayment = [
          { id: parseId(saId, newComponentId()), amount: saAmt },
        ]
      }
      if (debtAmt != null) {
        taxCodeComponents.debt = [{ id: parseId(debtId, newComponentId()), amount: debtAmt }]
      }
      if (iyaAmt != null) {
        taxCodeComponents.inYearAdjustment = {
          id: parseId(iyaId, newComponentId()),
          amount: iyaAmt,
        }
      }
      if (!Object.keys(taxCodeComponents).length) {
        throw new Error('Enter at least one amount to save.')
      }
      const next = await clientsService.upsertCodingOutUnderpayments(clientId, taxYear, {
        taxCodeComponents,
      })
      setCoding(next)
    } catch (err) {
      setCodingError(err instanceof Error ? err.message : 'Failed to save coding out amounts.')
    } finally {
      setBusy(false)
    }
  }

  async function onDeleteAmounts() {
    if (!window.confirm(`Delete user-submitted coding out amounts for ${taxYear}?`)) return
    try {
      setBusy(true)
      setCodingError(null)
      await clientsService.deleteCodingOutUnderpayments(clientId, taxYear)
      const next = await clientsService.getCodingOutUnderpayments(clientId, taxYear).catch(() => null)
      setCoding(next)
    } catch (err) {
      setCodingError(err instanceof Error ? err.message : 'Failed to delete coding out amounts.')
    } finally {
      setBusy(false)
    }
  }

  async function onOpt(action: 'out' | 'in') {
    const label = action === 'out' ? 'opt out of' : 'opt in to'
    if (!window.confirm(`Confirm ${label} coding out for ${taxYear}?`)) return
    try {
      setBusy(true)
      setStatusError(null)
      const next =
        action === 'out'
          ? await clientsService.optOutOfCodingOut(clientId, taxYear)
          : await clientsService.optInToCodingOut(clientId, taxYear)
      setStatus(next)
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Failed to update coding out status.')
    } finally {
      setBusy(false)
    }
  }

  const components = coding?.taxCodeComponents
  const totals = penalties?.totalisations
  const lateSub = penalties?.lateSubmissionPenalty
  const latePay = penalties?.latePaymentPenalty?.details ?? []

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 8,
    border: `1px solid ${B.border}`,
    fontSize: 13,
  }

  const hasAmounts =
    !!components?.payeUnderpayment?.length ||
    !!components?.selfAssessmentUnderpayment?.length ||
    !!components?.debt?.length ||
    !!components?.inYearAdjustment

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <CardHeader
          title="Coding out"
          right={
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                style={{ ...fieldStyle, width: 'auto', padding: '6px 10px', fontSize: 12 }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <button
                type="button"
                style={{ ...outlineBtn, opacity: loading || busy ? 0.6 : 1 }}
                disabled={!authorised || loading || busy}
                onClick={() => void loadAll()}
              >
                {loading ? 'Loading…' : 'Refresh'}
              </button>
            </div>
          }
        />

        {!authorised && (
          <div style={{ padding: '12px 20px 16px', fontSize: 12, color: B.muted }}>
            Authorise this client with HMRC to load coding out data.
          </div>
        )}

        {authorised && (
          <div style={{ padding: '8px 20px 20px' }}>
            <div style={{ fontSize: 12, color: B.muted, marginBottom: 14, lineHeight: 1.5 }}>
              HMRC requires both an <b>id</b> and <b>amount</b> for each component. Leave id blank to
              auto-generate one for new entries. Use the existing id when amending.
            </div>

            {statusError && (
              <div style={{ fontSize: 12, color: B.redText, marginBottom: 10 }}>{statusError}</div>
            )}
            {status && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 16,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: B.surface,
                  border: `1px solid ${B.border}`,
                }}
              >
                <span style={{ fontSize: 13, color: B.text }}>
                  Status:{' '}
                  <b>{status.optOutIndicator ? 'Opted out of coding out' : 'Opted in to coding out'}</b>
                </span>
                <button type="button" style={outlineBtn} disabled={busy} onClick={() => void onOpt('out')}>
                  Opt out
                </button>
                <button type="button" style={outlineBtn} disabled={busy} onClick={() => void onOpt('in')}>
                  Opt in
                </button>
              </div>
            )}

            {codingError && (
              <div style={{ fontSize: 12, color: B.redText, marginBottom: 10 }}>{codingError}</div>
            )}

            <AmountRows title="PAYE underpayment" items={components?.payeUnderpayment} />
            <AmountRows
              title="Self Assessment underpayment"
              items={components?.selfAssessmentUnderpayment}
            />
            <AmountRows title="Debt" items={components?.debt} />
            <AmountOne title="In-year adjustment" item={components?.inYearAdjustment} />
            {!hasAmounts && !codingError && (
              <div style={{ fontSize: 12, color: B.muted, marginBottom: 12 }}>
                No coding out amounts returned for {taxYear}.
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
                marginTop: 8,
              }}
            >
              <FieldPair
                label="PAYE underpayment"
                amount={paye}
                idValue={payeId}
                onAmount={setPaye}
                onId={setPayeId}
                fieldStyle={fieldStyle}
              />
              <FieldPair
                label="SA underpayment"
                amount={saUnder}
                idValue={saId}
                onAmount={setSaUnder}
                onId={setSaId}
                fieldStyle={fieldStyle}
              />
              <FieldPair
                label="Debt"
                amount={debt}
                idValue={debtId}
                onAmount={setDebt}
                onId={setDebtId}
                fieldStyle={fieldStyle}
              />
              <FieldPair
                label="In-year adjustment"
                amount={iya}
                idValue={iyaId}
                onAmount={setIya}
                onId={setIyaId}
                fieldStyle={fieldStyle}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              <button
                type="button"
                style={{
                  ...outlineBtn,
                  background: B.primary,
                  color: '#fff',
                  borderColor: B.primary,
                }}
                disabled={busy}
                onClick={() => void onSaveAmounts()}
              >
                Save / amend amounts
              </button>
              <button
                type="button"
                style={outlineBtn}
                disabled={busy}
                onClick={() => void onDeleteAmounts()}
              >
                Delete submitted amounts
              </button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="ITSA penalties" />
        {!authorised && (
          <div style={{ padding: '12px 20px 16px', fontSize: 12, color: B.muted }}>
            Authorise this client with HMRC to load penalties.
          </div>
        )}
        {authorised && (
          <div style={{ padding: '8px 20px 20px' }}>
            {penaltiesError && (
              <div style={{ fontSize: 12, color: B.redText, marginBottom: 10 }}>{penaltiesError}</div>
            )}
            {totals && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Total label="Late submission total" value={totals.lateSubmissionPenaltyTotalValue} />
                <Total label="Penalised principal" value={totals.penalisedPrincipalTotal} />
                <Total label="Late payment posted" value={totals.latePaymentPenaltyPostedTotal} />
                <Total label="Late payment estimate" value={totals.latePaymentPenaltyEstimateTotal} />
              </div>
            )}

            {lateSub?.summary && (
              <div style={{ fontSize: 12, color: B.muted, marginBottom: 12, lineHeight: 1.55 }}>
                Active points:{' '}
                <b style={{ color: B.text }}>{lateSub.summary.activePenaltyPoints ?? '-'}</b>
                {' · '}
                Inactive:{' '}
                <b style={{ color: B.text }}>{lateSub.summary.inactivePenaltyPoints ?? '-'}</b>
                {' · '}
                Threshold: <b style={{ color: B.text }}>{lateSub.summary.regimeThreshold ?? '-'}</b>
                {' · '}
                Charge:{' '}
                <b style={{ color: B.text }}>{fmtMoney(lateSub.summary.penaltyChargeAmount)}</b>
              </div>
            )}

            {(lateSub?.details?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Late submission</div>
                {lateSub!.details!.map((row, idx) => (
                  <div
                    key={row.penaltyChargeReference ?? idx}
                    style={{
                      fontSize: 12,
                      color: B.muted,
                      padding: '8px 0',
                      borderBottom: `1px solid ${B.border}`,
                    }}
                  >
                    {row.penaltyChargeReference ?? 'Penalty'} · {row.penaltyStatus ?? '-'} ·{' '}
                    {fmtMoney(row.penaltyChargeAmount)}
                    {row.penaltyChargeDueDate ? ` · due ${row.penaltyChargeDueDate}` : ''}
                  </div>
                ))}
              </div>
            )}

            {latePay.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Late payment</div>
                {latePay.map((row, idx) => (
                  <div
                    key={row.penaltyChargeReference ?? idx}
                    style={{
                      fontSize: 12,
                      color: B.muted,
                      padding: '8px 0',
                      borderBottom: `1px solid ${B.border}`,
                    }}
                  >
                    {row.penaltyChargeReference ?? row.principalChargeReference ?? 'Penalty'} ·{' '}
                    {row.penaltyStatus ?? '-'} · {fmtMoney(row.penaltyChargeAmount)}
                    {row.penaltyChargeDueDate ? ` · due ${row.penaltyChargeDueDate}` : ''}
                  </div>
                ))}
              </div>
            )}

            {!penaltiesError && !totals && !(lateSub?.details?.length) && latePay.length === 0 && (
              <div style={{ fontSize: 12, color: B.muted }}>No ITSA penalties returned.</div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

function FieldPair({
  label,
  amount,
  idValue,
  onAmount,
  onId,
  fieldStyle,
}: {
  label: string
  amount: string
  idValue: string
  onAmount: (v: string) => void
  onId: (v: string) => void
  fieldStyle: React.CSSProperties
}) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label style={{ fontSize: 11, color: B.muted }}>
        {label} amount
        <input
          style={{ ...fieldStyle, marginTop: 4 }}
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          placeholder="e.g. 100.00"
        />
      </label>
      <label style={{ fontSize: 11, color: B.muted }}>
        {label} id
        <input
          style={{ ...fieldStyle, marginTop: 4 }}
          inputMode="numeric"
          value={idValue}
          onChange={(e) => onId(e.target.value)}
          placeholder="blank = auto"
        />
      </label>
    </div>
  )
}

function Total({ label, value }: { label: string; value?: number }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid ${B.border}`,
        background: '#fff',
      }}
    >
      <div style={{ fontSize: 11, color: B.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: B.text }}>{fmtMoney(value)}</div>
    </div>
  )
}
