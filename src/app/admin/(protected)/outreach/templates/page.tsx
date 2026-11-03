'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { outreachService, type OutreachTemplate, type PageResult } from '@/services/outreach.service'

export default function OutreachTemplatesPage() {
  const [data, setData] = useState<PageResult<OutreachTemplate> | null>(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await outreachService.listTemplates({
        limit: 100,
        search: query || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Outreach templates
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: B.muted }}>
        Handbook codes (E1, R5, S1, …). Seed via SQL or create through API.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setQuery(search.trim())
        }}
        style={{ marginBottom: 16, display: 'flex', gap: 8 }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search code or name"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${B.border}`,
            minWidth: 220,
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: 'none',
            background: B.primaryBtn,
            color: '#fff',
            fontWeight: 600,
          }}
        >
          Search
        </button>
      </form>

      {error && <p style={{ color: B.redText }}>{error}</p>}
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
                <th style={{ padding: '10px 12px' }}>Code</th>
                <th style={{ padding: '10px 12px' }}>Version</th>
                <th style={{ padding: '10px 12px' }}>Name</th>
                <th style={{ padding: '10px 12px' }}>Subject</th>
                <th style={{ padding: '10px 12px' }}>Link</th>
              </tr>
            </thead>
            <tbody>
              {(data?.items || []).map((t) => (
                <tr key={t.id} style={{ borderTop: `1px solid ${B.border}` }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{t.handbookCode}</td>
                  <td style={{ padding: '10px 12px' }}>{t.version}</td>
                  <td style={{ padding: '10px 12px' }}>{t.name}</td>
                  <td style={{ padding: '10px 12px' }}>{t.subject || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>{t.linkAsset}</td>
                </tr>
              ))}
              {(data?.items || []).length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, color: B.muted }}>
                    No templates. Run outreach seed SQL after migrations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
