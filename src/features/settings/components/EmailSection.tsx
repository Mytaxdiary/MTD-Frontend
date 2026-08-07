'use client'

import { useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import {
  emailConnectionService,
  type EmailConnectionStatus,
  type EmailProvider,
} from '@/services/email-connection.service'

const outlineBtn: React.CSSProperties = {
  padding: '9px 18px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

const primaryBtn: React.CSSProperties = {
  ...outlineBtn,
  background: B.primary,
  border: `1px solid ${B.primary}`,
  color: '#fff',
  fontWeight: 600,
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

function providerLabel(p?: EmailProvider): string {
  if (p === 'gmail') return 'Gmail'
  if (p === 'outlook') return 'Outlook'
  return '—'
}

export default function EmailSection() {
  const [status, setStatus] = useState<EmailConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<EmailProvider | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [disconnectError, setDisconnectError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    emailConnectionService
      .getStatus()
      .then((s) => {
        if (!cancelled) setStatus(s)
      })
      .catch(() => {
        if (!cancelled) setStatus({ connected: false })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleConnect(provider: EmailProvider) {
    setConnecting(provider)
    setConnectError(null)
    try {
      emailConnectionService.rememberProvider(provider)
      const authUrl = await emailConnectionService.getConnectUrl(provider)
      window.location.href = authUrl
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ??
        (err as { message?: string })?.message ??
        `Could not start ${providerLabel(provider)} connection.`
      setConnectError(msg)
      setConnecting(null)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    setConnectError(null)
    try {
      const latest = await emailConnectionService.refreshToken()
      setStatus(latest)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ??
        (err as { message?: string })?.message ??
        'Failed to refresh token.'
      setConnectError(msg)
    } finally {
      setRefreshing(false)
    }
  }

  const connected = status?.connected === true

  return (
    <>
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
              Disconnect email?
            </div>
            <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
              Client emails will send from the My Tax Diary system address until you reconnect
              Gmail or Outlook.
            </div>
            {disconnectError && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 14px',
                  background: B.redBg,
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  fontSize: 13,
                  color: B.redText,
                }}
              >
                {disconnectError}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                style={outlineBtn}
                onClick={() => {
                  setShowModal(false)
                  setDisconnectError(null)
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: '1px solid #FECACA',
                  background: B.redBg,
                  fontSize: 13,
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
                    await emailConnectionService.disconnect()
                    setStatus({ connected: false })
                    setShowModal(false)
                  } catch (err: unknown) {
                    const msg =
                      (err as { response?: { data?: { message?: string } } })?.response?.data
                        ?.message ??
                      (err as { message?: string })?.message ??
                      'Failed to disconnect.'
                    setDisconnectError(msg)
                  } finally {
                    setDisconnecting(false)
                  }
                }}
              >
                {disconnecting ? 'Disconnecting…' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHead
          title="Email connection"
          right={
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 20,
                background: connected ? B.greenBg : B.surface,
                color: connected ? B.greenText : B.muted,
                border: `1px solid ${connected ? '#A7F3D0' : B.borderLight}`,
              }}
            >
              {loading ? '…' : connected ? 'Connected' : 'Not connected'}
            </span>
          }
        />
        <div style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 13, color: B.muted, margin: '0 0 16px', lineHeight: 1.55 }}>
            Connect your Gmail or Outlook mailbox so chase, invitation, and portal emails to
            clients send from your address. If disconnected, emails fall back to the My Tax Diary
            system sender.
          </p>

          {connectError && (
            <div
              style={{
                marginBottom: 14,
                padding: '10px 14px',
                background: B.redBg,
                border: '1px solid #FECACA',
                borderRadius: 8,
                fontSize: 13,
                color: B.redText,
              }}
            >
              {connectError}
            </div>
          )}

          {connected ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  gap: '10px 16px',
                  fontSize: 13,
                  marginBottom: 18,
                }}
              >
                <span style={{ color: B.muted }}>Provider</span>
                <span style={{ fontWeight: 600 }}>{providerLabel(status?.provider)}</span>
                <span style={{ color: B.muted }}>Mailbox</span>
                <span style={{ fontWeight: 600 }}>{status?.emailAddress ?? '—'}</span>
                <span style={{ color: B.muted }}>Connected since</span>
                <span>{fmt(status?.connectedAt)}</span>
                <span style={{ color: B.muted }}>Token expires</span>
                <span>{fmt(status?.accessTokenExpiresAt)}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button
                  type="button"
                  style={outlineBtn}
                  disabled={refreshing}
                  onClick={() => void handleRefresh()}
                >
                  {refreshing ? 'Refreshing…' : 'Refresh token'}
                </button>
                <button type="button" style={outlineBtn} onClick={() => setShowModal(true)}>
                  Disconnect
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button
                type="button"
                style={primaryBtn}
                disabled={!!connecting || loading}
                onClick={() => void handleConnect('gmail')}
              >
                {connecting === 'gmail' ? 'Redirecting…' : 'Connect Gmail'}
              </button>
              <button
                type="button"
                style={outlineBtn}
                disabled={!!connecting || loading}
                onClick={() => void handleConnect('outlook')}
              >
                {connecting === 'outlook' ? 'Redirecting…' : 'Connect Outlook'}
              </button>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
