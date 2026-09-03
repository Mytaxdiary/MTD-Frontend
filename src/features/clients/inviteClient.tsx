'use client'

import { useState } from 'react'
import B from '@/styles/theme'
import { clientsService } from '@/services/clients.service'

function apiErrorMessage(err: unknown): string {
  const raw = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
    ?.message
  if (Array.isArray(raw)) return raw.join(' ')
  if (typeof raw === 'string') return raw
  return (err as { message?: string })?.message ?? 'Something went wrong. Please try again.'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: `1px solid ${B.borderStrong}`,
  fontSize: 14,
  boxSizing: 'border-box',
}

export default function InviteClient({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [sentMessage, setSentMessage] = useState('')
  const [sentEmail, setSentEmail] = useState('')

  const emailValid = email.includes('@') && email.includes('.')
  const formComplete = firstName.trim().length > 0 && lastName.trim().length > 0 && emailValid

  async function handleSubmit() {
    if (!formComplete) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await clientsService.invitePortalClient({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      })
      setSentMessage(result.message)
      setSentEmail(email.trim())
      setSent(true)
    } catch (err) {
      setSubmitError(apiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setSent(false)
    setSentMessage('')
    setSentEmail('')
    setFirstName('')
    setLastName('')
    setEmail('')
    setSubmitError(null)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '14px 28px',
          background: B.white,
          borderBottom: `1px solid ${B.borderStrong}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em' }}>Invite client</div>
        <div style={{ fontSize: 15, color: B.muted, marginTop: 3 }}>
          Give a customer access to the client portal only — no HMRC authorisation
        </div>
      </div>

      <div style={{ padding: '18px 28px', flex: 1, maxWidth: 560 }}>
        {!sent ? (
          <div
            style={{
              background: B.white,
              borderRadius: 12,
              border: `1px solid ${B.borderStrong}`,
              boxShadow: B.cardShadow,
              padding: '22px',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Customer details</div>
            <p style={{ fontSize: 14, color: B.muted, margin: '0 0 18px', lineHeight: 1.5 }}>
              They will receive an email to set up their portal password. Use{' '}
              <strong>Add client</strong> if you also need HMRC authorisation.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>
                  Surname
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            {submitError && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#FEF2F2',
                  color: '#991B1B',
                  fontSize: 13,
                  border: '1px solid #FECACA',
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!formComplete || submitting}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: formComplete && !submitting ? B.primary : B.border,
                  color: formComplete && !submitting ? '#fff' : B.muted,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: formComplete && !submitting ? 'pointer' : 'not-allowed',
                }}
              >
                {submitting ? 'Sending…' : 'Send portal invite'}
              </button>
              <button
                type="button"
                onClick={() => navigate('clients')}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: `1px solid ${B.border}`,
                  background: B.white,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: B.text,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: B.white,
              borderRadius: 12,
              border: `1px solid ${B.borderStrong}`,
              boxShadow: B.cardShadow,
              padding: '22px',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: B.greenText }}>
              Invite sent
            </div>
            <p style={{ fontSize: 14, color: B.text, margin: '0 0 8px', lineHeight: 1.5 }}>
              {sentMessage}
            </p>
            <p style={{ fontSize: 14, color: B.muted, margin: '0 0 20px' }}>
              Email sent to <strong>{sentEmail}</strong>
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: B.primary,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Invite another
              </button>
              <button
                type="button"
                onClick={() => navigate('settings')}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: `1px solid ${B.border}`,
                  background: B.white,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: B.text,
                }}
              >
                Customer management
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
