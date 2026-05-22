'use client'
import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { clientsService, type ClientRecord } from '@/services/clients.service'

function apiErrorMessage(err: unknown): string {
  const raw = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
    ?.message
  if (Array.isArray(raw)) return raw.join(' ')
  if (typeof raw === 'string') return raw
  return (err as { message?: string })?.message ?? 'Something went wrong. Please try again.'
}

function apiStatusCode(err: unknown): number | undefined {
  return (err as Error & { statusCode?: number })?.statusCode
}

function formatNino(nino: string): string {
  const clean = nino.replace(/\s/g, '').toUpperCase()
  return clean.replace(/(.{2})(?=.)/g, '$1 ').trim()
}

function daysLeft(expiresAt?: string): number | null {
  if (!expiresAt) return null
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function fmtDate(d?: string): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AddClient({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [nino, setNino] = useState('')
  const [clientName, setClientName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [personalMsg, setPersonalMsg] = useState(
    "Hi {name}, we're setting up your Making Tax Digital account. You'll receive an email from HMRC shortly — please accept the authorisation link so we can manage your quarterly updates."
  )
  const [agentType, setAgentType] = useState('main')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [sent, setSent] = useState(false)
  const [invitationSent, setInvitationSent] = useState(true)
  const [sentWarning, setSentWarning] = useState<string | null>(null)
  const [sentClient, setSentClient] = useState<ClientRecord | null>(null)
  const [mode, setMode] = useState('single')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Pending invitations panel
  const [pendingClients, setPendingClients] = useState<ClientRecord[]>([])
  const [pendingLoading, setPendingLoading] = useState(true)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [resendPanelError, setResendPanelError] = useState<string | null>(null)

  const loadPending = useCallback(() => {
    setPendingLoading(true)
    clientsService
      .list()
      .then((all) => setPendingClients(all.filter((c) => c.invitationStatus === 'pending')))
      .catch(() => setPendingClients([]))
      .finally(() => setPendingLoading(false))
  }, [])

  useEffect(() => {
    loadPending()
  }, [loadPending, sent])

  const ninoClean = nino.replace(/\s/g, '')
  const ninoFormatted = ninoClean
    .toUpperCase()
    .replace(/(.{2})(?=.)/g, '$1 ')
    .trim()
  const ninoValid = ninoClean.length === 9
  const emailValid = clientEmail.includes('@') && clientEmail.includes('.')
  const postcodeValid = postcode.trim().length >= 5
  const formComplete = ninoValid && clientName.length > 0 && emailValid && postcodeValid

  async function handleSubmit() {
    if (!formComplete) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await clientsService.create({
        name: clientName,
        nino: ninoClean,
        postcode: postcode.trim(),
        email: clientEmail,
        phone: phone.trim() || undefined,
        agentType,
        personalMessage: personalMsg,
      })
      setSentClient(result.client)
      setInvitationSent(result.invitationSent)
      setSentWarning(result.warning ?? null)
      setSent(true)
    } catch (err: unknown) {
      const msg = apiErrorMessage(err)
      if (apiStatusCode(err) === 409) {
        setSubmitError(`${msg} Use Resend invitation in the panel on the right.`)
        loadPending()
      } else {
        setSubmitError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend(client: ClientRecord) {
    setResendingId(client.id)
    setResendPanelError(null)
    try {
      const result = await clientsService.resendInvitation(client.id, {
        personalMessage: personalMsg.replace(/\{name\}/g, client.name),
      })
      loadPending()
      if (!result.invitationSent && result.warning) {
        setResendPanelError(`${client.name}: ${result.warning}`)
      }
    } catch (err: unknown) {
      setResendPanelError(`${client.name}: ${apiErrorMessage(err)}`)
    } finally {
      setResendingId(null)
    }
  }

  function resetForm() {
    setSent(false)
    setInvitationSent(true)
    setSentWarning(null)
    setSentClient(null)
    setNino('')
    setClientName('')
    setPostcode('')
    setClientEmail('')
    setPhone('')
    setSubmitError(null)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px 32px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700 }}>Add client</div>
        <div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>
          Send an HMRC authorisation invitation to a new client
        </div>
      </div>

      <div style={{ padding: '24px 32px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: 4,
                background: B.borderLight,
                borderRadius: 10,
                width: 'fit-content',
              }}
            >
              {[
                { k: 'single', l: 'Single client' },
                { k: 'bulk', l: 'Bulk import (CSV)' },
              ].map((m) => (
                <button
                  key={m.k}
                  onClick={() => setMode(m.k)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 7,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: mode === m.k ? B.white : 'transparent',
                    color: mode === m.k ? B.text : B.muted,
                    boxShadow: mode === m.k ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {m.l}
                </button>
              ))}
            </div>

            {mode === 'single' && !sent && (
              <div
                style={{
                  background: B.white,
                  borderRadius: 12,
                  border: `1px solid ${B.border}`,
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                  Client details
                </div>

                {/* NINO */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 5 }}>
                    National Insurance number (NINO) *
                  </label>
                  <input
                    value={ninoFormatted}
                    onChange={(e) => setNino(e.target.value)}
                    placeholder="QQ 12 34 56 C"
                    maxLength={13}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${nino.length > 0 && !ninoValid ? '#FECACA' : B.border}`,
                      fontSize: 15,
                      fontFamily: 'monospace',
                      letterSpacing: '0.08em',
                      outline: 'none',
                    }}
                  />
                  {nino.length > 0 && !ninoValid && (
                    <div style={{ fontSize: 11, color: B.red, marginTop: 4 }}>
                      NINO must be 9 characters (2 letters, 6 digits, 1 letter)
                    </div>
                  )}
                </div>

                {/* Client name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 5 }}>
                    Client name *
                  </label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Smith"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${B.border}`,
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Postcode */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 5 }}>
                    Postcode * <span style={{ fontWeight: 400, color: B.light }}>(used by HMRC to verify identity)</span>
                  </label>
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="e.g. TS24 1PA"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${postcode.length > 0 && !postcodeValid ? '#FECACA' : B.border}`,
                      fontSize: 13,
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Client email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 5 }}>
                    Client email *
                  </label>
                  <input
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${clientEmail.length > 0 && !emailValid ? '#FECACA' : B.border}`,
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Personal message */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 5 }}>
                    Personal message to client
                  </label>
                  <textarea
                    value={personalMsg}
                    onChange={(e) => setPersonalMsg(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${B.border}`,
                      fontSize: 12,
                      lineHeight: 1.6,
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ fontSize: 10, color: B.light, marginTop: 3 }}>
                    Sent alongside the HMRC invitation. Use {'{name}'} and it will be replaced with the client&apos;s name.
                  </div>
                </div>

                {/* Advanced options */}
                <div style={{ marginBottom: 20 }}>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{
                      fontSize: 12,
                      color: B.primary,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    {showAdvanced ? '▾ Hide' : '▸ Show'} advanced options
                  </button>
                  {showAdvanced && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 16,
                        background: B.surface,
                        borderRadius: 8,
                        border: `1px solid ${B.borderLight}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                      }}
                    >
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 8 }}>
                          Agent type
                        </label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          {[
                            { k: 'main', l: 'Main agent', d: 'Full access' },
                            { k: 'supporting', l: 'Supporting agent', d: 'In-year updates only' },
                          ].map((a) => (
                            <div
                              key={a.k}
                              onClick={() => setAgentType(a.k)}
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                border: `1.5px solid ${agentType === a.k ? B.primary : B.border}`,
                                background: agentType === a.k ? B.blueBg : B.white,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div
                                  style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 7,
                                    border: `2px solid ${agentType === a.k ? B.primary : B.xlight}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {agentType === a.k && (
                                    <div style={{ width: 6, height: 6, borderRadius: 3, background: B.primary }} />
                                  )}
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{a.l}</span>
                              </div>
                              <div style={{ fontSize: 11, color: B.muted, marginTop: 3, paddingLeft: 20 }}>
                                {a.d}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 5 }}>
                          Phone (optional)
                        </label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 07700 900123"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: `1px solid ${B.border}`,
                            fontSize: 13,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {submitError && (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: '10px 14px',
                      background: B.redBg,
                      border: '1px solid #FECACA',
                      borderRadius: 8,
                      fontSize: 12,
                      color: B.redText,
                      lineHeight: 1.5,
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div
                  style={{
                    borderTop: `1px solid ${B.border}`,
                    paddingTop: 20,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 10,
                  }}
                >
                  <button
                    onClick={handleSubmit}
                    disabled={!formComplete || submitting}
                    style={{
                      padding: '10px 24px',
                      borderRadius: 8,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: formComplete && !submitting ? 'pointer' : 'not-allowed',
                      background: formComplete && !submitting ? B.green : B.xlight,
                      color: formComplete && !submitting ? '#fff' : B.muted,
                      transition: 'all 0.2s',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? 'Sending invitation…' : 'Send HMRC invitation'}
                  </button>
                </div>
              </div>
            )}

            {mode === 'single' && sent && sentClient && (
              <div
                style={{
                  background: B.white,
                  borderRadius: 12,
                  border: `1px solid ${B.border}`,
                  padding: '40px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    background: invitationSent ? B.greenBg : B.amberBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 24,
                    border: invitationSent ? '2px solid #A7F3D0' : '1px solid #FDE68A',
                  }}
                >
                  {invitationSent ? '✓' : '!'}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  {invitationSent
                    ? `Invitation sent to ${sentClient.name}`
                    : `Client saved — invitation not sent`}
                </div>
                {invitationSent ? (
                  <>
                    <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>
                      Your personal message and notification email have been sent to {sentClient.email}.
                      The client needs to sign in with their Government Gateway credentials to accept the HMRC request.
                    </div>
                    <div
                      style={{
                        marginTop: 16,
                        padding: '12px 16px',
                        background: B.amberBg,
                        borderRadius: 8,
                        border: '1px solid #FDE68A',
                        fontSize: 12,
                        color: B.amberText,
                      }}
                    >
                      The invitation expires on {fmtDate(sentClient.invitationExpiresAt)}. You&apos;ll be notified when the client accepts.
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: 4,
                      padding: '14px 16px',
                      background: B.amberBg,
                      borderRadius: 8,
                      border: '1px solid #FDE68A',
                      fontSize: 13,
                      color: B.amberText,
                      lineHeight: 1.6,
                      maxWidth: 420,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      textAlign: 'left',
                    }}
                  >
                    <strong>{sentClient.name}</strong> was added to your client list, but the HMRC invitation could not be sent.
                    {sentWarning && (
                      <p style={{ margin: '10px 0 0', fontWeight: 400 }}>{sentWarning}</p>
                    )}
                    <p style={{ margin: '10px 0 0', fontSize: 12, color: B.amberText }}>
                      No email was sent to the client. Fix the issue above, then use Resend on the pending invitations panel.
                    </p>
                  </div>
                )}
                <button
                  onClick={resetForm}
                  style={{
                    marginTop: 20,
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    background: B.white,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: B.text,
                  }}
                >
                  Add another client
                </button>
              </div>
            )}

            {mode === 'bulk' && (
              <div
                style={{
                  background: B.white,
                  borderRadius: 12,
                  border: `1px solid ${B.border}`,
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Bulk import clients</div>
                <div style={{ fontSize: 13, color: B.muted, marginBottom: 20, lineHeight: 1.6 }}>
                  Upload a CSV file with your client NINOs to send multiple invitations at once.
                </div>
                <div
                  style={{
                    border: `2px dashed ${B.border}`,
                    borderRadius: 12,
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: B.surface,
                  }}
                >
                  <div style={{ fontSize: 32, color: B.xlight, marginBottom: 12 }}>+</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    Drop your CSV file here or click to browse
                  </div>
                  <div style={{ fontSize: 12, color: B.light }}>
                    Required columns: NINO, Client name, Postcode, Email
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: `1px solid ${B.border}`,
                      background: 'transparent',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: B.primary,
                    }}
                  >
                    Download CSV template
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Pending invitations */}
            <div
              style={{
                background: B.white,
                borderRadius: 12,
                border: `1px solid ${B.border}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: `1px solid ${B.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>Pending invitations</div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: B.purpleBg,
                    color: B.purpleText,
                    border: '1px solid #DDD6FE',
                  }}
                >
                  {pendingClients.length}
                </span>
              </div>
              <div style={{ padding: '4px 20px 12px' }}>
                {resendPanelError && (
                  <div
                    style={{
                      margin: '8px 0',
                      padding: '8px 10px',
                      background: B.redBg,
                      border: '1px solid #FECACA',
                      borderRadius: 6,
                      fontSize: 11,
                      color: B.redText,
                      lineHeight: 1.5,
                    }}
                  >
                    {resendPanelError}
                  </div>
                )}
                {pendingLoading ? (
                  <div style={{ padding: '16px 0', textAlign: 'center', fontSize: 12, color: B.muted }}>
                    Loading…
                  </div>
                ) : pendingClients.length === 0 ? (
                  <div style={{ padding: '16px 0', textAlign: 'center', fontSize: 12, color: B.light }}>
                    No pending invitations
                  </div>
                ) : (
                  pendingClients.map((inv, i) => (
                    <div
                      key={inv.id}
                      style={{
                        padding: '12px 0',
                        borderBottom: i < pendingClients.length - 1 ? `1px solid ${B.borderLight}` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{inv.name}</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: inv.invitationId ? B.amberBg : B.redBg,
                            color: inv.invitationId ? B.amberText : B.redText,
                          }}
                        >
                          {inv.invitationId ? 'Outstanding' : 'Not sent'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: B.muted, marginTop: 3 }}>
                        {formatNino(inv.nino)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: B.light }}>
                          {inv.invitationSentAt
                            ? `Sent ${fmtDate(inv.invitationSentAt)}${daysLeft(inv.invitationExpiresAt) !== null ? ` — ${daysLeft(inv.invitationExpiresAt)}d left` : ''}`
                            : 'Invitation not sent to HMRC'}
                        </span>
                        <button
                          type="button"
                          disabled={resendingId === inv.id}
                          onClick={() => handleResend(inv)}
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '3px 10px',
                            borderRadius: 6,
                            border: `1px solid ${B.border}`,
                            background: 'transparent',
                            cursor: resendingId === inv.id ? 'not-allowed' : 'pointer',
                            color: B.muted,
                            opacity: resendingId === inv.id ? 0.6 : 1,
                          }}
                        >
                          {resendingId === inv.id ? 'Sending…' : 'Resend'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* How it works */}
            <div
              style={{
                background: B.white,
                borderRadius: 12,
                border: `1px solid ${B.border}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: `1px solid ${B.border}`,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                How the invitation works
              </div>
              <div style={{ padding: '14px 20px' }}>
                {[
                  { n: '1', t: 'You send the invitation', d: 'We create an HMRC authorisation request and send your personal message' },
                  { n: '2', t: 'Client receives email', d: "They get your message plus a separate link from HMRC's Government Gateway" },
                  { n: '3', t: 'Client accepts', d: 'They sign in and confirm — you get notified instantly' },
                  { n: '4', t: 'Client appears on dashboard', d: 'We fetch their business details, obligations, and liabilities' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        background: B.blueBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: B.blueText,
                        flexShrink: 0,
                        border: '1px solid #BAE6FD',
                      }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{s.t}</div>
                      <div style={{ fontSize: 11, color: B.muted, marginTop: 1, lineHeight: 1.5 }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
