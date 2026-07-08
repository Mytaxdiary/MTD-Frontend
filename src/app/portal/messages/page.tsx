'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, { type PortalMessage } from '@/services/portal.service'
import B from '@/styles/theme'

export default function PortalMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<PortalMessage[]>([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

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
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: B.text, letterSpacing: '-0.3px' }}>Messages</h2>
          <p style={{ margin: '5px 0 0', fontSize: 14, color: B.muted }}>Messages from your accountant</p>
        </div>
        <button
          onClick={() => router.push('/portal/dashboard')}
          style={{
            padding: '8px 18px',
            background: B.white,
            color: B.text,
            border: `1px solid ${B.border}`,
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Back to dashboard
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <p style={{ fontSize: 15, color: B.muted }}>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div style={{
          background: B.white,
          borderRadius: 12,
          border: `1px solid ${B.border}`,
          padding: '56px 32px',
          textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>No messages yet. Your accountant will send updates here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: B.white,
                borderRadius: 10,
                border: `1.5px solid ${!msg.readAt ? '#1E3A5F' : B.border}`,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: !msg.readAt ? '0 2px 8px rgba(30,58,95,0.10)' : '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onClick={() => handleExpand(msg)}
            >
              <div style={{
                padding: '16px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: !msg.readAt ? '#EFF6FF' : B.white,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {!msg.readAt && (
                    <span style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#1E3A5F',
                      flexShrink: 0,
                      display: 'inline-block',
                    }} />
                  )}
                  <div>
                    <div style={{ fontWeight: !msg.readAt ? 700 : 500, fontSize: 15, color: B.text }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: 13, color: B.muted, marginTop: 3 }}>
                      {formatDateTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 13, color: B.muted, flexShrink: 0 }}>
                  {expanded === msg.id ? 'Hide' : 'View'}
                </span>
              </div>

              {expanded === msg.id && (
                <div style={{
                  padding: '18px 22px',
                  borderTop: `1px solid ${B.border}`,
                  fontSize: 15,
                  color: B.text,
                  lineHeight: 1.75,
                  whiteSpace: 'pre-wrap',
                  background: '#FAFCFF',
                }}>
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
