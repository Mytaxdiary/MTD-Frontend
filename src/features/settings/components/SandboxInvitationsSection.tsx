'use client'
import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import { clientsService, type ClientRecord } from '@/services/clients.service'

function fmtDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pending',
    'partial-auth': 'Partial auth',
    accepted: 'Authorised',
    rejected: 'Rejected',
    expired: 'Expired',
    cancelled: 'Cancelled',
    deauthorised: 'Deauthorised',
  }
  return labels[status] ?? status
}

function statusStyle(status: string): React.CSSProperties {
  if (status !== 'pending' && status !== 'accepted' && status !== 'partial-auth') {
    return { background: B.surface, color: B.text, border: `1px solid ${B.border}` }
  }
  if (status === 'accepted') {
    return { background: B.greenBg, color: B.greenText, border: '1px solid #A7F3D0' }
  }
  if (status === 'partial-auth') {
    return { background: B.amberBg, color: B.amberText, border: '1px solid #FDE68A' }
  }
  return { background: B.purpleBg, color: B.purpleText, border: '1px solid #DDD6FE' }
}

const btnPrimary: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 8,
  border: 'none',
  background: B.primary,
  color: '#fff',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
}

const btnOutline: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

export default function SandboxInvitationsSection() {
  const [invitations, setInvitations] = useState<ClientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await clientsService.listOutstandingInvitations()
      setInvitations(data)
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to load invitations.')
      setInvitations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleAccept(client: ClientRecord) {
    setActionId(client.id)
    setError(null)
    setSuccessMsg(null)
    try {
      const updated = await clientsService.acceptInvitationSandbox(client.id)
      setSuccessMsg(
        `${updated.name} — HMRC status is now "${statusLabel(updated.invitationStatus)}". Check the client list.`,
      )
      await load()
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to accept invitation.')
    } finally {
      setActionId(null)
    }
  }

  async function handleRefresh(client: ClientRecord) {
    setActionId(`refresh-${client.id}`)
    setError(null)
    try {
      await clientsService.checkInvitationStatus(client.id)
      await load()
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to refresh status.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <Card>
      <CardHead
        titleSize={15}
        padding="16px 20px"
        title="Sandbox invitations"
        sub="HMRC test environment only — simulates a client accepting your authorisation invite (Postman step 9)"
      />

      <div
        style={{
          margin: '0 20px 16px',
          padding: '12px 14px',
          borderRadius: 8,
          background: B.amberBg,
          border: '1px solid #FDE68A',
          fontSize: 12,
          color: B.amberText,
          lineHeight: 1.5,
        }}
      >
        When you send an invitation from Add Client, it appears here. Use <strong>Accept (sandbox)</strong>{' '}
        instead of Postman — then refresh the client list to see Authorised / Partial auth status.
      </div>

      {successMsg && (
        <div
          style={{
            margin: '0 20px 12px',
            padding: '10px 14px',
            borderRadius: 8,
            background: B.greenBg,
            color: B.greenText,
            fontSize: 12,
          }}
        >
          {successMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            margin: '0 20px 12px',
            padding: '10px 14px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button type="button" style={btnOutline} onClick={() => load()} disabled={loading}>
            Refresh list
          </button>
        </div>

        {loading ? (
          <div style={{ fontSize: 13, color: B.muted }}>Loading invitations…</div>
        ) : invitations.length === 0 ? (
          <div style={{ fontSize: 13, color: B.muted }}>
            No outstanding invitations. Send one from Clients → Add client.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {invitations.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: `1px solid ${B.border}`,
                  background: B.white,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{inv.name}</div>
                  <div style={{ fontSize: 12, color: B.muted, marginTop: 4 }}>
                    NINO {inv.nino} · Sent {fmtDate(inv.invitationSentAt)}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: B.muted,
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    Invitation ID: {inv.invitationId}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 20,
                    ...statusStyle(inv.invitationStatus),
                  }}
                >
                  {statusLabel(inv.invitationStatus)}
                </span>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    type="button"
                    style={btnOutline}
                    disabled={actionId !== null}
                    onClick={() => handleRefresh(inv)}
                  >
                    {actionId === `refresh-${inv.id}` ? 'Checking…' : 'Check status'}
                  </button>
                  <button
                    type="button"
                    style={{
                      ...btnPrimary,
                      opacity: actionId === inv.id ? 0.7 : 1,
                      cursor: actionId === inv.id ? 'not-allowed' : 'pointer',
                    }}
                    disabled={actionId !== null}
                    onClick={() => handleAccept(inv)}
                  >
                    {actionId === inv.id ? 'Accepting…' : 'Accept (sandbox)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
