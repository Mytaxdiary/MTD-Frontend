'use client'

import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import SettingsToggle from './SettingsToggle'
import { useCurrentUser, userInitials } from '@/components/auth/CurrentUserProvider'
import { teamService, type TeamMember } from '@/services/team.service'
import type { StaffPermissions } from '@/services/auth.service'

const PERMISSION_OPTIONS: { key: keyof StaffPermissions; label: string }[] = [
  { key: 'canAddClients', label: 'Add clients' },
  { key: 'canChase', label: 'Send chases' },
  { key: 'canViewLiabilities', label: 'View liabilities' },
  { key: 'canViewNotes', label: 'View notes' },
  { key: 'canManageTemplates', label: 'Manage chase templates' },
  { key: 'canViewSettings', label: 'View settings' },
  { key: 'canInviteStaff', label: 'Invite staff' },
]

const EMPTY_PERMISSIONS: StaffPermissions = {
  canAddClients: false,
  canChase: false,
  canViewLiabilities: false,
  canViewNotes: false,
  canManageTemplates: false,
  canViewSettings: false,
  canInviteStaff: false,
}

type DialogMode = 'invite' | 'edit' | null

function apiMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}

function enabledPermissionLabels(permissions: StaffPermissions): string[] {
  return PERMISSION_OPTIONS.filter((opt) => permissions[opt.key]).map((opt) => opt.label)
}

