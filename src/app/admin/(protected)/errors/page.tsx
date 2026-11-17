'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import {
  adminService,
  type AdminErrorLogItem,
  type AdminErrorLogListResponse,
  type AdminErrorSource,
} from '@/services/admin.service'

const SOURCE_FILTERS: { value: '' | AdminErrorSource; label: string }[] = [
  { value: '', label: 'All sources' },
  { value: 'hmrc', label: 'HMRC' },
  { value: 'api', label: 'API' },
  { value: 'server', label: 'Server' },
]

const SOURCE_LABELS: Record<AdminErrorSource, string> = {
  hmrc: 'HMRC',
  api: 'API',
  server: 'Server',
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

function SourcePill({ source }: { source: AdminErrorSource }) {
  const tone =
    source === 'hmrc'
      ? { bg: B.amberBg, color: B.amberText }
      : source === 'server'
        ? { bg: B.redBg, color: B.redText }
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
      {SOURCE_LABELS[source]}
    </span>
  )
}

function StatusPill({ code }: { code: number | null }) {
  if (code == null) {
    return <span style={{ color: B.muted }}>-</span>
  }
  const bad = code >= 500
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 999,
        background: bad ? B.redBg : B.amberBg,
        color: bad ? B.redText : B.amberText,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {code}
    </span>
  )
}

export default function AdminErrorsPage() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [source, setSource] = useState<'' | AdminErrorSource>('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminErrorLogListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminService.listErrors({
        page,
        limit: 20,
        search: query || undefined,
        source: source || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load errors')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, query, source])

  useEffect(() => {
    void load()
  }, [load])

  const onSearchSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setPage(1)
    setQuery(search.trim())
  }

  const items: AdminErrorLogItem[] = data?.items ?? []

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
            Errors
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
            Failed HMRC calls and server errors: client, endpoint, status, and time in one list.
          </p>
        </div>

        <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={source}
            onChange={(e) => {
              setPage(1)
              setSource(e.target.value as '' | AdminErrorSource)
            }}
            aria-label="Filter by source"
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13,
              background: B.white,
              color: B.text,
            }}
          >
            {SOURCE_FILTERS.map((f) => (
              <option key={f.value || 'all'} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoint, message, client, firm…"
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13,
              minWidth: 260,
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
            Loading errors…
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: B.muted, fontSize: 14 }}>
            No errors logged yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.borderLight}`, background: B.surface }}>
                {['When', 'Source', 'Client / firm', 'Endpoint', 'Status', 'Message'].map((h) => (
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
                  <td style={{ padding: '13px 16px' }}>
                    <SourcePill source={row.source} />
                  </td>
                  <td style={{ padding: '13px 16px', color: B.text }}>
                    <div style={{ fontWeight: 600 }}>{row.clientLabel ?? '-'}</div>
                    <div style={{ fontSize: 12, color: B.light }}>
                      {row.tenantLabel ?? row.tenantId ?? '-'}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '13px 16px',
                      color: B.text,
                      maxWidth: 280,
                      wordBreak: 'break-all',
                    }}
                  >
                    <div style={{ fontSize: 12, color: B.light, marginBottom: 2 }}>
                      {row.httpMethod ?? '-'}
                    </div>
                    {row.endpoint}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <StatusPill code={row.statusCode} />
                  </td>
                  <td style={{ padding: '13px 16px', color: B.muted, maxWidth: 360 }}>
                    <span title={row.message}>
                      {row.message.length > 160 ? `${row.message.slice(0, 159)}…` : row.message}
                    </span>
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
            Page {data.page} of {data.totalPages} · {data.total} errors
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
