import B from '@/styles/theme'
import type { IncomeSummaryResponse } from '@/services/clients.service'

interface Props {
  authorised: boolean
  outstandingBalance: number | null
  incomeSummary: IncomeSummaryResponse | null
  incomeSummaryLoading: boolean
}

function fmtGbp(n: number): string {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function SkeletonBar() {
  return (
    <div
      style={{
        height: 28,
        width: '70%',
        borderRadius: 6,
        marginTop: 5,
        background: `linear-gradient(90deg, ${B.surface} 25%, ${B.borderLight} 50%, ${B.surface} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  )
}

type BissState = 'idle' | 'loading' | 'no-data' | 'loaded'

function bissStateOf(
  authorised: boolean,
  loading: boolean,
  summary: IncomeSummaryResponse | null,
): BissState {
  if (!authorised) return 'idle'
  if (loading) return 'loading'
  if (summary === null) return 'idle'
  if (summary.businesses.length === 0) return 'no-data'
  return 'loaded'
}

export default function MetricsStrip({
  authorised,
  outstandingBalance,
  incomeSummary,
  incomeSummaryLoading,
}: Props) {
  const bissState = bissStateOf(authorised, incomeSummaryLoading, incomeSummary)
  const outstandingColor = outstandingBalance != null && outstandingBalance > 0 ? B.red : B.green

  const metrics = [
    {
      label: `Submitted income (YTD${incomeSummary ? ` ${incomeSummary.taxYear}` : ''})`,
      value:
        bissState === 'loaded' ? fmtGbp(incomeSummary!.totalIncome)
        : bissState === 'no-data' ? 'No data'
        : 'N/A',
      sub:
        bissState === 'loaded'
          ? `${incomeSummary!.businesses.length} business${incomeSummary!.businesses.length > 1 ? 'es' : ''}`
          : bissState === 'no-data'
            ? 'No quarterly submissions yet'
            : authorised ? 'Authorised — HMRC data unavailable' : 'Authorise client to load',
      color: B.green,
      accentColor: bissState === 'loaded' ? B.text : B.light,
      loading: bissState === 'loading',
    },
    {
      label: 'Submitted expenses (YTD)',
      value:
        bissState === 'loaded' ? fmtGbp(incomeSummary!.totalExpenses)
        : bissState === 'no-data' ? 'No data'
        : 'N/A',
      sub:
        bissState === 'loaded'
          ? 'All business types'
          : bissState === 'no-data'
            ? 'No quarterly submissions yet'
            : authorised ? 'Authorised — HMRC data unavailable' : 'Authorise client to load',
      color: B.amber,
      accentColor: bissState === 'loaded' ? B.text : B.light,
      loading: bissState === 'loading',
    },
    {
      label: 'Net profit / loss (YTD)',
      value:
        bissState === 'loaded'
          ? incomeSummary!.netProfit > 0
            ? fmtGbp(incomeSummary!.netProfit)
            : incomeSummary!.netLoss > 0
              ? `-${fmtGbp(incomeSummary!.netLoss)}`
              : '£0'
          : bissState === 'no-data' ? 'No data'
          : 'N/A',
      sub:
        bissState === 'loaded'
          ? incomeSummary!.netLoss > 0 ? 'Net loss' : 'Net profit'
          : bissState === 'no-data'
            ? 'No quarterly submissions yet'
            : authorised ? 'Authorised — HMRC data unavailable' : 'Authorise client to load',
      color: bissState === 'loaded' && incomeSummary!.netLoss > 0 ? B.red : B.primary,
      accentColor: bissState === 'loaded' ? B.text : B.light,
      loading: bissState === 'loading',
    },
    {
      label: 'Outstanding to HMRC',
      value:
        outstandingBalance != null
          ? fmtGbp(outstandingBalance)
          : 'N/A',
      sub:
        outstandingBalance == null
          ? authorised ? 'Authorised — loading...' : 'Authorise client to load'
          : outstandingBalance > 0 ? 'Payment due' : 'All clear',
      color: outstandingBalance != null ? outstandingColor : B.light,
      accentColor: outstandingBalance != null ? B.text : B.light,
      loading: authorised && outstandingBalance === null,
    },
  ]

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: B.white,
              borderRadius: 10,
              padding: '14px 16px',
              border: `1px solid ${B.border}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: m.color, opacity: m.loading ? 0.4 : 1,
              }}
            />
            <div style={{ fontSize: 11, fontWeight: 600, color: B.muted, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              {m.label}
            </div>
            {m.loading ? (
              <SkeletonBar />
            ) : (
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4, color: m.accentColor }}>
                {m.value}
              </div>
            )}
            <div style={{ fontSize: 11, color: B.light, marginTop: 3 }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </>
  )
}
