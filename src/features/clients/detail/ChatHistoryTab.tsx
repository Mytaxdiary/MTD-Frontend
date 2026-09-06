'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import axiosClient from '@/lib/api/axiosClient'

interface PortalChatMessage {
  id: string
  subject: string
  body: string
  sender?: 'agent' | 'client'
  readAt?: string
  createdAt: string
}

interface Props {
  clientId: string | null
  clientName: string
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

export default function ChatHistoryTab({ clientId, clientName }: Props) {
  const [messages, setMessages] = useState<PortalChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get<{ data: PortalChatMessage[] }>(
        `/clients/${clientId}/portal-messages`,
      )
      setMessages(res.data.data ?? [])
    } catch {
      setError('Could not load portal chat history.')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!clientId || !body.trim() || sending) return
    setSending(true)
    setSendError(null)
    try {
      const res = await axiosClient.post<{ data: PortalChatMessage }>(
        `/clients/${clientId}/portal-message`,
        {
          subject: subject.trim() || 'Message from your accountant',
          body: body.trim(),
        },
      )
      const created = res.data.data
      if (created) setMessages((prev) => [...prev, created])
      setSubject('')
      setBody('')
    } catch {
      setSendError('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (!clientId) {
    return (
      <div
        style={{
          padding: '10px 12px',
          background: B.amberBg,
          border: '1px solid #FDE68A',
          borderRadius: 8,
          fontSize: 12,
          color: B.amberText,
        }}
      >
        Open a client from the Clients list to view portal chat.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          padding: '12px 14px',
          background: B.blueBg,
          border: '1px solid #BAE6FD',
          borderRadius: 8,
          fontSize: 13,
          color: B.blueText,
          lineHeight: 1.5,
        }}
      >
        Portal chat with {clientName}. This is separate from email chasers on the Email chases tab and
        Chase manager.
      </div>

      <Card>
        <CardHeader
          title="Chat history"
          sub="Messages sent in the client portal"
          titleSize={16}
          padding="16px 20px"
        />

        <div
          style={{
            padding: '16px 20px',
            minHeight: 280,
            maxHeight: 420,
            overflowY: 'auto',
            background: B.surface,
            borderTop: `1px solid ${B.border}`,
          }}
        >
          {loading ? (
            <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>Loading chat...</p>
          ) : error ? (
            <div>
              <p style={{ fontSize: 13, color: B.redText, margin: '0 0 10px' }}>{error}</p>
              <button
                type="button"
                onClick={() => void load()}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${B.border}`,
                  background: B.white,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          ) : messages.length === 0 ? (
            <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>
              No portal messages yet. Send the first message below.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((msg) => {
                const fromAgent = msg.sender !== 'client'
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: fromAgent ? 'flex-end' : 'flex-start',
                      maxWidth: '78%',
                      background: fromAgent ? '#1E3A5F' : B.white,
                      color: fromAgent ? '#fff' : B.text,
                      borderRadius: 10,
                      padding: '10px 12px',
                      border: fromAgent ? 'none' : `1px solid ${B.border}`,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 3 }}>
                      {fromAgent ? 'You' : clientName}
                      {msg.subject && msg.subject !== 'Message from portal'
                        ? ` · ${msg.subject}`
                        : ''}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{msg.body}</div>
                    <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
                      {formatDateTime(msg.createdAt)}
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
            padding: '16px 20px 20px',
            borderTop: `1px solid ${B.border}`,
            background: B.white,
          }}
        >
          <label style={{ display: 'block', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Your Q2 records are ready"
              style={{
                display: 'block',
                width: '100%',
                marginTop: 5,
                padding: '9px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 13,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Message</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write your portal message..."
              style={{
                display: 'block',
                width: '100%',
                marginTop: 5,
                padding: '9px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 13,
                boxSizing: 'border-box',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </label>
          {sendError && (
            <div
              style={{
                marginBottom: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: B.redBg,
                color: B.redText,
                fontSize: 12,
              }}
            >
              {sendError}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              disabled={sending || !body.trim()}
              onClick={() => void handleSend()}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                border: 'none',
                background: body.trim() && !sending ? '#1E3A5F' : B.border,
                color: body.trim() && !sending ? '#fff' : B.muted,
                fontSize: 13,
                fontWeight: 600,
                cursor: body.trim() && !sending ? 'pointer' : 'not-allowed',
              }}
            >
              {sending ? 'Sending...' : 'Send portal message'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
