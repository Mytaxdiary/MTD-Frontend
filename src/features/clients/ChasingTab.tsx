'use client'
import { useCallback, useEffect, useState } from 'react'
import { chaseService, type ChaseLogRecord } from '@/services/chase.service'
import { Card, CardHeader } from '@/components/ui/card'
import B from '@/styles/theme'

const CHANNEL_ICON: Record<string, string> = { email: '✉', sms: '✆' }

const STATUS_STYLE: Record<string, { bg: string; c: string; b: string }> = {
  opened:    { bg: B.amberBg,  c: B.amberText,  b: '#FDE68A' },
  responded: { bg: B.greenBg,  c: B.greenText,  b: '#A7F3D0' },
  sent:      { bg: B.blueBg,   c: B.blueText,   b: '#BAE6FD' },
  bounced:   { bg: B.redBg,    c: B.redText,    b: '#FECACA' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: B.surface, c: B.muted, b: B.border }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 9px',
        borderRadius: 20,
        background: s.bg,
        color: s.c,
        border: `1px solid ${s.b}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ChaseRow({ entry, last }: { entry: ChaseLogRecord; last: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderBottom: last ? 'none' : `1px solid ${B.borderLight}`,
      }}
    >
      {/* Channel icon */}
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: B.blueBg,
          border: '1px solid #BAE6FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: B.blueText,
          flexShrink: 0,
        }}
      >
        {CHANNEL_ICON[entry.channel] ?? '✉'}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span
            style={{ fontSize: 13, fontWeight: 500, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {entry.subject}
          </span>
          <StatusBadge status={entry.status} />
        </div>
        <div style={{ fontSize: 11, color: B.light, marginTop: 3 }}>
          {fmtDate(entry.sentAt)}
          <span
            style={{
              marginLeft: 8,
              padding: '1px 7px',
              borderRadius: 4,
              background: B.surface,
              border: `1px solid ${B.border}`,
              fontSize: 10,
              color: B.muted,
              textTransform: 'uppercase',
            }}
          >
            {entry.channel}
          </span>
        </div>
      </div>
    </div>
  )
}

type FilterType = 'all' | 'email' | 'sms'

export default function ChasingTab({ clientId }: { clientId?: string | null }) {
  const [logs, setLogs] = useState<ChaseLogRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

  const load = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    setError(null)
    try {
      const data = await chaseService.getClientChaseLog(clientId)
      setLogs(data)
    } catch {
      setError('Failed to load chase history.')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = filter === 'all' ? logs : logs.filter((l) => l.channel === filter)

  const counts = {
    all: logs.length,
    email: logs.filter((l) => l.channel === 'email').length,
    sms: logs.filter((l) => l.channel === 'sms').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total chases',   value: logs.length,                                              color: B.primary },
          { label: 'Responded',      value: logs.filter((l) => l.status === 'responded').length,      color: B.green   },
          { label: 'Opened',         value: logs.filter((l) => l.status === 'opened').length,         color: B.amber   },
          { label: 'Sent (pending)', value: logs.filter((l) => l.status === 'sent').length,           color: B.muted   },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              flex: 1,
              background: B.white,
              border: `1px solid ${B.border}`,
              borderRadius: 10,
              padding: '12px 16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.color }} />
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: B.text }}>
              {loading ? '0' : m.value}
            </div>
            <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Chase log card */}
      <Card>
        <CardHeader
          title="Chase history"
          right={
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {(['all', 'email', 'sms'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: `1px solid ${filter === f ? B.primary : B.border}`,
                    background: filter === f ? B.blueBg : 'transparent',
                    color: filter === f ? B.blueText : B.muted,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'all' ? `All (${counts.all})` : `${f.toUpperCase()} (${counts[f]})`}
                </button>
              ))}
            </div>
          }
        />
        <div style={{ padding: '4px 20px 4px' }}>
          {loading && (
            <div style={{ padding: '28px 0', textAlign: 'center', fontSize: 13, color: B.muted }}>
              Loading chase history...
            </div>
          )}
          {!loading && error && (
            <div style={{ padding: '12px', fontSize: 12, color: B.redText }}>{error}</div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: B.light }}>
              {logs.length === 0
                ? 'No chases sent yet. Use Chase Manager to send the first chase.'
                : 'No chases match the selected filter.'}
            </div>
          )}
          {!loading && !error && filtered.map((entry, i) => (
            <ChaseRow key={entry.id} entry={entry} last={i === filtered.length - 1} />
          ))}
        </div>
      </Card>

      {/* Link to chase manager */}
      <div
        style={{
          padding: '10px 14px',
          background: B.blueBg,
          border: '1px solid #BAE6FD',
          borderRadius: 8,
          fontSize: 12,
          color: B.blueText,
        }}
      >
        To send a new chase, go to <b>Chase Manager</b> → select this client → pick a template → Send.
      </div>
    </div>
  )
}
