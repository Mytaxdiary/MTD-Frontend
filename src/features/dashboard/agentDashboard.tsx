'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TypePills from '@/components/common/typePills'
import { matchesTypeFilter } from '@/lib/helpers/clientType'
import B from '@/styles/theme'
import { useCurrentUser, firstName } from '@/components/auth/CurrentUserProvider'
import dashboardService, {
  type DashboardClientRow,
  type DashboardSummary,
} from '@/services/dashboard.service'
import EmptyStateIllustration from '@/components/ui/EmptyStateIllustration'
import {
  PIPELINE_KANBAN_COLS,
  PIPELINE_STATUS_LABELS,
  PIPELINE_STATUS_STYLES,
  isPipelineStatus,
  type PipelineStatus,
} from '@/lib/dashboard/pipelineStatus'
import {
  BoardViewIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ExportIcon,
  FilterIcon,
  ListViewIcon,
  PlusIcon,
  RefreshIcon,
  SendIcon,
  UsersIcon,
  YearViewIcon,
} from '@/components/ui/icons'

function timeOfDayGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function liveDateSubtitle(summary: DashboardSummary | null): string {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (!summary) return dateStr
  return `${dateStr} · Tax year ${summary.currentTaxYear}, ${summary.currentQuarter}`
}

const QDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    filed: B.green,
    ready: B.primary,
    pending: B.light,
    overdue: B.red,
    'N/A': '#E2E8F0',
  }
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        background: colors[status] || B.light,
        border: status === 'overdue' ? '1.5px solid #FECACA' : 'none',
      }}
      title={status}
    />
  )
}

function pipelineOf(c: DashboardClientRow): PipelineStatus {
  if (c.pipelineStatus && isPipelineStatus(c.pipelineStatus)) return c.pipelineStatus
  if (c.status && isPipelineStatus(c.status)) return c.status
  if (c.stage && isPipelineStatus(c.stage)) return c.stage
  return 'not-started'
}

const PipelineBadge = ({ status }: { status: string }) => {
  const key: PipelineStatus = isPipelineStatus(status) ? status : 'not-started'
  const s = PIPELINE_STATUS_STYLES[key]
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: '3px 11px',
        borderRadius: 20,
        background: s.bg,
        color: s.c,
        border: `1px solid ${s.b}`,
        whiteSpace: 'nowrap',
      }}
    >
      {PIPELINE_STATUS_LABELS[key]}
    </span>
  )
}

const MetricCard = ({
  label,
  value,
  sub,
  color,
  tint,
  icon,
  active,
  onClick,
}: {
  label: string
  value: number | string
  sub: string
  color: string
  tint: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    style={{
      flex: 1,
      minWidth: 0,
      background: B.white,
      borderRadius: 12,
      padding: '20px 20px 20px 18px',
      border: `1px solid ${active ? color : B.borderLight}`,
      boxShadow: active
        ? `${B.cardShadow}, 0 0 0 3px ${tint}`
        : '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.05)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
  >
    {/* Colour rail — the card's status accent */}
    <span
      aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }}
    />
    <span
      aria-hidden="true"
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: tint,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
    <span style={{ minWidth: 0 }}>
      <span
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: B.muted,
          marginBottom: 3,
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: 'block',
          fontSize: 27,
          fontWeight: 800,
          color: B.text,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span style={{ display: 'block', fontSize: 12, color: B.light, marginTop: 4 }}>{sub}</span>
    </span>
  </button>
)

/** Native select wrapped with a leading icon and a custom chevron. */
const FilterSelect = ({
  value,
  onChange,
  icon,
  children,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  icon: React.ReactNode
  children: React.ReactNode
  ariaLabel: string
}) => (
  <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 11,
        display: 'flex',
        color: B.light,
        pointerEvents: 'none',
      }}
    >
      {icon}
    </span>
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        padding: '8px 32px 8px 33px',
        borderRadius: 8,
        border: `1px solid ${B.borderLight}`,
        fontSize: 13,
        fontWeight: 500,
        color: B.text,
        background: B.white,
        cursor: 'pointer',
        fontFamily: 'inherit',
        minWidth: 132,
      }}
    >
      {children}
    </select>
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 10,
        display: 'flex',
        color: B.light,
        pointerEvents: 'none',
      }}
    >
      <ChevronDownIcon />
    </span>
  </span>
)

