'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, { type PortalMessage } from '@/services/portal.service'
import B from '@/styles/theme'

export default function PortalMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<PortalMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const [msgs, me] = await Promise.all([portalService.getMessages(), portalService.getMe()])
        setMessages(msgs)
        setIsPreview(!!me.isPreview)
        const unread = msgs.filter((m) => m.sender !== 'client' && !m.readAt)
        await Promise.all(unread.map((m) => portalService.markRead(m.id).catch(() => null)))
        setLoading(false)
      } catch {
        router.push('/portal/login')
      }
    }
    void load()
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = body.trim()
    if (!text || sending || isPreview) return
    setSending(true)
    setError(null)
    try {
      const msg = await portalService.sendMessage(text)
      setMessages((prev) => [...prev, msg])
      setBody('')
    } catch (err) {
      setError((err as Error)?.message ?? 'Could not send message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: B.text,
              letterSpacing: '-0.3px',
            }}
          >
            Chat with your accountant
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: 15, color: B.muted }}>
            Portal chat only — separate from email chasers
          </p>
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

      <div
        style={{
          background: B.white,
          borderRadius: 12,
          border: `1px solid ${B.border}`,
          boxShadow: B.cardShadow,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 480,
          maxHeight: '70vh',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {loading ? (
            <p style={{ fontSize: 15, color: B.muted, textAlign: 'center', marginTop: 40 }}>
              Loading chat...
            </p>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>
                No messages yet. Say hello to your accountant below.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((msg) => {
                const fromClient = msg.sender === 'client'
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: fromClient ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '78%',
                        background: fromClient ? '#1E3A5F' : B.surface,
                        color: fromClient ? '#fff' : B.text,
                        borderRadius: 12,
                        padding: '12px 14px',
                        border: fromClient ? 'none' : `1px solid ${B.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: 0.8,
                          marginBottom: 4,
                        }}
                      >
                        {fromClient ? 'You' : 'Your accountant'}
                        {msg.subject && msg.subject !== 'Message from portal' ? ` · ${msg.subject}` : ''}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.body}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          marginTop: 6,
                          opacity: 0.7,
                        }}
                      >
                        {formatDateTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div
          style={{
            borderTop: `1px solid ${B.border}`,
            padding: '14px 16px',
            background: B.surface,
          }}
        >
          {isPreview ? (
            <p style={{ margin: 0, fontSize: 13, color: B.muted }}>
              Preview mode is read-only — you cannot send messages.
            </p>
          ) : (
            <>
              {error && (
                <div style={{ fontSize: 13, color: B.redText, marginBottom: 8 }}>{error}</div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={2}
                  placeholder="Write a message to your accountant..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    fontSize: 14,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void handleSend()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={sending || !body.trim()}
                  style={{
                    alignSelf: 'flex-end',
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: body.trim() && !sending ? '#1E3A5F' : B.border,
                    color: body.trim() && !sending ? '#fff' : B.muted,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: body.trim() && !sending ? 'pointer' : 'not-allowed',
                  }}
                >
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDateTime(d: string): string {
  try {
    return new Date(d).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return d
  }
}
