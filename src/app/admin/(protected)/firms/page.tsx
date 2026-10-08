'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import B from '@/styles/theme'
import {
  adminService,
  type AdminBillingStatus,
  type AdminFirmListItem,
  type AdminFirmListResponse,
} from '@/services/admin.service'

const BILLING_FILTERS: { value: '' | AdminBillingStatus; label: string }[] = [
  { value: '', label: 'All billing' },
  { value: 'trial', label: 'Trial' },
  { value: 'active', label: 'Active' },
  { value: 'past_due', label: 'Past due' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

function billingLabel(status: string): string {
  switch (status) {
    case 'trial':
      return 'Trial'
    case 'active':
      return 'Active'
    case 'past_due':
      return 'Past due'
    case 'expired':
      return 'Expired'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

function BillingPill({ status }: { status: string }) {
  const tone =
    status === 'active'
      ? { bg: B.greenBg, color: B.greenText }
      : status === 'trial'
        ? { bg: B.blueBg, color: B.blueText }
        : status === 'past_due'
          ? { bg: B.amberBg, color: B.amberText }
          : { bg: B.redBg, color: B.redText }
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
      }}
    >
      {billingLabel(status)}
    </span>
  )
}

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

function StatusPill({ status }: { status: 'active' | 'inactive' }) {
  const active = status === 'active'
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 999,
        background: active ? B.greenBg : B.redBg,
        color: active ? B.greenText : B.redText,
      }}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

export default function AdminFirmsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [billingFilter, setBillingFilter] = useState<'' | AdminBillingStatus>('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminFirmListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminService.listFirms({
        page,
        limit: 20,
        search: query || undefined,
        billingStatus: billingFilter || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load firms')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, query, billingFilter])

  useEffect(() => {
    void load()
  }, [load])

  const onSearchSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setPage(1)
    setQuery(search.trim())
  }

  const items: AdminFirmListItem[] = data?.items ?? []

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
            Firms
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
            All registered accounting firms and agents.
          </p>
        </div>

        <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={billingFilter}
            onChange={(e) => {
              setPage(1)
              setBillingFilter(e.target.value as '' | AdminBillingStatus)
            }}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 13.5,
              background: B.white,
              color: B.text,
            }}
          >
            {BILLING_FILTERS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            style={{
              width: 260,
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
              {['Firm', 'Owner email', 'Created', 'Billing', 'Account', ''].map((h) => (
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
                <td colSpan={6} style={{ padding: 24, color: B.muted }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 24, color: B.muted }}>
                  No firms found.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((firm) => (
                <tr
                  key={firm.id}
                  style={{ borderBottom: `1px solid ${B.borderLight}`, cursor: 'pointer' }}
                  onClick={() => router.push(`/admin/firms/${firm.id}`)}
                >
                  <td style={{ padding: '13px 14px', fontWeight: 600, color: B.text }}>
                    {firm.firmName}
                  </td>
                  <td style={{ padding: '13px 14px', color: B.muted }}>
                    {firm.ownerEmail ?? '—'}
                  </td>
                  <td style={{ padding: '13px 14px', color: B.muted }}>
                    {formatDate(firm.createdAt)}
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <BillingPill status={firm.billingStatus ?? 'active'} />
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <StatusPill status={firm.status} />
                  </td>
                  <td style={{ padding: '13px 14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/firms/${firm.id}`)
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
            Page {data.page} of {data.totalPages} · {data.total} firms
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
