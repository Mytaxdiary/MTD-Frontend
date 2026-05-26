'use client'
import { useEffect, useRef, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import { hmrcService, type HmrcStatus } from '@/services/hmrc.service'

const API_SUBSCRIPTIONS = [
  { api: 'SA Individual Details v2.0', s: 'live' },
  { api: 'Business Details v2.0', s: 'live' },
  { api: 'Agent Authorisation v1.0', s: 'live' },
  { api: 'Obligations v3.0', s: 'live' },
  { api: 'Self-Employment Business v4.0', s: 'live' },
  { api: 'Property Business v5.0', s: 'live' },
  { api: 'BISS v3.0', s: 'live' },
  { api: 'SA Accounts v3.0', s: 'live' },
  { api: 'Individual Calculations v8.0', s: 'pending' },
]

const outlineBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

function fmt(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function tokenStatusLabel(status?: HmrcStatus): string {
  if (!status?.connected) return 'Inactive'
  const expires = status.accessTokenExpiresAt ? new Date(status.accessTokenExpiresAt) : null
  if (expires && expires < new Date()) return 'Expired'
  return 'Active'
}

/** ARN is rendered separately as an editable row — excluded from this list */
function buildRows(status: HmrcStatus | null): [string, string][] {
  if (!status?.connected) {
    return [
      ['Gateway ID', '—'],
      ['Token status', 'Inactive'],
      ['Token expires', '—'],
      ['Refresh expires', '—'],
      ['Connected since', '—'],
      ['Fraud headers', '—'],
    ]
  }
  return [
    ['Gateway ID', '—'],
    ['Token status', tokenStatusLabel(status)],
    ['Token expires', fmt(status.accessTokenExpiresAt)],
    ['Refresh expires', fmtDate(status.refreshTokenExpiresAt)],
    ['Connected since', fmtDate(status.connectedAt)],
    ['Fraud headers', 'Not tested yet'],
  ]
}

export default function HmrcSection() {
  const [hmrcStatus, setHmrcStatus] = useState<HmrcStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [disconnectError, setDisconnectError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [refreshSuccess, setRefreshSuccess] = useState(false)

  // ARN inline edit state
  const [arnEditing, setArnEditing] = useState(false)
  const [arnInput, setArnInput] = useState('')
  const [arnSaving, setArnSaving] = useState(false)
  const [arnError, setArnError] = useState<string | null>(null)
  const arnInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    hmrcService
      .getStatus()
      .then((s) => setHmrcStatus(s))
      .catch(() => setHmrcStatus({ connected: false }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (arnEditing) arnInputRef.current?.focus()
  }, [arnEditing])

  const connected = hmrcStatus?.connected ?? false
  const rows = buildRows(hmrcStatus)

  async function handleSaveArn() {
    const trimmed = arnInput.trim()
    if (!trimmed) return
    setArnSaving(true)
    setArnError(null)
    try {
      const result = await hmrcService.updateArn(trimmed)
      setHmrcStatus((prev) => prev ? { ...prev, arn: result.arn } : prev)
      setArnEditing(false)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Failed to save ARN.'
      setArnError(msg)
    } finally {
      setArnSaving(false)
    }
  }

  async function handleRefreshToken() {
    setRefreshing(true)
    setRefreshError(null)
    setRefreshSuccess(false)
    try {
      await hmrcService.refreshToken()
      const latest = await hmrcService.getStatus()
      setHmrcStatus(latest)
      setRefreshSuccess(true)
      setTimeout(() => setRefreshSuccess(false), 3000)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Failed to refresh HMRC token. You may need to reconnect HMRC.'
      setRefreshError(msg)
    } finally {
      setRefreshing(false)
    }
  }

  async function handleConnect() {
    setConnecting(true)
    setConnectError(null)
    try {
      const authUrl = await hmrcService.getConnectUrl()
      window.location.href = authUrl
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ??
        (err as { message?: string })?.message ??
        'Could not start HMRC connection.'
      setConnectError(msg)
      setConnecting(false)
    }
  }

  return (
    <>
      {/* ── Disconnect confirmation modal ── */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: B.white,
              borderRadius: 12,
              padding: '28px 28px 24px',
              width: 400,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: B.text, marginBottom: 10 }}>
              Disconnect HMRC?
            </div>
            <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
              Disconnecting will remove the active HMRC connection for this firm. You can reconnect
              later when needed.
            </div>
            {disconnectError && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '8px 12px',
                  background: B.redBg,
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  fontSize: 12,
                  color: B.redText,
                }}
              >
                {disconnectError}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button style={outlineBtn} onClick={() => { setShowModal(false); setDisconnectError(null) }}>
                Cancel
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #FECACA',
                  background: B.redBg,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: disconnecting ? 'not-allowed' : 'pointer',
                  color: B.redText,
                  opacity: disconnecting ? 0.7 : 1,
                }}
                disabled={disconnecting}
                onClick={async () => {
                  setDisconnecting(true)
                  setDisconnectError(null)
                  try {
                    await hmrcService.disconnect()
                    setHmrcStatus({ connected: false })
                    setShowModal(false)
                  } catch (err: unknown) {
                    const msg =
                      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                      (err as { message?: string })?.message ??
                      'Failed to disconnect. Please try again.'
                    setDisconnectError(msg)
                  } finally {
                    setDisconnecting(false)
                  }
                }}
              >
                {disconnecting ? 'Disconnecting…' : 'Disconnect HMRC'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardHead
            titleSize={15}
            padding="16px 20px"
            title="HMRC connection status"
            sub="OAuth 2.0 via Government Gateway"
          />
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: B.muted, fontSize: 13 }}>
                Loading…
              </div>
            ) : (
              <>
                {/* Status banner */}
                {connected ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 20,
                      padding: '14px 16px',
                      background: B.greenBg,
                      borderRadius: 10,
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: B.green }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: B.greenText }}>
                        Connected to HMRC
                      </div>
                      <div style={{ fontSize: 11, color: '#047857' }}>
                        Agent Services Account linked and active
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 20,
                      padding: '14px 16px',
                      background: B.surface,
                      borderRadius: 10,
                      border: `1px solid ${B.border}`,
                    }}
                  >
                    <div
                      style={{ width: 10, height: 10, borderRadius: 5, background: B.light }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>
                        Not connected to HMRC
                      </div>
                      <div style={{ fontSize: 11, color: B.muted }}>
                        No active Government Gateway connection
                      </div>
                    </div>
                  </div>
                )}

                {/* ARN row — editable when connected */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: `1px solid ${B.borderLight}`,
                  }}
                >
                  <span style={{ fontSize: 12, color: B.muted }}>ARN</span>
                  {!connected ? (
                    <span style={{ fontSize: 12, fontWeight: 500, color: B.light }}>—</span>
                  ) : arnEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        ref={arnInputRef}
                        value={arnInput}
                        onChange={(e) => setArnInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveArn()
                          if (e.key === 'Escape') { setArnEditing(false); setArnError(null) }
                        }}
                        placeholder="e.g. EARN0713416"
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: `1px solid ${arnError ? '#FECACA' : B.border}`,
                          outline: 'none',
                          width: 160,
                        }}
                      />
                      <button
                        onClick={handleSaveArn}
                        disabled={arnSaving || !arnInput.trim()}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: 'none',
                          background: arnSaving || !arnInput.trim() ? B.light : B.primary,
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: arnSaving || !arnInput.trim() ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {arnSaving ? '…' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setArnEditing(false); setArnError(null) }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: `1px solid ${B.border}`,
                          background: B.white,
                          fontSize: 11,
                          cursor: 'pointer',
                          color: B.muted,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {hmrcStatus?.arn ? (
                        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>
                          {hmrcStatus.arn}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: B.amberText, fontWeight: 500 }}>
                          Not set
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setArnInput(hmrcStatus?.arn ?? '')
                          setArnEditing(true)
                        }}
                        title="Edit ARN"
                        style={{
                          padding: '2px 6px',
                          borderRadius: 5,
                          border: `1px solid ${B.border}`,
                          background: B.surface,
                          fontSize: 11,
                          cursor: 'pointer',
                          color: B.muted,
                          lineHeight: 1,
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                {arnError && (
                  <div style={{ fontSize: 11, color: B.redText, marginBottom: 4, textAlign: 'right' }}>
                    {arnError}
                  </div>
                )}

                {/* Remaining connection detail rows */}
                {rows.map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: i < rows.length - 1 ? `1px solid ${B.borderLight}` : 'none',
                    }}
                  >
                    <span style={{ fontSize: 12, color: B.muted }}>{k}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: v === '—' || v === 'Inactive' ? B.light : 'inherit',
                        fontFamily: k === 'Gateway ID' ? 'monospace' : 'inherit',
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}

                {connectError && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      background: B.redBg,
                      border: '1px solid #FECACA',
                      borderRadius: 8,
                      fontSize: 12,
                      color: B.redText,
                    }}
                  >
                    {connectError}
                  </div>
                )}

                {/* Refresh feedback */}
                {refreshError && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      background: B.redBg,
                      border: '1px solid #FECACA',
                      borderRadius: 8,
                      fontSize: 12,
                      color: B.redText,
                    }}
                  >
                    {refreshError}
                  </div>
                )}
                {refreshSuccess && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      background: B.greenBg,
                      border: '1px solid #A7F3D0',
                      borderRadius: 8,
                      fontSize: 12,
                      color: B.greenText,
                    }}
                  >
                    HMRC access token refreshed successfully.
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  {connected ? (
                    <>
                      <button
                        style={{
                          ...outlineBtn,
                          cursor: refreshing ? 'not-allowed' : 'pointer',
                          opacity: refreshing ? 0.7 : 1,
                        }}
                        onClick={handleRefreshToken}
                        disabled={refreshing}
                      >
                        {refreshing ? 'Refreshing…' : 'Refresh token'}
                      </button>
                      <button style={outlineBtn} disabled>
                        Test fraud headers
                      </button>
                      <button
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          border: '1px solid #FECACA',
                          background: B.redBg,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          color: B.redText,
                        }}
                        onClick={() => setShowModal(true)}
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: connecting ? B.light : B.primary,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: connecting ? 'not-allowed' : 'pointer',
                        color: '#fff',
                        opacity: connecting ? 0.7 : 1,
                      }}
                      onClick={handleConnect}
                      disabled={connecting}
                    >
                      {connecting ? 'Redirecting to HMRC…' : 'Connect to HMRC'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <CardHead titleSize={15} padding="16px 20px" title="API subscriptions" />
          <div style={{ padding: '8px 20px 14px' }}>
            {API_SUBSCRIPTIONS.map((a, i) => (
              <div
                key={a.api}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 0',
                  borderBottom:
                    i < API_SUBSCRIPTIONS.length - 1 ? `1px solid ${B.borderLight}` : 'none',
                }}
              >
                <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{a.api}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: a.s === 'live' ? B.greenBg : B.amberBg,
                    color: a.s === 'live' ? B.greenText : B.amberText,
                  }}
                >
                  {a.s === 'live' ? 'Production' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
