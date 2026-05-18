'use client'
import { useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'

const CONNECTED_ROWS = [
  ['ARN', 'AARN1234567'],
  ['Gateway ID', '12 34 56 78 90 12'],
  ['Token status', 'Active — refreshed 2hr ago'],
  ['Token expires', '24 Apr 2026 at 18:42'],
  ['Refresh expires', '15 Sep 2026'],
  ['Connected since', '15 Mar 2025'],
  ['Fraud headers', 'Validated'],
]

const DISCONNECTED_ROWS = [
  ['ARN', '—'],
  ['Gateway ID', '—'],
  ['Token status', 'Inactive'],
  ['Token expires', '—'],
  ['Refresh expires', '—'],
  ['Connected since', '—'],
  ['Fraud headers', '—'],
]

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

export default function HmrcSection() {
  const [connected, setConnected] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const rows = connected ? CONNECTED_ROWS : DISCONNECTED_ROWS

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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button style={outlineBtn} onClick={() => setShowModal(false)}>
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
                  cursor: 'pointer',
                  color: B.redText,
                }}
                onClick={() => {
                  setConnected(false)
                  setShowModal(false)
                }}
              >
                Disconnect HMRC
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
                <div style={{ width: 10, height: 10, borderRadius: 5, background: B.light }} />
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

            {/* Connection detail rows */}
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
                    fontFamily: k === 'ARN' || k === 'Gateway ID' ? 'monospace' : 'inherit',
                  }}
                >
                  {v}
                </span>
              </div>
            ))}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {connected ? (
                <>
                  <button style={outlineBtn}>Refresh token</button>
                  <button style={outlineBtn}>Test fraud headers</button>
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
                    background: B.primary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                  onClick={() => setConnected(true)}
                >
                  Connect to HMRC
                </button>
              )}
            </div>
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
