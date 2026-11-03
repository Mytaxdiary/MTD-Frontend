'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import B from '@/styles/theme'
import { outreachService, type OutreachContact, type OutreachTouchpoint, type OutreachTask } from '@/services/outreach.service'

export default function OutreachProspectDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const [data, setData] = useState<
    (OutreachContact & { touchpoints: OutreachTouchpoint[]; openTasks: OutreachTask[] }) | null
  >(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await outreachService.getContact(id)
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setData(null)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  if (!data && !error) {
    return <div style={{ padding: 32, color: B.muted }}>Loading…</div>
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      <button
        type="button"
        onClick={() => router.push('/admin/outreach/prospects')}
        style={{
          border: 'none',
          background: 'transparent',
          color: B.primaryBtn,
          cursor: 'pointer',
          marginBottom: 12,
          padding: 0,
        }}
      >
        ← Back to prospects
      </button>

      {error && <p style={{ color: B.redText }}>{error}</p>}

      {data && (
        <>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: B.text }}>
            {data.email}
          </h1>
          <p style={{ margin: '0 0 16px', color: B.muted, fontSize: 14 }}>
            {[data.firstName, data.lastName].filter(Boolean).join(' ') || 'No name'} ·{' '}
            {data.firm?.name || 'No firm'} · status {data.status} · held{' '}
            {data.sendHeld ? 'yes' : 'no'}
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            <button
              type="button"
              disabled={busy || !data.sendHeld}
              onClick={() => run(() => outreachService.releaseContact(id))}
              style={btnStyle(B)}
            >
              Release send hold
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => outreachService.advanceStep(id))}
              style={btnStyle(B)}
            >
              Advance sequence step
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => outreachService.stopSequence(id, 'Stopped from admin'))}
              style={btnStyle(B, true)}
            >
              Stop sequence
            </button>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Timeline</h2>
          <div
            style={{
              border: `1px solid ${B.border}`,
              borderRadius: 12,
              background: '#fff',
              marginBottom: 24,
            }}
          >
            {(data.touchpoints || []).length === 0 && (
              <p style={{ padding: 16, color: B.muted, margin: 0 }}>No touchpoints yet.</p>
            )}
            {(data.touchpoints || []).map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '12px 14px',
                  borderBottom: `1px solid ${B.border}`,
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600, color: B.text }}>
                  {t.eventType} · {t.channel} · {t.direction}
                </div>
                <div style={{ color: B.muted, marginTop: 4 }}>
                  {new Date(t.occurredAt).toLocaleString('en-GB')}
                  {t.summary ? ` — ${t.summary}` : ''}
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Open tasks</h2>
          {(data.openTasks || []).length === 0 ? (
            <p style={{ color: B.muted, fontSize: 14 }}>None</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {data.openTasks.map((t) => (
                <li key={t.id} style={{ marginBottom: 6, fontSize: 14 }}>
                  {t.type} due {new Date(t.dueAt).toLocaleString('en-GB')} (p{t.priority})
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

function btnStyle(B: typeof import('@/styles/theme').default, ghost = false) {
  return {
    padding: '8px 12px',
    borderRadius: 8,
    border: ghost ? `1px solid ${B.border}` : 'none',
    background: ghost ? '#fff' : B.primaryBtn,
    color: ghost ? B.text : '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 13,
  } as const
}