export default function Dashboard({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const router = useRouter()
  const [view, setView] = useState('list')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [quarterFilter, setQuarterFilter] = useState('all')
  const [activeMetric, setActiveMetric] = useState<string | null>(null)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const { user } = useCurrentUser()
  const greetingName = firstName(user?.name) || 'there'

  const loadSummary = useCallback(async () => {
    try {
      const data = await dashboardService.getSummary()
      setSummary(data)
    } catch {
      // keep summary null — component renders with empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  const clients: DashboardClientRow[] = summary?.clients ?? []

  const handleMetricClick = (filterKey: string) => {
    if (activeMetric === filterKey) {
      setActiveMetric(null)
      setStatusFilter('all')
    } else {
      setActiveMetric(filterKey)
      setStatusFilter(filterKey)
    }
  }

  const filtered = clients.filter((c) => {
    const pipeline = pipelineOf(c)
    if (statusFilter !== 'all' && pipeline !== statusFilter) return false
    if (quarterFilter !== 'all') {
      const qStatus = c[quarterFilter.toLowerCase() as 'q1' | 'q2' | 'q3' | 'q4']
      if (qStatus === 'N/A') return false
    }
    if (!matchesTypeFilter(c.type, typeFilter)) return false
    return true
  })

  const pendingInvites = summary?.metrics.pendingInvites ?? 0
  const notStartedCount = summary?.metrics.notStarted ?? 0
  const chasedCount = summary?.metrics.chased ?? 0
  const submittedCount = summary?.metrics.submitted ?? 0

  const goToClient = (id: string) => router.push(`/clients/detail?id=${id}`)

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header — sits directly on the page surface, no separate bar */}
      <div
        style={{
          padding: '22px 24px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: B.text,
            }}
          >
            {timeOfDayGreeting()}, {greetingName}
          </h1>
          <div style={{ fontSize: 14, color: B.muted, marginTop: 5 }}>
            {liveDateSubtitle(summary)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => navigate('add-client')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 8,
              border: `1px solid ${B.borderLight}`,
              background: B.white,
              boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
              fontSize: 13.5,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              color: B.text,
            }}
          >
            <PlusIcon />
            Add client
          </button>
          <button
            onClick={() => navigate('chase')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 8,
              border: 'none',
              background: B.primary,
              boxShadow: '0 1px 2px rgba(14,165,201,0.28)',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <SendIcon size={15} />
            Chase all overdue
          </button>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px', flex: 1 }}>
        {/* Metric cards — pipeline counts (same vocabulary as list / kanban / year) */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          <MetricCard
            label="Pending invites"
            value={loading ? '...' : pendingInvites}
            sub="Awaiting HMRC authorisation"
            color={B.purple}
            tint="#EDE9FE"
            icon={<RefreshIcon />}
            active={activeMetric === 'pending-invite'}
            onClick={() => handleMetricClick('pending-invite')}
          />
          <MetricCard
            label="Not started"
            value={loading ? '...' : notStartedCount}
            sub="Authorised, not chased yet"
            color={B.light}
            tint="#F1F5F9"
            icon={<UsersIcon size={20} />}
            active={activeMetric === 'not-started'}
            onClick={() => handleMetricClick('not-started')}
          />
          <MetricCard
            label="Chased"
            value={loading ? '...' : chasedCount}
            sub="Chase sent this quarter"
            color={B.amber}
            tint="#FEF3C7"
            icon={<SendIcon size={20} />}
            active={activeMetric === 'chased'}
            onClick={() => handleMetricClick('chased')}
          />
          <MetricCard
            label="Submitted"
            value={loading ? '...' : submittedCount}
            sub="Filed to HMRC this quarter"
            color={B.green}
            tint="#D1FAE5"
            icon={<CheckIcon />}
            active={activeMetric === 'submitted'}
            onClick={() => handleMetricClick('submitted')}
          />
        </div>

        {/* Controls bar */}
        <div
          style={{
            background: B.white,
            borderRadius: '12px 12px 0 0',
            border: `1px solid ${B.borderLight}`,
            boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
            borderBottom: 'none',
            padding: '13px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 9, alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterSelect
              ariaLabel="Filter by status"
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v)
                setActiveMetric(null)
              }}
              icon={<FilterIcon />}
            >
              <option value="all">All statuses</option>
              <option value="pending-invite">Pending invite</option>
              <option value="not-started">Not started</option>
              <option value="chased">Chased</option>
              <option value="records-received">Records received</option>
              <option value="ready-for-review">Ready for review</option>
              <option value="submitted">Submitted</option>
            </FilterSelect>
            <FilterSelect
              ariaLabel="Filter by income type"
              value={typeFilter}
              onChange={setTypeFilter}
              icon={<FilterIcon />}
            >
              <option value="all">All types</option>
              <option value="SE">Self-employment</option>
              <option value="Prop">UK Property</option>
              <option value="both">Both income types</option>
            </FilterSelect>
            {view === 'list' && (
              <FilterSelect
                ariaLabel="Filter by quarter"
                value={quarterFilter}
                onChange={setQuarterFilter}
                icon={<CalendarIcon />}
              >
                <option value="all">All quarters</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </FilterSelect>
            )}
            <span style={{ fontSize: 13, color: B.light, marginLeft: 4 }}>
              {loading ? 'Loading...' : `${filtered.length} of ${clients.length}`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 8,
                border: `1px solid ${B.borderLight}`,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                background: B.white,
                color: B.muted,
              }}
            >
              <ExportIcon />
              Export
            </button>
            <div style={{ display: 'flex' }}>
              {[
                { k: 'list', label: 'List view', Icon: ListViewIcon },
                { k: 'kanban', label: 'Kanban view', Icon: BoardViewIcon },
                { k: 'year', label: 'Year view', Icon: YearViewIcon },
              ].map((v, i, arr) => {
                const isActive = view === v.k
                return (
                  <button
                    key={v.k}
                    onClick={() => {
                      setView(v.k)
                      if (v.k !== 'list') setQuarterFilter('all')
                    }}
                    aria-pressed={isActive}
                    title={v.label}
                    aria-label={v.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 34,
                      padding: 0,
                      border: `1px solid ${isActive ? B.sidebarBg : B.borderLight}`,
                      cursor: 'pointer',
                      background: isActive ? B.sidebarBg : B.white,
                      color: isActive ? '#fff' : B.light,
                      borderRadius:
                        i === 0 ? '8px 0 0 8px' : i === arr.length - 1 ? '0 8px 8px 0' : 0,
                      marginLeft: i === 0 ? 0 : -1,
                      position: 'relative',
                      zIndex: isActive ? 1 : 0,
                    }}
                  >
                    <v.Icon />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <div
            style={{
              background: B.white,
              borderRadius: '0 0 12px 12px',
              border: `1px solid ${B.borderLight}`,
              boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.05)',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: B.muted }}>
                Loading clients...
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${B.borderLight}`, background: B.white }}>
                    {['Client', 'Type', 'Quarter', 'Deadline', 'Status', 'Last chase', ''].map(
                      (h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: '13px 16px',
                            textAlign: 'left',
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: B.light,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '44px 16px 52px' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                          }}
                        >
                          <EmptyStateIllustration />
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: B.text,
                              marginTop: 10,
                            }}
                          >
                            No clients match the current filter.
                          </div>
                          <div style={{ fontSize: 13.5, color: B.muted, marginTop: 6 }}>
                            Try adjusting your filters or add a new client to get started.
                          </div>
                          <button
                            onClick={() => navigate('add-client')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                              marginTop: 18,
                              padding: '10px 18px',
                              borderRadius: 8,
                              border: 'none',
                              background: B.primary,
                              boxShadow: '0 1px 2px rgba(14,165,201,0.28)',
                              color: '#fff',
                              fontSize: 13.5,
                              fontWeight: 600,
                              fontFamily: 'inherit',
                              cursor: 'pointer',
                            }}
                          >
                            <PlusIcon />
                            Add your first client
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c, i) => (
                      <tr
                        key={c.id}
                        onClick={() => goToClient(c.id)}
                        style={{
                          borderBottom: `1px solid ${B.borderLight}`,
                          cursor: 'pointer',
                          background: i % 2 === 1 ? '#FAFBFC' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <TypePills types={c.type} compact />
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          {c.authorisedAt ? c.quarter : 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div>{c.deadline}</div>
                          {c.daysLeft < 0 && (
                            <div style={{ fontSize: 12, color: B.red, fontWeight: 600 }}>
                              {Math.abs(c.daysLeft)}d overdue
                            </div>
                          )}
                          {c.daysLeft > 0 && (
                            <div style={{ fontSize: 12, color: B.light }}>{c.daysLeft}d left</div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <PipelineBadge status={pipelineOf(c)} />
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: B.muted, fontSize: 13 }}>{c.chase}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {pipelineOf(c) === 'pending-invite' && (
                            <button
                              style={{
                                padding: '5px 14px',
                                borderRadius: 6,
                                border: `1px solid ${B.border}`,
                                background: 'transparent',
                                color: B.muted,
                                fontSize: 12,
                                cursor: 'pointer',
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                goToClient(c.id)
                              }}
                            >
                              Resend
                            </button>
                          )}
                          {(pipelineOf(c) === 'not-started' || pipelineOf(c) === 'chased') && (
                            <button
                              style={{
                                padding: '5px 14px',
                                borderRadius: 6,
                                border: 'none',
                                background: pipelineOf(c) === 'not-started' ? B.primary : B.navy,
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate('chase')
                              }}
                            >
                              {pipelineOf(c) === 'chased' ? 'Chase again' : 'Chase'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* KANBAN VIEW — same pipeline columns as Status badges */}
        {view === 'kanban' && (
          <div
            style={{
              overflowX: 'auto',
              background: B.white,
              borderRadius: '0 0 12px 12px',
              border: `1px solid ${B.border}`,
              boxShadow: B.cardShadow,
              padding: 16,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(160px, 1fr))',
                gap: 12,
                minWidth: 1040,
              }}
            >
              {PIPELINE_KANBAN_COLS.map((col) => {
                const colClients = filtered.filter((c) => pipelineOf(c) === col.key)
                return (
                  <div
                    key={col.key}
                    style={{ background: col.bg, borderRadius: 10, padding: 10, minHeight: 280 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        padding: '0 4px',
                        gap: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            background: col.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 12, fontWeight: 600, color: B.text }}>
                          {col.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: B.muted,
                          background: B.white,
                          borderRadius: 10,
                          padding: '2px 9px',
                          border: `1px solid ${B.border}`,
                          flexShrink: 0,
                        }}
                      >
                        {colClients.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {colClients.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => goToClient(c.id)}
                          style={{
                            background: B.white,
                            borderRadius: 8,
                            padding: '12px 14px',
                            border: `1px solid ${B.border}`,
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: 6,
                              gap: 6,
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>
                              {c.name}
                            </div>
                            <PipelineBadge status={pipelineOf(c)} />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: B.light, marginRight: 2 }}>
                                Q1-4:
                              </span>
                              <QDot status={c.q1} />
                              <QDot status={c.q2} />
                              <QDot status={c.q3} />
                              <QDot status={c.q4} />
                            </div>
                            {c.daysLeft < 0 && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: B.red }}>
                                {Math.abs(c.daysLeft)}d late
                              </span>
                            )}
                            {c.daysLeft > 0 && (
                              <span style={{ fontSize: 11, color: B.light }}>
                                {c.daysLeft}d left
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* YEAR VIEW */}
        {view === 'year' && (
          <div
            style={{
              background: B.white,
              borderRadius: '0 0 12px 12px',
              border: `1px solid ${B.border}`,
              boxShadow: B.cardShadow,
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                  {['Client', 'Q1', 'Q2', 'Q3', 'Q4', 'Final dec.', 'Overall'].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '11px 16px',
                        textAlign: i >= 1 ? 'center' : 'left',
                        fontSize: 12,
                        fontWeight: 700,
                        color: B.muted,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                    const qs = [c.q1, c.q2, c.q3, c.q4]
                    return (
                      <tr
                        key={c.id}
                        onClick={() => goToClient(c.id)}
                        style={{
                          borderBottom: `1px solid ${B.borderLight}`,
                          background: i % 2 === 1 ? '#FAFBFC' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.name}</td>
                        {qs.map((q, qi) => (
                          <td key={qi} style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                background:
                                  q === 'filed'
                                    ? B.greenBg
                                    : q === 'overdue'
                                      ? B.redBg
                                      : q === 'ready'
                                        ? `${B.primary}18`
                                        : q === 'N/A'
                                          ? B.surface
                                          : B.surface,
                                border: `1px solid ${q === 'filed' ? '#A7F3D0' : q === 'overdue' ? '#FECACA' : q === 'ready' ? '#BAE6FD' : B.borderLight}`,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color:
                                    q === 'filed'
                                      ? B.greenText
                                      : q === 'overdue'
                                        ? B.redText
                                        : q === 'ready'
                                          ? B.primary
                                          : B.light,
                                }}
                              >
                                {q === 'filed'
                                  ? '✓'
                                  : q === 'overdue'
                                    ? '!'
                                    : q === 'ready'
                                      ? '●'
                                      : q === 'N/A'
                                        ? '–'
                                        : '○'}
                              </span>
                            </div>
                          </td>
                        ))}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: 14,
                              background: B.surface,
                              border: `1px solid ${B.borderLight}`,
                            }}
                          >
                            <span style={{ fontSize: 11, color: B.light }}>○</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <PipelineBadge status={pipelineOf(c)} />
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            <div
              style={{
                padding: '10px 20px',
                borderTop: `1px solid ${B.border}`,
                display: 'flex',
                gap: 16,
                fontSize: 12,
                color: B.muted,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: B.green }} />{' '}
                Submitted (Q cell)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: B.primary }} />{' '}
                In progress
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: B.light }} />{' '}
                Pending
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: B.red }} />{' '}
                Overdue
              </span>
              <span style={{ color: B.muted }}>Overall = pipeline status</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
