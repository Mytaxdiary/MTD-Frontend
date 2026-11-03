'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import {
  outreachService,
  type OutreachSuppression,
  type PageResult,
} from '@/services/outreach.service'

export default function OutreachSuppressionsPage() {
  const [data, setData] = useState<PageResult<OutreachSuppression> | null>(null)
  const [search, setSearch] = useState('')
  const [value, setValue] = useState('')
  const [valueType, setValueType] = useState<'email' | 'domain'>('domain')
  const [reason, setReason] = useState('competitor')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await outreachService.listSuppressions({
        limit: 100,
        search: search.trim() || undefined,
      })
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    void load()
  }, [load])

  const add = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!value.trim()) return
    try {
      await outreachService.createSuppression({
        value: value.trim(),
        valueType,
        reason,
      })
      setValue('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Add failed')
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Suppressions
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: B.muted }}>
        Block cold release to emails or domains (competitors, research signups, unsubscribes).
      </p>

      <form
        onSubmit={add}
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="email or domain"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${B.border}`,
            minWidth: 200,
          }}
        />
        <select
          value={valueType}
          onChange={(e) => setValueType(e.target.value as 'email' | 'domain')}
          style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${B.border}` }}
        >
          <option value="domain">Domain</option>
          <option value="email">Email</option>
        </select>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${B.border}` }}
        >
          <option value="competitor">Competitor</option>
          <option value="research">Research</option>
          <option value="unsubscribe">Unsubscribe</option>
          <option value="requested_removal">Requested removal</option>
          <option value="hard_bounce">Hard bounce</option>
          <option value="other">Other</option>
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
          }}
        >
          Add
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
                <th style={{ padding: '10px 12px' }}>Value</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Reason</th>
                <th style={{ padding: '10px 12px' }}>Added</th>
                <th style={{ padding: '10px 12px' }} />
              </tr>
            </thead>
            <tbody>
              {(data?.items || []).map((s) => (
                <tr key={s.id} style={{ borderTop: `1px solid ${B.border}` }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{s.value}</td>
                  <td style={{ padding: '10px 12px' }}>{s.valueType}</td>
                  <td style={{ padding: '10px 12px' }}>{s.reason}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {new Date(s.addedAt).toLocaleDateString('en-GB')}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      type="button"
                      onClick={async () => {
                        await outreachService.deleteSuppression(s.id)
                        await load()
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: B.redText,
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {(data?.items || []).length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, color: B.muted }}>
                    No suppressions yet.
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
