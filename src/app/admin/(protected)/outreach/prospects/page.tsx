'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import B from '@/styles/theme'
import {
  outreachService,
  type OutreachContact,
  type PageResult,
  type ProspectStatus,
} from '@/services/outreach.service'

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

export default function OutreachProspectsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PageResult<OutreachContact> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await outreachService.listContacts({
        page,
        limit: 20,
        search: query || undefined,
        status: status || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prospects')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, query, status])

  useEffect(() => {
    void load()
  }, [load])

  const items = data?.items ?? []

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
          Outreach prospects
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
          Contacts for cold / trial sequences. Uses platform admin login.
        </p>
      </div>

      <form
        onSubmit={(ev) => {
          ev.preventDefault()
          setPage(1)
          setQuery(search.trim())
        }}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email or name"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${B.border}`,
            minWidth: 220,
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1)
            setStatus(e.target.value)
          }}
          style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${B.border}` }}
        >
          <option value="">All statuses</option>
          {(
            [
              'new',
              'ready',
              'in_sequence',
              'engaged',
              'parked',
              'unresponsive',
            ] as ProspectStatus[]
          ).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: 'none',
            background: B.primaryBtn,
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {error && (
        <p style={{ color: B.redText, marginBottom: 12 }}>{error}</p>
      )}
      {loading && <p style={{ color: B.muted }}>Loading…</p>}

      {!loading && (
        <div
          style={{
            border: `1px solid ${B.border}`,
            borderRadius: 12,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: B.surface, textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Email</th>
                <th style={{ padding: '10px 12px' }}>Name</th>
                <th style={{ padding: '10px 12px' }}>Firm</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px' }}>Held</th>
                <th style={{ padding: '10px 12px' }}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/admin/outreach/prospects/${c.id}`)}
                  style={{ borderTop: `1px solid ${B.border}`, cursor: 'pointer' }}
                >
                  <td style={{ padding: '10px 12px' }}>{c.email}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{c.firm?.name || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>{c.status}</td>
                  <td style={{ padding: '10px 12px' }}>{c.sendHeld ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '10px 12px' }}>{formatDate(c.updatedAt)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 24, color: B.muted }}>
                    No prospects yet. Create firms/contacts via API or seed data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${B.border}` }}
          >
            Prev
          </button>
          <span style={{ fontSize: 13, color: B.muted }}>
            Page {data.page} / {data.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${B.border}` }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
