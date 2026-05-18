'use client'
import { useState, useEffect, useCallback } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import SettingsToggle from './SettingsToggle'
import notificationsService, { type NotificationPrefs } from '@/services/notifications.service'

const DEFAULTS: NotificationPrefs = {
  chaseEmail: true,
  chaseSms: false,
  overdueAlert: true,
  deadlineReminder: true,
  inviteAccepted: true,
  liabilityAlert: true,
  reminderDays: 14,
}

export default function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULTS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await notificationsService.getPrefs()
      setPrefs(data)
    } catch {
      setError('Failed to load preferences.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const set = <K extends keyof NotificationPrefs>(key: K, val: NotificationPrefs[K]) =>
    setPrefs((p) => ({ ...p, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const updated = await notificationsService.updatePrefs(prefs)
      setPrefs(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save preferences.')
    } finally {
      setSaving(false)
    }
  }

  const groupLabel = (text: string, mt = 4) => (
    <div style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 8, marginTop: mt }}>
      {text}
    </div>
  )

  return (
    <Card>
      <CardHead
        titleSize={15}
        padding="16px 20px"
        title="Notification preferences"
        sub="Control how and when you receive alerts"
      />
      <div style={{ padding: '12px 20px 20px' }}>
        {loading ? (
          <div style={{ fontSize: 13, color: B.muted, padding: '12px 0' }}>Loading…</div>
        ) : (
          <>
            {groupLabel('Chase delivery channels')}
            <SettingsToggle on={prefs.chaseEmail} onChange={(v) => set('chaseEmail', v)} label="Send client chases via email" />
            <SettingsToggle on={prefs.chaseSms} onChange={(v) => set('chaseSms', v)} label="Send client chases via SMS" />
            <div
              style={{
                fontSize: 10,
                color: B.light,
                padding: '6px 0 0',
                borderBottom: `1px solid ${B.borderLight}`,
              }}
            >
              Per-client channel overrides are available in the chase manager
            </div>

            {groupLabel('Agent alerts', 20)}
            <SettingsToggle on={prefs.overdueAlert} onChange={(v) => set('overdueAlert', v)} label="Email me when a client obligation becomes overdue" />
            <SettingsToggle on={prefs.deadlineReminder} onChange={(v) => set('deadlineReminder', v)} label="Email me before upcoming deadlines" />
            <SettingsToggle on={prefs.inviteAccepted} onChange={(v) => set('inviteAccepted', v)} label="Notify me when a client accepts an invitation" isNew />
            <SettingsToggle on={prefs.liabilityAlert} onChange={(v) => set('liabilityAlert', v)} label="Alert me when a client has overdue HMRC liabilities" isNew />

            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.muted,
                  display: 'block',
                  marginBottom: 5,
                }}
              >
                Remind me this many days before deadline
              </label>
              <select
                value={String(prefs.reminderDays)}
                onChange={(e) => set('reminderDays', Number(e.target.value))}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${B.border}`,
                  fontSize: 12,
                  background: B.white,
                  cursor: 'pointer',
                }}
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="21">21 days</option>
                <option value="30">30 days</option>
              </select>
            </div>

            {error && (
              <div style={{ fontSize: 12, color: B.redText, marginTop: 10 }}>{error}</div>
            )}
            {success && (
              <div style={{ fontSize: 12, color: B.greenText, marginTop: 10 }}>Preferences saved.</div>
            )}

            <div
              style={{
                borderTop: `1px solid ${B.border}`,
                paddingTop: 16,
                marginTop: 20,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: saving ? B.light : B.primary,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : 'Save preferences'}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
