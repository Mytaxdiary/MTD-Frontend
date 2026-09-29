'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import B from '@/styles/theme'
import { adminService, type AdminFirmDetail } from '@/services/admin.service'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function formatShortDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: 12,
        padding: '12px 0',
        borderBottom: `1px solid ${B.borderLight}`,
        fontSize: 14,
      }}
    >
      <div style={{ color: B.muted, fontWeight: 500 }}>{label}</div>
      <div style={{ color: B.text }}>{value ?? '—'}</div>
    </div>
  )
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 999,
        background: active ? B.greenBg : B.redBg,
        color: active ? B.greenText : B.redText,
      }}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

export default function AdminFirmDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [firm, setFirm] = useState<AdminFirmDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [showDeactivate, setShowDeactivate] = useState(false)
  const [showForceLogoutAll, setShowForceLogoutAll] = useState(false)
  const [forceLogoutUserId, setForceLogoutUserId] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getFirm(id)
      setFirm(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load firm')
      setFirm(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const activate = async () => {
    if (!id) return
    setToggling(true)
    setActionError(null)
    setActionMsg(null)
    try {
      const updated = await adminService.setFirmActive(id, { isActive: true })
      setFirm(updated)
      setShowDeactivate(false)
      setReason('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to activate firm')
    } finally {
      setToggling(false)
    }
  }

  const deactivate = async () => {
    if (!id) return
    setToggling(true)
    setActionError(null)
    setActionMsg(null)
    try {
      const updated = await adminService.setFirmActive(id, {
        isActive: false,
        reason: reason.trim() || undefined,
      })
      setFirm(updated)
      setShowDeactivate(false)
      setReason('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to deactivate firm')
    } finally {
      setToggling(false)
    }
  }

  const forceLogoutAll = async () => {
    if (!id) return
    setToggling(true)
    setActionError(null)
    setActionMsg(null)
    try {
      const updated = await adminService.invalidateFirmSessions(id)
      setFirm(updated)
      setShowForceLogoutAll(false)
      setActionMsg('All users on this firm have been signed out.')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to force logout')
    } finally {
      setToggling(false)
    }
  }

  const forceLogoutUser = async (userId: string) => {
    if (!id) return
    setToggling(true)
    setActionError(null)
    setActionMsg(null)
    try {
      const updated = await adminService.invalidateUserSessions(id, userId)
      setFirm(updated)
      setForceLogoutUserId(null)
      setActionMsg('User has been signed out.')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to force logout user')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      <Link
        href="/admin/firms"
        style={{
          fontSize: 13,
          color: B.link,
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: 16,
        }}
      >
        ← Back to firms
      </Link>

      {loading && <div style={{ color: B.muted }}>Loading…</div>}
      {error && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {firm && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: B.text }}>
                  {firm.firmName}
                </h1>
                <StatusPill active={firm.isActive} />
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: B.muted }}>
                Firm details, users, and HMRC connection status.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setShowForceLogoutAll(true)
                  setShowDeactivate(false)
                  setActionError(null)
                  setActionMsg(null)
                }}
                disabled={toggling}
                style={{
                  padding: '9px 14px',
                  borderRadius: 8,
                  border: `1px solid ${B.border}`,
                  background: B.white,
                  color: B.text,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Force logout all
              </button>
              {firm.isActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowDeactivate(true)
                    setShowForceLogoutAll(false)
                    setActionError(null)
                    setActionMsg(null)
                  }}
                  disabled={toggling}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 8,
                    border: `1px solid ${B.red}`,
                    background: B.white,
                    color: B.redText,
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Deactivate firm
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void activate()}
                  disabled={toggling}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: B.primaryBtn,
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: toggling ? 'not-allowed' : 'pointer',
                  }}
                >
                  {toggling ? 'Activating…' : 'Activate firm'}
                </button>
              )}
            </div>
          </div>

          {actionError && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: B.redBg,
                color: B.redText,
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {actionError}
            </div>
          )}

          {actionMsg && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: B.greenBg,
                color: B.greenText,
                fontSize: 13,
                marginBottom: 14,
                fontWeight: 600,
              }}
            >
              {actionMsg}
            </div>
          )}

          {!firm.isActive && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: B.amberBg,
                color: B.amberText,
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              This firm is deactivated. Users cannot sign in.
              {firm.deactivatedAt && <> Deactivated {formatDate(firm.deactivatedAt)}.</>}
              {firm.deactivationReason && (
                <>
                  <br />
                  <strong>Reason:</strong> {firm.deactivationReason}
                </>
              )}
            </div>
          )}

          {showForceLogoutAll && (
            <div
              style={{
                background: B.white,
                border: `1px solid ${B.border}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                boxShadow: B.cardShadow,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: B.text }}>
                Force logout all users?
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: B.muted, lineHeight: 1.5 }}>
                Signs out every user on this firm immediately. The firm stays active and they can
                sign in again. Use this if an account may be compromised.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowForceLogoutAll(false)}
                  disabled={toggling}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    background: B.white,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void forceLogoutAll()}
                  disabled={toggling}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: B.primaryBtn,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: toggling ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                  }}
                >
                  {toggling ? 'Signing out…' : 'Confirm force logout'}
                </button>
              </div>
            </div>
          )}

          {showDeactivate && (
            <div
              style={{
                background: B.white,
                border: `1px solid ${B.border}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                boxShadow: B.cardShadow,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: B.text }}>
                Deactivate this firm?
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: B.muted, lineHeight: 1.5 }}>
                All users under this firm will be signed out and blocked from logging in. You can
                reactivate later.
              </p>
              <label
                style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: B.muted, marginBottom: 6 }}
              >
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g. Billing issue, support request, suspected abuse…"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${B.border}`,
                  fontSize: 13.5,
                  resize: 'vertical',
                  marginBottom: 12,
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeactivate(false)
                    setReason('')
                  }}
                  disabled={toggling}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    background: B.white,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void deactivate()}
                  disabled={toggling}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: B.red,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: toggling ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                  }}
                >
                  {toggling ? 'Deactivating…' : 'Confirm deactivate'}
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12,
              marginBottom: 18,
            }}
          >
            {[
              { label: 'Users', value: firm.userCount },
              { label: 'Clients', value: firm.clientCount },
              {
                label: 'HMRC',
                value: firm.hmrcConnected ? 'Connected' : 'Not connected',
              },
              { label: 'Last login', value: formatShortDate(firm.lastLoginAt) },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: B.white,
                  border: `1px solid ${B.border}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  boxShadow: B.cardShadow,
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 600, color: B.muted, marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.text }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: B.white,
              border: `1px solid ${B.border}`,
              borderRadius: 12,
              padding: '8px 20px',
              boxShadow: B.cardShadow,
              marginBottom: 18,
            }}
          >
            <Row label="Owner email" value={firm.ownerEmail} />
            <Row label="Contact name" value={firm.contactName} />
            <Row label="Contact email" value={firm.contactEmail} />
            <Row label="Phone" value={firm.phone} />
            <Row
              label="Address"
              value={[firm.address, firm.postcode].filter(Boolean).join(', ') || null}
            />
            <Row label="Plan" value={firm.plan ?? '—'} />
            <Row label="Created" value={formatDate(firm.createdAt)} />
            <Row
              label="HMRC status"
              value={
                firm.hmrcConnected
                  ? `Connected${firm.hmrcConnectedAt ? ` · ${formatShortDate(firm.hmrcConnectedAt)}` : ''}`
                  : firm.hmrcStatus
                    ? firm.hmrcStatus
                    : 'Not connected'
              }
            />
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px', color: B.text }}>
            Users
          </h2>
          <div
            style={{
              background: B.white,
              border: `1px solid ${B.border}`,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: B.cardShadow,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: B.surface, textAlign: 'left' }}>
                  {['Name', 'Email', 'Role', 'Status', 'Last login', ''].map((h) => (
                    <th
                      key={h || 'actions'}
                      style={{
                        padding: '10px 14px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: B.muted,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${B.borderLight}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firm.users.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 20, color: B.muted }}>
                      No users on this firm.
                    </td>
                  </tr>
                )}
                {firm.users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '12px 14px', color: B.muted }}>{u.email}</td>
                    <td style={{ padding: '12px 14px', textTransform: 'capitalize' }}>{u.role}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusPill active={u.isActive} />
                    </td>
                    <td style={{ padding: '12px 14px', color: B.muted }}>
                      {formatShortDate(u.lastLoginAt)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {forceLogoutUserId === u.id ? (
                        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setForceLogoutUserId(null)}
                            disabled={toggling}
                            style={{
                              padding: '5px 10px',
                              borderRadius: 6,
                              border: `1px solid ${B.border}`,
                              background: B.white,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => void forceLogoutUser(u.id)}
                            disabled={toggling}
                            style={{
                              padding: '5px 10px',
                              borderRadius: 6,
                              border: 'none',
                              background: B.primaryBtn,
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: toggling ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {toggling ? '…' : 'Confirm'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setForceLogoutUserId(u.id)
                            setActionError(null)
                            setActionMsg(null)
                          }}
                          disabled={toggling}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 6,
                            border: `1px solid ${B.border}`,
                            background: B.white,
                            fontSize: 12,
                            fontWeight: 600,
                            color: B.muted,
                            cursor: 'pointer',
                          }}
                        >
                          Force logout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
