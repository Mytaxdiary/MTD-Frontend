'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import {
  clientsService,
  type PortalCustomerRecord,
} from '@/services/clients.service'

function fmtDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function portalStatusLabel(c: PortalCustomerRecord): string {
  if (c.portalActive) return 'Active'
  if (c.setupPending) return 'Invite pending'
  return 'Invite expired'
}

function portalStatusStyle(c: PortalCustomerRecord): React.CSSProperties {
  if (c.portalActive) {
    return { background: B.greenBg, color: B.greenText, border: '1px solid #A7F3D0' }
  }
  if (c.setupPending) {
    return { background: B.amberBg, color: B.amberText, border: '1px solid #FDE68A' }
  }
  return { background: B.surface, color: B.muted, border: `1px solid ${B.border}` }
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

const btnDanger: React.CSSProperties = {
  ...btnOutline,
  color: '#991B1B',
  border: '1px solid #FECACA',
}

export default function CustomerManagementSection() {
  const [customers, setCustomers] = useState<PortalCustomerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCustomers(await clientsService.listPortalCustomers())
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Could not load portal customers.')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleResend(customer: PortalCustomerRecord) {
    setActionId(`resend-${customer.id}`)
    setError(null)
    setSuccessMsg(null)
    try {
      const result = await clientsService.resendPortalInvite(customer.id)
      setSuccessMsg(result.message)
      await load()
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to resend invite.')
    } finally {
      setActionId(null)
    }
  }

  async function handleRemove(customer: PortalCustomerRecord) {
    setActionId(`remove-${customer.id}`)
    setError(null)
    setSuccessMsg(null)
    try {
      const result = await clientsService.removePortalAccess(customer.id)
      setSuccessMsg(result.message)
      setConfirmRemoveId(null)
      await load()
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to remove portal access.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <Card>
      <CardHead
        titleSize={16}
        padding="16px 20px"
        title="Customer management"
        sub="Portal customers who can sign in to view liabilities and messages. Resend invites or remove access."
      />

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
        {loading ? (
          <div style={{ fontSize: 14, color: B.muted }}>Loading customers…</div>
        ) : customers.length === 0 ? (
          <div style={{ fontSize: 14, color: B.muted, lineHeight: 1.5 }}>
            No portal customers yet. Use <strong>Invite client</strong> in the sidebar to send a
            portal-only invite.
          </div>
        ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.border}`, textAlign: 'left' }}>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}>Name</th>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}>Email</th>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}>Type</th>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}>Status</th>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}>Invited</th>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}>Last login</th>
                <th style={{ padding: '10px 8px', fontWeight: 600, color: B.muted }}></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${B.border}` }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '12px 8px', color: B.muted }}>{c.email}</td>
                  <td style={{ padding: '12px 8px', color: B.muted }}>
                    {c.portalOnly ? 'Portal only' : 'HMRC client'}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span
                      style={{
                        ...portalStatusStyle(c),
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {portalStatusLabel(c)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', color: B.muted }}>{fmtDate(c.invitedAt)}</td>
                  <td style={{ padding: '12px 8px', color: B.muted }}>{fmtDate(c.lastLoginAt)}</td>
                  <td style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      {!c.portalActive && (
                        <button
                          type="button"
                          style={btnPrimary}
                          disabled={actionId !== null}
                          onClick={() => void handleResend(c)}
                        >
                          {actionId === `resend-${c.id}` ? 'Sending…' : 'Resend invite'}
                        </button>
                      )}
                      {confirmRemoveId === c.id ? (
                        <>
                          <button
                            type="button"
                            style={btnDanger}
                            disabled={actionId !== null}
                            onClick={() => void handleRemove(c)}
                          >
                            {actionId === `remove-${c.id}` ? 'Removing…' : 'Confirm remove'}
                          </button>
                          <button
                            type="button"
                            style={btnOutline}
                            disabled={actionId !== null}
                            onClick={() => setConfirmRemoveId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          style={btnOutline}
                          disabled={actionId !== null}
                          onClick={() => setConfirmRemoveId(c.id)}
                        >
                          Remove access
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </Card>
  )
}
