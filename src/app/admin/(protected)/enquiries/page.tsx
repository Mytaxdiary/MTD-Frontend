'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import B from '@/styles/theme'
import {
  adminService,
  type AdminEnquiryItem,
  type AdminEnquiryListResponse,
  type EnquiryStatus,
} from '@/services/admin.service'

const STATUS_FILTERS: { value: '' | EnquiryStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function StatusPill({ status }: { status: EnquiryStatus }) {
  const styles: Record<EnquiryStatus, { bg: string; color: string }> = {
    new: { bg: B.blueBg, color: B.blueText },
    contacted: { bg: B.amberBg, color: B.amberText },
    closed: { bg: B.greenBg, color: B.greenText },
  }
  const s = styles[status]
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}

export default function AdminEnquiriesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'' | EnquiryStatus>('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminEnquiryListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminService.listEnquiries({
        page,
        limit: 20,
        search: query || undefined,
        status: status || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, query, status])

  useEffect(() => {
    void load()
  }, [load])

  const onSearchSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setPage(1)
    setQuery(search.trim())
  }

  const items: AdminEnquiryItem[] = data?.items ?? []

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
            Enquiries
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
            Marketing contact form submissions.
          </p>
        </div>

        <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, firm, email"
            style={{
              width: 240,
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13.5,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              border: 'none',
              background: B.primaryBtn,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((f) => {
          const active = status === f.value
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                setStatus(f.value)
                setPage(1)
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                border: `1px solid ${active ? B.primaryBtn : B.border}`,
                background: active ? B.primaryBtn : B.white,
                color: active ? '#fff' : B.muted,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {error && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: B.white,
          border: `1px solid ${B.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: B.cardShadow,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: B.surface, textAlign: 'left' }}>
              {['Name', 'Firm', 'Email', 'Plan', 'Status', 'Received', ''].map((h) => (
                <th
                  key={h || 'actions'}
                  style={{
                    padding: '11px 14px',
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: B.muted,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${B.borderLight}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ padding: 24, color: B.muted }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24, color: B.muted }}>
                  No enquiries found.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: `1px solid ${B.borderLight}`, cursor: 'pointer' }}
                  onClick={() => router.push(`/admin/enquiries/${row.id}`)}
                >
                  <td style={{ padding: '13px 14px', fontWeight: 600, color: B.text }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '13px 14px', color: B.muted }}>{row.firm}</td>
                  <td style={{ padding: '13px 14px', color: B.muted }}>{row.email}</td>
                  <td style={{ padding: '13px 14px', color: B.light }}>
                    {row.planInterest ?? '—'}
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <StatusPill status={row.status} />
                  </td>
                  <td style={{ padding: '13px 14px', color: B.muted }}>
                    {formatDate(row.createdAt)}
                  </td>
                  <td style={{ padding: '13px 14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/enquiries/${row.id}`)
                      }}
                      style={{
                        border: `1px solid ${B.border}`,
                        background: B.white,
                        borderRadius: 7,
                        padding: '5px 10px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: B.link,
                        cursor: 'pointer',
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
            fontSize: 13,
            color: B.muted,
          }}
        >
          <span>
            Page {data.page} of {data.totalPages} · {data.total} enquiries
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
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
                padding: '6px 12px',
                borderRadius: 7,
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
