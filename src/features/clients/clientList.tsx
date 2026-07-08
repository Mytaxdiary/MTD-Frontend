'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientsService, type ClientRecord } from '@/services/clients.service'
import TypePills from '@/components/common/typePills'
import B from '@/styles/theme'
import {
  downloadCsv,
  printPdf,
  type ColKeys,
  type ClientListRow,
} from '@/features/clients/clientListExport'

function apiErrorMessage(err: unknown): string {
  const msg = (err as { message?: string })?.message
  return msg ?? 'Something went wrong.'
}

function mapToRow(c: ClientRecord): ClientListRow {
  const statusMap: Record<string, string> = {
    pending: 'pending',
    'partial-auth': 'partial-auth',
    accepted: 'filed',
    rejected: 'rejected',
    expired: 'expired',
    cancelled: 'expired',
    deauthorised: 'expired',
  }
  const needsResend =
    (c.invitationStatus === 'pending' && !c.invitationId) ||
    ['expired', 'rejected', 'cancelled', 'deauthorised'].includes(c.invitationStatus)
  return {
    id: c.id,
    name: c.name,
    business: c.nino,
    type: [] as string[],
    mtd:
      c.authorisedAt
        ? 'Mandated'
        : c.invitationStatus === 'accepted'
          ? 'Invite accepted'
          : c.invitationStatus === 'partial-auth'
            ? 'Partial auth'
            : 'Pending',
    deadline: 'N/A',
    filing: c.authorisedAt
      ? 'filed'
      : c.invitationStatus === 'accepted'
        ? 'invite-accepted'
        : statusMap[c.invitationStatus] ?? c.invitationStatus,
    chase: needsResend ? 'resend' : '',
    agentType: c.agentType,
    income: 0,
    needsResend,
  }
}

const Badge = ({ status }: { status: string }) => {
  const m: Record<string, { bg: string; c: string; b: string; l: string }> = {
    overdue: { bg: B.redBg, c: B.redText, b: '#FECACA', l: 'Overdue' },
    'due-soon': { bg: B.amberBg, c: B.amberText, b: '#FDE68A', l: 'Due soon' },
    ready: { bg: B.greenBg, c: B.greenText, b: '#A7F3D0', l: 'Records ready' },
    filed: { bg: B.greenBg, c: B.greenText, b: '#A7F3D0', l: 'Authorised' },
    pending: { bg: B.purpleBg, c: B.purpleText, b: '#DDD6FE', l: 'Pending invite' },
    'invite-accepted': { bg: B.amberBg, c: B.amberText, b: '#FDE68A', l: 'Invite accepted' },
    'partial-auth': { bg: B.amberBg, c: B.amberText, b: '#FDE68A', l: 'Partial auth' },
    rejected: { bg: B.redBg, c: B.redText, b: '#FECACA', l: 'Rejected' },
    expired: { bg: B.surface, c: B.muted, b: B.border, l: 'Expired' },
  }
  const s =
    m[status] ??
    ({
      bg: B.surface,
      c: B.text,
      b: B.border,
      l: status
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    } as const)
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
      {s.l}
    </span>
  )
}

// ColKeys and export helpers live in clientListExport.ts
const defaultCols: Record<ColKeys, boolean> = {
  type: true,
  mtd: true,
  deadline: true,
  filing: true,
  chase: true,
  income: false,
}

const PAGE_SIZE = 20

