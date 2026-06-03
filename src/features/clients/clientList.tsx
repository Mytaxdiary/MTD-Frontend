'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientsService, type ClientRecord } from '@/services/clients.service'
import TypePills from '@/components/common/typePills'
import B from '@/styles/theme'

function apiErrorMessage(err: unknown): string {
  const msg = (err as { message?: string })?.message
  return msg ?? 'Something went wrong.'
}

function mapToRow(c: ClientRecord) {
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
    deadline: '—',
    filing: c.authorisedAt
      ? 'filed'
      : c.invitationStatus === 'accepted'
        ? 'invite-accepted'
        : statusMap[c.invitationStatus] ?? c.invitationStatus,
    chase: needsResend ? 'resend' : '—',
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
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 10px',
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

type ColKeys = 'type' | 'mtd' | 'deadline' | 'filing' | 'chase' | 'income'
const defaultCols: Record<ColKeys, boolean> = {
  type: true,
  mtd: true,
  deadline: true,
  filing: true,
  chase: true,
  income: false,
}

export default function ClientList({
  navigate = () => {},
}: {
  navigate?: (route: string) => void
}) {
  const router = useRouter()
  const [allClients, setAllClients] = useState<ReturnType<typeof mapToRow>[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortCol, setSortCol] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [selected, setSelected] = useState(new Set<string>())
  const [cols, setCols] = useState<Record<ColKeys, boolean>>(defaultCols)
  const [showColPicker, setShowColPicker] = useState(false)
  const [resendingId, setResendingId] = useState<string | null>(null)

  const reloadClients = () => {
    setClientsLoading(true)
    clientsService
      .list()
      .then((clients) => setAllClients(clients.map(mapToRow)))
      .catch(() => setAllClients([]))
      .finally(() => setClientsLoading(false))
  }

  useEffect(() => {
    reloadClients()
  }, [])

  async function handleResend(clientId: string, e: { stopPropagation: () => void }) {
    e.stopPropagation()
    setResendingId(clientId)
    try {
      await clientsService.resendInvitation(clientId)
      reloadClients()
    } catch (err: unknown) {
      alert(apiErrorMessage(err))
    } finally {
      setResendingId(null)
    }
  }

  let filtered = allClients.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.business.toLowerCase().includes(search.toLowerCase()))
      return false
    if (statusFilter !== 'all' && c.filing !== statusFilter) return false
    return true
  })
  filtered = [...filtered].sort((a, b) => {
    const va = (a as Record<string, unknown>)[sortCol]
    const vb = (b as Record<string, unknown>)[sortCol]
    const sa = Array.isArray(va)
      ? va.join(',').toLowerCase()
      : typeof va === 'string'
        ? va.toLowerCase()
        : va
    const sb = Array.isArray(vb)
      ? vb.join(',').toLowerCase()
      : typeof vb === 'string'
        ? vb.toLowerCase()
        : vb
    if (sa! < sb!) return sortDir === 'asc' ? -1 : 1
    if (sa! > sb!) return sortDir === 'asc' ? 1 : -1
    return 0
  })
  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortCol(col)
      setSortDir('asc')
    }
  }
  const toggleSelect = (id: string) =>
    setSelected((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const toggleAll = () =>
    setSelected((p) =>
      p.size === filtered.length ? new Set<string>() : new Set(filtered.map((c) => c.id))
    )
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
          <div style={{ fontSize: 20, fontWeight: 700 }}>Clients</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>
            {clientsLoading
              ? 'Loading…'
              : `${allClients.length} clients — ${allClients.filter((c) => c.filing === 'filed').length} authorised, ${allClients.filter((c) => c.filing === 'pending').length} pending`}
          </div>
        </div>
        <button
          onClick={() => navigate('add-client')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: B.primary,
            color: '#fff',
            fontSize: 13,
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              style={{
                width: '100%',
                padding: '8px 14px 8px 34px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 13,
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
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 12,
              color: B.text,
              background: B.white,
              cursor: 'pointer',
            }}
          >
            <option value="all">All statuses</option>
            <option value="overdue">Overdue</option>
            <option value="due-soon">Due soon</option>
            <option value="ready">Records ready</option>
            <option value="filed">Submitted</option>
            <option value="pending">Pending invite</option>
            <option value="partial-auth">Partial auth</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            {selected.size > 0 && (
              <>
                <span style={{ fontSize: 12, color: B.muted }}>{selected.size} selected</span>
                <button
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    background: B.navy,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Chase selected
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: `1px solid ${B.border}`,
                    background: 'transparent',
                    fontSize: 11,
                    cursor: 'pointer',
                    color: B.muted,
                  }}
                >
                  Clear
                </button>
              </>
            )}
            <button
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${B.border}`,
                fontSize: 11,
                cursor: 'pointer',
                background: B.white,
                color: B.muted,
              }}
            >
              Export CSV
            </button>
            <button
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${B.border}`,
                fontSize: 11,
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
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: `1px solid ${showColPicker ? B.primary : B.border}`,
                  fontSize: 11,
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
                        padding: '6px 14px',
                        fontSize: 12,
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                <th style={{ padding: '10px 16px', width: 36 }}>
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
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    color: B.light,
                    letterSpacing: '0.04em',
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
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
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
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
                    }}
                  >
                    MTD
                  </th>
                )}
                {cols.deadline && (
                  <th
                    onClick={() => toggleSort('deadline')}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
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
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
                    }}
                  >
                    Status
                  </th>
                )}
                {cols.chase && (
                  <th
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
                    }}
                  >
                    Chase
                  </th>
                )}
                {cols.income && (
                  <th
                    onClick={() => toggleSort('income')}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'right',
                      fontSize: 11,
                      fontWeight: 600,
                      color: B.light,
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
                  <td colSpan={10} style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: B.muted }}>
                    Loading clients…
                  </td>
                </tr>
              )}
              {!clientsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: B.light }}>
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
                  <td style={{ padding: '10px 16px' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer', accentColor: B.primary }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: B.light, marginTop: 1 }}>{c.business}</div>
                  </td>
                  {cols.type && (
                    <td style={{ padding: '10px 14px' }}>
                      {c.type.length > 0 ? <TypePills types={c.type} /> : <span style={{ fontSize: 12, color: B.light }}>—</span>}
                    </td>
                  )}
                  {cols.mtd && (
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 9px',
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
                    <td style={{ padding: '10px 14px', fontSize: 12 }}>{c.deadline}</td>
                  )}
                  {cols.filing && (
                    <td style={{ padding: '10px 14px' }}>
                      <Badge status={c.filing} />
                    </td>
                  )}
                  {cols.chase && (
                    <td style={{ padding: '10px 14px' }} onClick={(e) => e.stopPropagation()}>
                      {c.needsResend ? (
                        <button
                          type="button"
                          disabled={resendingId === c.id}
                          onClick={(e) => handleResend(c.id, e)}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: `1px solid ${B.primary}`,
                            background: B.blueBg,
                            color: B.blueText,
                            cursor: resendingId === c.id ? 'not-allowed' : 'pointer',
                            opacity: resendingId === c.id ? 0.6 : 1,
                          }}
                        >
                          {resendingId === c.id ? 'Sending…' : 'Resend invite'}
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: B.muted }}>—</span>
                      )}
                    </td>
                  )}
                  {cols.income && (
                    <td
                      style={{
                        padding: '10px 14px',
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      {c.income > 0 ? `£${c.income.toLocaleString()}` : '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              padding: '12px 20px',
              borderTop: `1px solid ${B.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 12,
              color: B.muted,
            }}
          >
            <span>
              Showing {filtered.length} of {allClients.length} clients
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
        </div>
      </div>
    </div>
  )
}
