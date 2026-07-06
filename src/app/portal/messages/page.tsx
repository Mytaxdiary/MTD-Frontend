'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, { type PortalMessage } from '@/services/portal.service'
import B from '@/styles/theme'

export default function PortalMessagesPage() {
  const router = useRouter()
  const [messages, setMessages]     = useState<PortalMessage[]>([])
  const [loading, setLoading]       = useState(true)
  const [expanded, setExpanded]     = useState<string | null>(null)

  useEffect(() => {
    portalService.getMessages()
      .then((msgs) => { setMessages(msgs); setLoading(false) })
      .catch(() => router.push('/portal/login'))
  }, [router])

  async function handleExpand(msg: PortalMessage) {
    setExpanded((prev) => (prev === msg.id ? null : msg.id))
    if (!msg.readAt) {
      await portalService.markRead(msg.id).catch(() => null)
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, readAt: new Date().toISOString() } : m))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: B.text }}>Messages</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: B.muted }}>Messages from your accountant</p>
        </div>
        <button
          onClick={() => router.push('/portal/dashboard')}
          style={{
            padding: '7px 14px', background: B.white, color: B.text,
            border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 12, cursor: 'pointer',
          }}
        >
          ← Dashboard
        </button>
      </div>

      {loading ? (
        <p style={{ fontSize: 14, color: B.muted }}>Loading messages…</p>
      ) : messages.length === 0 ? (
        <div
          style={{
            background: B.white, borderRadius: 12, border: `1px solid ${B.border}`,
            padding: '48px 32px', textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14, color: B.muted, margin: 0 }}>No messages yet. Your accountant will send updates here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: B.white,
                borderRadius: 10,
                border: `1px solid ${!msg.readAt ? '#1E3A5F' : B.border}`,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => handleExpand(msg)}
            >
              <div
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: !msg.readAt ? '#EFF6FF' : B.white,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {!msg.readAt && (
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#1E3A5F', flexShrink: 0, display: 'inline-block',
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: !msg.readAt ? 700 : 500, fontSize: 14, color: B.text }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>
                      {formatDateTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: B.muted }}>
                  {expanded === msg.id ? '▲' : '▼'}
                </span>
              </div>

              {expanded === msg.id && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderTop: `1px solid ${B.border}`,
                    fontSize: 14,
                    color: B.text,
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.body}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDateTime(d: string): string {
  try {
    return new Date(d).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return d
  }
}