export default function ClientList({
  navigate = () => {},
}: {
  navigate?: (route: string) => void
}) {
  const router = useRouter()

  // Server-driven state
  const [clients, setClients]       = useState<ReturnType<typeof mapToRow>[]>([])
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]             = useState(1)
  const [clientsLoading, setClientsLoading] = useState(true)

  // Filter / sort state
  const [search, setSearch]           = useState('')
  const [searchInput, setSearchInput] = useState('')   // controlled input before debounce
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortCol, setSortCol]         = useState('name')
  const [sortDir, setSortDir]         = useState('asc')

  // UI state
  const [selected, setSelected]       = useState(new Set<string>())
  const [cols, setCols]               = useState<Record<ColKeys, boolean>>(defaultCols)
  const [showColPicker, setShowColPicker] = useState(false)
  const [resendingId, setResendingId] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadPage = useCallback(
    (p: number, status: string, q: string) => {
      setClientsLoading(true)
      clientsService
        .list({ page: p, limit: PAGE_SIZE, status: status !== 'all' ? status : undefined, search: q || undefined })
        .then((res) => {
          setClients(res.clients.map(mapToRow))
          setTotal(res.total)
          setTotalPages(res.totalPages)
          setPage(res.page)
          setSelected(new Set())
        })
        .catch(() => {
          setClients([])
          setTotal(0)
          setTotalPages(1)
        })
        .finally(() => setClientsLoading(false))
    },
    [],
  )

  // Initial load
  useEffect(() => { loadPage(1, 'all', '') }, [loadPage])

  // When status filter changes → reset to page 1
  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    loadPage(1, val, search)
  }

  // Debounce search input → trigger server fetch
  const handleSearchInput = (val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(val)
      loadPage(1, statusFilter, val)
    }, 400)
  }

  const reloadCurrent = () => loadPage(page, statusFilter, search)

  async function handleResend(clientId: string, e: { stopPropagation: () => void }) {
    e.stopPropagation()
    setResendingId(clientId)
    try {
      await clientsService.resendInvitation(clientId)
      reloadCurrent()
    } catch (err: unknown) {
      alert(apiErrorMessage(err))
    } finally {
      setResendingId(null)
    }
  }

  // ── Client-side sort within current page ─────────────────────────────────

  const filtered = [...clients].sort((a, b) => {
    const va = (a as Record<string, unknown>)[sortCol]
    const vb = (b as Record<string, unknown>)[sortCol]
    const sa = Array.isArray(va) ? va.join(',').toLowerCase() : typeof va === 'string' ? va.toLowerCase() : va
    const sb = Array.isArray(vb) ? vb.join(',').toLowerCase() : typeof vb === 'string' ? vb.toLowerCase() : vb
    if (sa! < sb!) return sortDir === 'asc' ? -1 : 1
    if (sa! > sb!) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('asc') }
  }
  const toggleSelect = (id: string) =>
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () =>
    setSelected((p) => p.size === filtered.length ? new Set<string>() : new Set(filtered.map((c) => c.id)))
  const SortIcon = ({ col }: { col: string }) => (
    <span style={{ fontSize: 10, marginLeft: 4, opacity: sortCol === col ? 1 : 0.3 }}>
      {sortCol === col && sortDir === 'desc' ? '▼' : '▲'}
    </span>
  )

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px 32px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Clients</div>
          <div style={{ fontSize: 14, color: B.muted, marginTop: 3 }}>
            {clientsLoading
              ? 'Loading...'
              : `${total} client${total !== 1 ? 's' : ''} · Page ${page} of ${totalPages}`}
          </div>
        </div>
        <button
          onClick={() => navigate('add-client')}
          style={{
            padding: '9px 18px',
            borderRadius: 8,
            border: 'none',
            background: B.primary,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add client
        </button>
      </div>

      <div style={{ padding: '20px 32px', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
            <input
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search clients..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 14,
                outline: 'none',
                background: B.white,
                color: B.text,
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                color: B.light,
              }}
            >
              ⌕
            </span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{
              padding: '8px 11px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13,
              color: B.text,
              background: B.white,
              cursor: 'pointer',
            }}
          >
            <option value="all">All statuses</option>
            <option value="filed">Authorised</option>
            <option value="pending">Pending invite</option>
            <option value="invite-accepted">Invite accepted</option>
            <option value="partial-auth">Partial auth</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired / cancelled</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            {selected.size > 0 && (
              <>
                <span style={{ fontSize: 13, color: B.muted }}>{selected.size} selected</span>
                <button
                  style={{
                    padding: '7px 14px',
                    borderRadius: 7,
                    border: 'none',
                    background: B.navy,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Chase selected
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 7,
                    border: `1px solid ${B.border}`,
                    background: 'transparent',
                    fontSize: 12,
                    cursor: 'pointer',
                    color: B.muted,
                  }}
                >
                  Clear
                </button>
              </>
            )}
            <button
              onClick={() => downloadCsv(filtered, cols)}
              style={{
                padding: '7px 12px',
                borderRadius: 7,
                border: `1px solid ${B.border}`,
                fontSize: 12,
                cursor: 'pointer',
                background: B.white,
                color: B.muted,
              }}
            >
              Export CSV
            </button>
            <button
              onClick={() => printPdf(filtered, cols)}
              style={{
                padding: '7px 12px',
                borderRadius: 7,
                border: `1px solid ${B.border}`,
                fontSize: 12,
                cursor: 'pointer',
                background: B.white,
                color: B.muted,
              }}
            >
              Export PDF
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowColPicker(!showColPicker)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 7,
                  border: `1px solid ${showColPicker ? B.primary : B.border}`,
                  fontSize: 12,
                  cursor: 'pointer',
                  background: showColPicker ? B.blueBg : B.white,
                  color: showColPicker ? B.blueText : B.muted,
                }}
              >
                Columns ▾
              </button>
              {showColPicker && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: 4,
                    background: B.white,
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    padding: '8px 0',
                    zIndex: 10,
                    width: 180,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  {(
                    [
                      ['type', 'Business type'],
                      ['mtd', 'MTD status'],
                      ['deadline', 'Next deadline'],
                      ['filing', 'Filing status'],
                      ['chase', 'Chase status'],
                      ['income', 'YTD income'],
                    ] as [ColKeys, string][]
                  ).map(([k, l]) => (
                    <label
                      key={k}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 14px',
                        fontSize: 13,
                        cursor: 'pointer',
                        color: B.text,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={cols[k]}
                        onChange={() => setCols({ ...cols, [k]: !cols[k] })}
                        style={{ accentColor: B.primary }}
                      />
                      {l}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: B.white,
            borderRadius: 12,
            border: `1px solid ${B.border}`,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${B.border}`, background: B.surface }}>
                <th style={{ padding: '11px 16px', width: 36 }}>
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    style={{ cursor: 'pointer', accentColor: B.primary }}
                  />
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  style={{
                    padding: '11px 14px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 700,
                    color: B.muted,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    cursor: 'pointer',
                  }}
                >
                  Client
                  <SortIcon col="name" />
                </th>
                {cols.type && (
                  <th
                    onClick={() => toggleSort('type')}
                    style={{
                      padding: '11px 14px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase' as const,
                      cursor: 'pointer',
                    }}
                  >
                    Type
                    <SortIcon col="type" />
                  </th>
                )}
                {cols.mtd && (
                  <th
                    style={{
                      padding: '11px 14px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    MTD
                  </th>
                )}
                {cols.deadline && (
                  <th
                    onClick={() => toggleSort('deadline')}
                    style={{
                      padding: '11px 14px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase' as const,
                      cursor: 'pointer',
                    }}
                  >
                    Deadline
                    <SortIcon col="deadline" />
                  </th>
                )}
                {cols.filing && (
                  <th
                    style={{
                      padding: '11px 14px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    Status
                  </th>
                )}
                {cols.chase && (
                  <th
                    style={{
                      padding: '11px 14px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    Chase
                  </th>
                )}
                {cols.income && (
                  <th
                    onClick={() => toggleSort('income')}
                    style={{
                      padding: '11px 14px',
                      textAlign: 'right',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase' as const,
                      cursor: 'pointer',
                    }}
                  >
                    YTD income
                    <SortIcon col="income" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {clientsLoading && (
                <tr>
                  <td colSpan={10} style={{ padding: '28px', textAlign: 'center', fontSize: 14, color: B.muted }}>
                    Loading clients...
                  </td>
                </tr>
              )}
              {!clientsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '28px', textAlign: 'center', fontSize: 14, color: B.light }}>
                    No clients yet. Click &ldquo;+ Add client&rdquo; to invite your first client.
                  </td>
                </tr>
              )}
              {!clientsLoading && filtered.map((c, i) => (
                <tr
                  key={String(c.id)}
                  onClick={() => router.push(`/clients/detail?id=${c.id}`)}
                  style={{
                    borderBottom: `1px solid ${B.borderLight}`,
                    background: selected.has(c.id)
                      ? '#F0F9FF'
                      : i % 2 === 1
                        ? '#FAFBFC'
                        : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '11px 16px' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer', accentColor: B.primary }}
                    />
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: B.light, marginTop: 2 }}>{c.business}</div>
                  </td>
                  {cols.type && (
                    <td style={{ padding: '11px 14px' }}>
                      {c.type.length > 0 ? <TypePills types={c.type} /> : null}
                    </td>
                  )}
                  {cols.mtd && (
                    <td style={{ padding: '11px 14px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 20,
                          background: c.mtd === 'Mandated' ? B.greenBg : B.blueBg,
                          color: c.mtd === 'Mandated' ? B.greenText : B.blueText,
                          border: `1px solid ${c.mtd === 'Mandated' ? '#A7F3D0' : '#BAE6FD'}`,
                        }}
                      >
                        {c.mtd}
                      </span>
                    </td>
                  )}
                  {cols.deadline && (
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>{c.deadline}</td>
                  )}
                  {cols.filing && (
                    <td style={{ padding: '11px 14px' }}>
                      <Badge status={c.filing} />
                    </td>
                  )}
                  {cols.chase && (
                    <td style={{ padding: '11px 14px' }} onClick={(e) => e.stopPropagation()}>
                      {c.needsResend ? (
                        <button
                          type="button"
                          disabled={resendingId === c.id}
                          onClick={(e) => handleResend(c.id, e)}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '5px 12px',
                            borderRadius: 7,
                            border: `1px solid ${B.primary}`,
                            background: B.blueBg,
                            color: B.blueText,
                            cursor: resendingId === c.id ? 'not-allowed' : 'pointer',
                            opacity: resendingId === c.id ? 0.6 : 1,
                          }}
                        >
                          {resendingId === c.id ? 'Sending...' : 'Resend invite'}
                        </button>
                      ) : (
                        <span style={{ fontSize: 13, color: B.muted }}>No action</span>
                      )}
                    </td>
                  )}
                  {cols.income && (
                    <td
                      style={{
                        padding: '11px 14px',
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      {c.income > 0 ? `£${c.income.toLocaleString()}` : ''}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              padding: '13px 20px',
              borderTop: `1px solid ${B.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 13,
              color: B.muted,
            }}
          >
            <span>
              {total === 0
                ? 'No clients'
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} client${total !== 1 ? 's' : ''}`}
            </span>
            {cols.income && (
              <span>
                Total YTD income:{' '}
                <b style={{ color: B.text }}>
                  £{filtered.reduce((s, c) => s + c.income, 0).toLocaleString()}
                </b>
              </span>
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div
              style={{
                padding: '10px 20px',
                borderTop: `1px solid ${B.borderLight}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <button
                onClick={() => loadPage(1, statusFilter, search)}
                disabled={page === 1 || clientsLoading}
                style={{
                  padding: '6px 11px', borderRadius: 7, border: `1px solid ${B.border}`,
                  background: B.white, fontSize: 12, cursor: page === 1 ? 'default' : 'pointer',
                  color: page === 1 ? B.light : B.text, opacity: page === 1 ? 0.5 : 1,
                }}
              >
                «
              </button>
              <button
                onClick={() => loadPage(page - 1, statusFilter, search)}
                disabled={page === 1 || clientsLoading}
                style={{
                  padding: '6px 11px', borderRadius: 7, border: `1px solid ${B.border}`,
                  background: B.white, fontSize: 12, cursor: page === 1 ? 'default' : 'pointer',
                  color: page === 1 ? B.light : B.text, opacity: page === 1 ? 0.5 : 1,
                }}
              >
                Prev
              </button>

              {/* Page number buttons — show up to 5 around current page */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === 'ellipsis' ? (
                    <span key={`e${i}`} style={{ fontSize: 12, color: B.light, padding: '0 4px' }}>...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => loadPage(p as number, statusFilter, search)}
                      disabled={clientsLoading}
                      style={{
                        padding: '5px 10px', borderRadius: 6,
                        border: `1px solid ${page === p ? B.primary : B.border}`,
                        background: page === p ? B.primary : B.white,
                        color: page === p ? '#fff' : B.text,
                        fontSize: 12, fontWeight: page === p ? 700 : 400,
                        cursor: 'pointer', minWidth: 34,
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => loadPage(page + 1, statusFilter, search)}
                disabled={page === totalPages || clientsLoading}
                style={{
                  padding: '6px 11px', borderRadius: 7, border: `1px solid ${B.border}`,
                  background: B.white, fontSize: 12,
                  cursor: page === totalPages ? 'default' : 'pointer',
                  color: page === totalPages ? B.light : B.text,
                  opacity: page === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
              <button
                onClick={() => loadPage(totalPages, statusFilter, search)}
                disabled={page === totalPages || clientsLoading}
                style={{
                  padding: '6px 11px', borderRadius: 7, border: `1px solid ${B.border}`,
                  background: B.white, fontSize: 12,
                  cursor: page === totalPages ? 'default' : 'pointer',
                  color: page === totalPages ? B.light : B.text,
                  opacity: page === totalPages ? 0.5 : 1,
                }}
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
