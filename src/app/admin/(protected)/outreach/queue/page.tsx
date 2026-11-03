'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import B from '@/styles/theme'
import { outreachService, type OutreachTask } from '@/services/outreach.service'

export default function OutreachQueuePage() {
  const router = useRouter()
  const [items, setItems] = useState<OutreachTask[]>([])
  const [asOf, setAsOf] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await outreachService.todayQueue()
      setItems(res.items)
      setAsOf(res.asOf)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queue')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const complete = async (id: string, status: 'done' | 'skipped') => {
    try {
      await outreachService.updateTask(id, { status })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Today queue
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: B.muted }}>
        Open tasks due today or earlier
        {asOf ? ` · as of ${new Date(asOf).toLocaleString('en-GB')}` : ''}
      </p>

      {error && <p style={{ color: B.redText }}>{error}</p>}
      {loading && <p style={{ color: B.muted }}>Loading…</p>}

      {!loading && items.length === 0 && (
        <p style={{ color: B.muted }}>No open tasks due. Queue is clear.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              border: `1px solid ${B.border}`,
              borderRadius: 12,
              padding: 14,
              background: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: B.text }}>
                {t.type} · priority {t.priority}
              </div>
              <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>
                {t.contact?.email || t.contactId} · due{' '}
                {new Date(t.dueAt).toLocaleString('en-GB')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {t.contactId && (
                <button
                  type="button"
                  onClick={() => router.push(`/admin/outreach/prospects/${t.contactId}`)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Open
                </button>
              )}
              <button
                type="button"
                onClick={() => void complete(t.id, 'done')}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: B.primaryBtn,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => void complete(t.id, 'skipped')}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: `1px solid ${B.border}`,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