export default function TeamSection() {
  const { user } = useCurrentUser()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)
  const [dialog, setDialog] = useState<DialogMode>(null)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [permissions, setPermissions] = useState<StaffPermissions>(EMPTY_PERMISSIONS)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setForbidden(false)
    try {
      setMembers(await teamService.list())
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode
      if (status === 403) {
        setForbidden(true)
        setMembers([])
      } else {
        setError(apiMessage(err, 'Could not load the team list.'))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const openInvite = () => {
    setEditing(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPermissions({ ...EMPTY_PERMISSIONS })
    setDialogError(null)
    setDialog('invite')
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    setFirstName('')
    setLastName('')
    setEmail(member.email)
    setPermissions({ ...EMPTY_PERMISSIONS, ...member.permissions })
    setDialogError(null)
    setDialog('edit')
  }

  const closeDialog = () => {
    if (saving) return
    setDialog(null)
    setEditing(null)
    setDialogError(null)
  }

  const submitDialog = async () => {
    setSaving(true)
    setDialogError(null)
    try {
      if (dialog === 'invite') {
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
          setDialogError('Enter a first name, last name, and email.')
          return
        }
        await teamService.invite({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          permissions,
        })
      } else if (dialog === 'edit' && editing) {
        await teamService.updatePermissions(editing.id, permissions)
      }
      setDialog(null)
      setEditing(null)
      await load()
    } catch (err) {
      setDialogError(apiMessage(err, 'Could not save. Please try again.'))
    } finally {
      setSaving(false)
    }
  }

  const removeMember = async (member: TeamMember) => {
    const pending = member.status === 'pending' || member.kind === 'invite'
    const ok = window.confirm(
      pending
        ? `Cancel the invitation to ${member.name || member.email}?`
        : `Remove ${member.name} from the firm? Their assigned clients will be unassigned.`,
    )
    if (!ok) return
    setBusyId(member.id)
    setError(null)
    try {
      if (pending) await teamService.cancelInvite(member.id)
      else await teamService.removeStaff(member.id)
      await load()
    } catch (err) {
      setError(apiMessage(err, 'Could not remove this team member.'))
    } finally {
      setBusyId(null)
    }
  }

  const setPermission = (key: keyof StaffPermissions, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }))
  }

  const canManage = user?.role !== 'staff' || user.permissions?.canInviteStaff === true

  return (
    <Card>
      <CardHead
        titleSize={16}
        padding="16px 20px"
        title="Team"
        sub="Invite staff and control what they can do"
        right={
          canManage && !forbidden ? (
            <button
              type="button"
              onClick={openInvite}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: B.primary,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Invite team member
            </button>
          ) : null
        }
      />
      <div style={{ padding: '8px 20px 18px' }}>
        {loading ? (
          <div style={{ padding: '14px 0', fontSize: 14, color: B.muted }}>Loading...</div>
        ) : forbidden ? (
          <div style={{ padding: '14px 0', fontSize: 14, color: B.muted }}>
            You do not have permission to manage the team.
          </div>
        ) : (
          <>
            {error && (
              <div style={{ fontSize: 13, color: B.redText, padding: '8px 0 4px' }}>{error}</div>
            )}
            {members.length === 0 ? (
              <div style={{ padding: '14px 0', fontSize: 14, color: B.muted }}>
                No team members yet. Invite someone to get started.
              </div>
            ) : (
              members.map((member, index) => {
                const pending = member.status === 'pending' || member.kind === 'invite'
                const isOwner = member.role === 'owner'
                const isSelf = user?.id === member.id
                const chips = isOwner
                  ? ['All permissions']
                  : enabledPermissionLabels(member.permissions)
                return (
                  <div
                    key={`${member.kind}-${member.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      padding: '14px 0',
                      borderTop: index === 0 ? 'none' : `1px solid ${B.borderLight}`,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        background: B.blueBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        color: B.blueText,
                        border: '1px solid #BAE6FD',
                        flexShrink: 0,
                      }}
                    >
                      {userInitials(member.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: B.muted,
                            padding: '2px 10px',
                            borderRadius: 20,
                            background: B.surface,
                            border: `1px solid ${B.borderLight}`,
                          }}
                        >
                          {isOwner ? 'Owner' : 'Staff'}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '3px 9px',
                            borderRadius: 10,
                            background: pending ? B.amberBg : B.greenBg,
                            color: pending ? B.amberText : B.greenText,
                          }}
                        >
                          {pending ? 'Pending' : 'Active'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: B.light, marginTop: 2 }}>{member.email}</div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 6,
                          marginTop: 8,
                        }}
                      >
                        {chips.length === 0 ? (
                          <span style={{ fontSize: 12, color: B.light }}>No extra permissions</span>
                        ) : (
                          chips.map((label) => (
                            <span
                              key={label}
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                padding: '2px 8px',
                                borderRadius: 8,
                                background: B.surface,
                                border: `1px solid ${B.borderLight}`,
                                color: B.muted,
                              }}
                            >
                              {label}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    {canManage && !isOwner && (
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {!pending && (
                          <button
                            type="button"
                            onClick={() => openEdit(member)}
                            disabled={busyId === member.id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: `1px solid ${B.border}`,
                              background: B.white,
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: 'pointer',
                              color: B.text,
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => void removeMember(member)}
                            disabled={busyId === member.id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: `1px solid #FECACA`,
                              background: B.redBg,
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: busyId === member.id ? 'not-allowed' : 'pointer',
                              color: B.redText,
                            }}
                          >
                            {pending ? 'Cancel invite' : 'Remove'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </>
        )}
      </div>

      {dialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-dialog-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog()
          }}
        >
          <div
            style={{
              background: B.white,
              borderRadius: 12,
              width: 480,
              maxWidth: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${B.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span id="team-dialog-title" style={{ fontWeight: 700, fontSize: 15 }}>
                {dialog === 'invite' ? 'Invite team member' : `Edit permissions · ${editing?.name}`}
              </span>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close"
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
            <div style={{ padding: '16px 20px 20px' }}>
              {dialog === 'invite' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={{ display: 'block' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: B.muted }}>First name</span>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ display: 'block' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: B.muted }}>Last name</span>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ display: 'block', gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: B.muted }}>Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      style={inputStyle}
                    />
                  </label>
                </div>
              )}

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: B.muted,
                  margin: dialog === 'invite' ? '18px 0 4px' : '0 0 4px',
                }}
              >
                Permissions
              </div>
              {PERMISSION_OPTIONS.map((opt) => (
                <SettingsToggle
                  key={opt.key}
                  on={permissions[opt.key]}
                  onChange={(v) => setPermission(opt.key, v)}
                  label={opt.label}
                />
              ))}

              {dialogError && (
                <div style={{ fontSize: 13, color: B.redText, marginTop: 12 }}>{dialogError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={saving}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    background: B.white,
                    fontSize: 13,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    color: B.muted,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void submitDialog()}
                  disabled={saving}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: saving ? B.light : B.primary,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : dialog === 'invite' ? 'Send invite' : 'Save permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 5,
  padding: '9px 12px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  fontSize: 13,
  boxSizing: 'border-box',
  outline: 'none',
}
