'use client'
import { useState } from 'react'
import { mockChaseLog, type ChaseLogEntry } from '@/mocks/clients/clientDetailData'
import { Card, CardHeader } from '@/components/ui/card'
import B from '@/styles/theme'

const TYPE_ICON: Record<string, string> = {
  email: '✉',
  sms: '✆',
  letter: '◻',
}

const STATUS_STYLE: Record<string, { bg: string; c: string; b: string }> = {
  Opened:    { bg: B.amberBg,  c: B.amberText,  b: '#FDE68A' },
  Responded: { bg: B.greenBg,  c: B.greenText,  b: '#A7F3D0' },
  Sent:      { bg: B.blueBg,   c: B.blueText,   b: '#BAE6FD' },
  Bounced:   { bg: B.redBg,    c: B.redText,    b: '#FECACA' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: B.surface, c: B.muted, b: B.border }
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
      {status}
    </span>
  )
}

function TypeIcon({ type }: { type: string }) {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: B.blueBg,
        border: `1px solid #BAE6FD`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        color: B.blueText,
        flexShrink: 0,
      }}
    >
      {TYPE_ICON[type] ?? '✉'}
    </span>
  )
}

function ChaseRow({ entry, last }: { entry: ChaseLogEntry; last: boolean }) {
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
      <TypeIcon type={entry.type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: B.text }}>{entry.msg}</span>
          <StatusBadge status={entry.status} />
        </div>
        <div style={{ fontSize: 11, color: B.light, marginTop: 3 }}>
          {entry.date}
          <span
            style={{
              marginLeft: 8,
              padding: '1px 7px',
              borderRadius: 4,
              background: B.surface,
              border: `1px solid ${B.border}`,
              fontSize: 10,
              color: B.muted,
              textTransform: 'capitalize',
            }}
          >
            {entry.type}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ChasingTab() {
  // Using mock data — replace with live chase log API when available
  const entries: ChaseLogEntry[] = mockChaseLog
  const [filter, setFilter] = useState<'all' | 'email' | 'sms'>('all')

  const filtered =
    filter === 'all' ? entries : entries.filter((e) => e.type === filter)

  const counts = {
    all: entries.length,
    email: entries.filter((e) => e.type === 'email').length,
    sms: entries.filter((e) => e.type === 'sms').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total chases', value: entries.length, color: B.primary },
          { label: 'Responded', value: entries.filter((e) => e.status === 'Responded').length, color: B.green },
          { label: 'Opened', value: entries.filter((e) => e.status === 'Opened').length, color: B.amber },
          { label: 'Sent (pending)', value: entries.filter((e) => e.status === 'Sent').length, color: B.muted },
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
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: B.text }}>{m.value}</div>
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
              {/* Filter pills */}
              {(['all', 'email', 'sms'] as const).map((f) => (
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
              <button
                type="button"
                style={{
                  marginLeft: 4,
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: B.navy,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Send chase
              </button>
            </div>
          }
        />
        <div style={{ padding: '4px 20px 4px' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '32px 0',
                textAlign: 'center',
                fontSize: 13,
                color: B.light,
              }}
            >
              No chases recorded yet for this client.
            </div>
          ) : (
            filtered.map((entry, i) => (
              <ChaseRow key={i} entry={entry} last={i === filtered.length - 1} />
            ))
          )}
        </div>
      </Card>

      {/* Info note */}
      <div
        style={{
          padding: '10px 14px',
          background: B.amberBg,
          border: `1px solid #FDE68A`,
          borderRadius: 8,
          fontSize: 12,
          color: B.amberText,
        }}
      >
        Chase sending is coming soon. Chases will be sent directly from this screen using your saved templates.
      </div>
    </div>
  )
}
