import { useEffect, useRef, useState } from 'react'
import B from '@/styles/theme'
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
  show: boolean
  onClose: () => void
  clientId: string | null
  clientName: string
  initialSubject?: string
  initialBody?: string
}

export default function MessageModal({
  show,
  onClose,
  clientId,
  clientName,
  initialSubject = '',
  initialBody = '',
}: Props) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<PortalChatMessage[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show) return
    setSubject(initialSubject)
    setBody(initialBody)
    setSending(false)
    setSuccess(false)
    setError('')
    if (!clientId) {
      setHistory([])
      return
    }
    setHistoryLoading(true)
    axiosClient
      .get<{ data: PortalChatMessage[] }>(`/clients/${clientId}/portal-messages`)
      .then((res) => setHistory(res.data.data ?? []))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false))
  }, [show, initialSubject, initialBody, clientId])

  useEffect(() => {
    if (show) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, show])

  if (!show) return null

  function handleClose() {
    setSubject('')
    setBody('')
    setSending(false)
    setSuccess(false)
    setError('')
    setHistory([])
    onClose()
  }

  async function handleSend() {
    setSending(true)
    setError('')
    try {
      const res = await axiosClient.post<{ data: PortalChatMessage }>(
        `/clients/${clientId}/portal-message`,
        {
          subject: subject.trim() || 'Message from your accountant',
          body: body.trim(),
        },
      )
      const created = res.data.data
      if (created) setHistory((prev) => [...prev, created])
      setSuccess(true)
      setSubject('')
      setBody('')
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        style={{
          background: B.white,
          borderRadius: 12,
          width: 560,
          maxWidth: '95vw',
          maxHeight: '90vh',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            borderBottom: `1px solid ${B.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: B.text }}>
              Portal chat — {clientName}
            </div>
            <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>
              Separate from email chasers
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: B.muted,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            background: B.surface,
            minHeight: 180,
            maxHeight: 280,
          }}
        >
          {historyLoading ? (
            <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>Loading chat...</p>
          ) : history.length === 0 ? (
            <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>No portal messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((msg) => {
                const fromAgent = msg.sender !== 'client'
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: fromAgent ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
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
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{msg.body}</div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px 20px' }}>
          {success && (
            <div
              style={{
                marginBottom: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: B.greenBg,
                color: B.greenText,
                fontSize: 12,
              }}
            >
              Message sent. The client will see it in their portal chat.
            </div>
          )}
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
          <label style={{ display: 'block', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Message</span>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                setSuccess(false)
              }}
              rows={5}
              placeholder="Write your message here..."
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
              }}
            />
          </label>
          {error && (
            <div
              style={{
                background: B.redBg,
                border: '1px solid #FECACA',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                color: B.redText,
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 18px',
                background: B.white,
                border: `1px solid ${B.border}`,
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer',
                color: B.muted,
              }}
            >
              Close
            </button>
            <button
              disabled={sending || !body.trim() || !clientId}
              onClick={handleSend}
              style={{
                padding: '8px 20px',
                background: '#1E3A5F',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
