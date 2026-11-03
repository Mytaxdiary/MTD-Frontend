'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { outreachService, type OutreachCampaign } from '@/services/outreach.service'

type Stats = {
  sent: number
  delivered: number
  bounced: number
  clicked: number
  replied: number
  blocked: number
}

export default function OutreachCampaignsPage() {
  const [items, setItems] = useState<OutreachCampaign[]>([])
  const [statsById, setStatsById] = useState<Record<string, Stats>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await outreachService.listCampaigns()
      setItems(res.items)
      const entries = await Promise.all(
        res.items.map(async (c) => {
          try {
            const s = await outreachService.campaignStats(c.id)
            return [c.id, s.stats] as const
          } catch {
            return [c.id, null] as const
          }
        }),
      )
      const map: Record<string, Stats> = {}
      for (const [id, s] of entries) {
        if (s) map[id] = s
      }
      setStatsById(map)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Campaigns
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: B.muted }}>
        Basic counts from touchpoints. Full Instantly metrics come in a later task.
      </p>

      {error && <p style={{ color: B.redText }}>{error}</p>}
      {loading && <p style={{ color: B.muted }}>Loading…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((c) => {
          const s = statsById[c.id]
          return (
            <div
              key={c.id}
              style={{
                border: `1px solid ${B.border}`,
                borderRadius: 12,
                padding: 16,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: B.text }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>
                    Wave {c.waveNumber} · sequence {c.sequence?.code || c.sequenceId} ·{' '}
                    {c.releaseHeld ? 'held' : 'released'}
                  </div>
                </div>
                {c.releaseHeld && (
                  <button
                    type="button"
                    onClick={async () => {
                      await outreachService.releaseCampaign(c.id)
                      await load()
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: B.primaryBtn,
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      height: 'fit-content',
                    }}
                  >
                    Release wave
                  </button>
                )}
              </div>
              {s && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                    gap: 8,
                    marginTop: 14,
                    fontSize: 12,
                  }}
                >
                  {(
                    [
                      ['Sent', s.sent],
                      ['Delivered', s.delivered],
                      ['Bounced', s.bounced],
                      ['Clicked', s.clicked],
                      ['Replied', s.replied],
                      ['Blocked', s.blocked],
                    ] as const
                  ).map(([label, n]) => (
                    <div
                      key={label}
                      style={{
                        background: B.surface,
                        borderRadius: 8,
                        padding: '8px 10px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{n}</div>
                      <div style={{ color: B.muted }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {!loading && items.length === 0 && (
          <p style={{ color: B.muted }}>No campaigns yet.</p>
        )}
      </div>
    </div>
  )
}
