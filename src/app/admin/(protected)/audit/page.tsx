'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import {
  adminService,
  type AdminAuditAction,
  type AdminAuditLogItem,
  type AdminAuditLogListResponse,
} from '@/services/admin.service'

const ACTION_FILTERS: { value: '' | AdminAuditAction; label: string }[] = [
  { value: '', label: 'All actions' },
  { value: 'firm.activate', label: 'Firm activate' },
  { value: 'firm.deactivate', label: 'Firm deactivate' },
  { value: 'firm.deactivation_reason_update', label: 'Reason update' },
  { value: 'firm.invalidate_sessions', label: 'Firm force logout' },
  { value: 'user.invalidate_sessions', label: 'User force logout' },
  { value: 'enquiry.update', label: 'Enquiry update' },
]

const ACTION_LABELS: Record<AdminAuditAction, string> = {
  'firm.activate': 'Firm activate',
  'firm.deactivate': 'Firm deactivate',
  'firm.deactivation_reason_update': 'Reason update',
  'firm.invalidate_sessions': 'Firm force logout',
  'user.invalidate_sessions': 'User force logout',
  'enquiry.update': 'Enquiry update',
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function ActionPill({ action }: { action: AdminAuditAction }) {
  const tone =
    action.includes('deactivate') || action.includes('invalidate')
      ? { bg: B.amberBg, color: B.amberText }
      : action.includes('activate')
        ? { bg: B.greenBg, color: B.greenText }
        : { bg: B.blueBg, color: B.blueText }
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 999,
        background: tone.bg,
        color: tone.color,
        whiteSpace: 'nowrap',
      }}
    >
      {ACTION_LABELS[action]}
    </span>
  )
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [action, setAction] = useState<'' | AdminAuditAction>('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminAuditLogListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminService.listAuditLogs({
        page,
        limit: 20,
        search: query || undefined,
        action: action || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit log')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, query, action])

  useEffect(() => {
    void load()
  }, [load])

  const onSearchSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setPage(1)
    setQuery(search.trim())
  }

  const items: AdminAuditLogItem[] = data?.items ?? []

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
            Audit log
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
            Who activated or deactivated firms, force-logged users out, and updated enquiries.
          </p>
        </div>

        <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={action}
            onChange={(e) => {
              setPage(1)
              setAction(e.target.value as '' | AdminAuditAction)
            }}
            aria-label="Filter by action"
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13,
              background: B.white,
              color: B.text,
            }}
          >
            {ACTION_FILTERS.map((f) => (
              <option key={f.value || 'all'} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor, target, summary…"
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13,
              minWidth: 240,
              background: B.white,
              color: B.text,
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: 'none',
              background: B.primary,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 14,
            padding: '10px 14px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: B.white,
          borderRadius: 12,
          border: `1px solid ${B.borderLight}`,
          boxShadow: B.cardShadow,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: B.muted, fontSize: 14 }}>
            Loading audit log…
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: B.muted, fontSize: 14 }}>
            No audit entries yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.borderLight}`, background: B.surface }}>
                {['When', 'Admin', 'Action', 'Target', 'Summary'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: B.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                  <td style={{ padding: '13px 16px', color: B.muted, whiteSpace: 'nowrap' }}>
                    {formatDateTime(row.createdAt)}
                  </td>
                  <td style={{ padding: '13px 16px', color: B.text }}>
                    {row.actorEmail ?? '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <ActionPill action={row.action} />
                  </td>
                  <td style={{ padding: '13px 16px', color: B.text }}>
                    <div style={{ fontWeight: 600 }}>{row.targetLabel ?? row.targetId}</div>
                    <div style={{ fontSize: 12, color: B.light, textTransform: 'capitalize' }}>
                      {row.targetType}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', color: B.muted, maxWidth: 360 }}>
                    {row.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 14,
            fontSize: 13,
            color: B.muted,
          }}
        >
          <span>
            Page {data.page} of {data.totalPages} · {data.total} entries
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                cursor: page >= data.totalPages ? 'not-allowed' : 'pointer',
                opacity: page >= data.totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
