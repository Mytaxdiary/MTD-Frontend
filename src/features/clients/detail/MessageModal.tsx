import { useState } from 'react'
import B from '@/styles/theme'
import axiosClient from '@/lib/api/axiosClient'

interface Props {
  show: boolean
  onClose: () => void
  clientId: string | null
  clientName: string
}

export default function MessageModal({ show, onClose, clientId, clientName }: Props) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!show) return null

  function handleClose() {
    setSubject('')
    setBody('')
    setSending(false)
    setSuccess(false)
    setError('')
    onClose()
  }

  async function handleSend() {
    setSending(true)
    setError('')
    try {
      await axiosClient.post(`/clients/${clientId}/portal-message`, {
        subject: subject.trim(),
        body: body.trim(),
      })
      setSuccess(true)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        style={{
          background: B.white, borderRadius: 12, width: 520, maxWidth: '95vw',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${B.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: B.text }}>
            Message {clientName}
          </span>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: B.muted }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
              <p style={{ fontSize: 14, color: B.greenText, fontWeight: 600, margin: 0 }}>Message sent successfully</p>
              <p style={{ fontSize: 13, color: B.muted, marginTop: 6 }}>
                The client will receive an email notification and can read it in their portal.
              </p>
              <button
                onClick={handleClose}
                style={{ marginTop: 16, padding: '8px 20px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.text }}>Subject</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Your Q2 records are ready"
                  style={{ display: 'block', width: '100%', marginTop: 5, padding: '9px 12px', borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.text }}>Message</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  placeholder="Write your message here..."
                  style={{ display: 'block', width: '100%', marginTop: 5, padding: '9px 12px', borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }}
                />
              </label>
              {error && (
                <div style={{ background: B.redBg, border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: B.redText, marginBottom: 14 }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={handleClose}
                  style={{ padding: '8px 18px', background: B.white, border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: B.muted }}
                >
                  Cancel
                </button>
                <button
                  disabled={sending || !subject.trim() || !body.trim() || !clientId}
                  onClick={handleSend}
                  style={{ padding: '8px 20px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}
                >
                  {sending ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
