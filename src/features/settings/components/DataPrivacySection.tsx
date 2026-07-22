'use client'
import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import accountService, { type DeletionStatus } from '@/services/account.service'
import B from '@/styles/theme'

type ExportPhase = 'idle' | 'confirm' | 'exporting' | 'done'
type DeletePhase = 'idle' | 'confirm' | 'requesting' | 'pending'

export default function DataPrivacySection() {
  const { user } = useCurrentUser()
  const mfaEnabled = (user as { mfaEnabled?: boolean })?.mfaEnabled ?? false

  // ── Export state ─────────────────────────────────────────────────────────
  const [exportPhase, setExportPhase] = useState<ExportPhase>('idle')
  const [exportPassword, setExportPassword] = useState('')
  const [exportError, setExportError] = useState<string | null>(null)

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deletePhase, setDeletePhase] = useState<DeletePhase>('idle')
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteMfaCode, setDeleteMfaCode] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteStatus, setDeleteStatus] = useState<DeletionStatus | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  // Check for existing pending deletion request on mount
  useEffect(() => {
    accountService.getDeletionStatus()
      .then((data) => {
        if (data?.status === 'pending') {
          setDeleteStatus(data)
          setDeletePhase('pending')
        }
      })
      .catch(() => {})
  }, [])

  // ── Export handlers ───────────────────────────────────────────────────────

  async function runExport() {
    if (!exportPassword.trim()) {
      setExportError('Please enter your password to continue.')
      return
    }
    setExportPhase('exporting')
    setExportError(null)
    try {
      const { blobUrl, filename } = await accountService.exportData(exportPassword)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
      setExportPhase('done')
      setExportPassword('')
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed. Please try again.')
      setExportPhase('confirm')
    }
  }

  // ── Delete handlers ───────────────────────────────────────────────────────

  async function runDeleteRequest() {
    if (!deletePassword.trim()) { setDeleteError('Please enter your password.'); return }
    if (deleteConfirmText.toUpperCase() !== 'DELETE') { setDeleteError('Please type DELETE to confirm.'); return }
    setDeletePhase('requesting')
    setDeleteError(null)
    try {
      const mfa = mfaEnabled && deleteMfaCode.trim() ? deleteMfaCode.replace(/\s/g, '') : undefined
      const result = await accountService.requestDeletion(deletePassword, mfa)
      setDeleteStatus({ status: 'pending', executeAt: result.executeAt })
      setDeletePhase('pending')
      setDeletePassword('')
      setDeleteMfaCode('')
      setDeleteConfirmText('')
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Request failed. Please try again.')
      setDeletePhase('confirm')
    }
  }

  async function runCancelDeletion() {
    setIsCancelling(true)
    setDeleteError(null)
    try {
      await accountService.cancelDeletion()
      setDeleteStatus(null)
      setDeletePhase('idle')
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to cancel.')
    } finally {
      setIsCancelling(false)
    }
  }

  const executeDate = deleteStatus?.executeAt
    ? new Date(deleteStatus.executeAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Export card ─────────────────────────────────────────────────── */}
      <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>
          Export my data
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, maxWidth: 540, marginBottom: 18 }}>
            Download a copy of all your firm&apos;s data held in My Tax Diary, including firm details,
            client records, notes, chase history, and portal messages. The export is a ZIP file containing
            JSON and CSV files. Passwords, HMRC tokens, and encryption keys are never included.
          </div>

          {exportPhase === 'idle' && (
            <button
              onClick={() => { setExportPhase('confirm'); setExportPassword(''); setExportError(null) }}
              style={{ padding: '9px 18px', borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, color: B.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Export my data
            </button>
          )}

          {exportPhase === 'done' && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: B.greenBg, border: '1px solid #A7F3D0', fontSize: 13, color: B.greenText, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Your export has downloaded successfully.
              <button
                onClick={() => setExportPhase('idle')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: B.greenText, textDecoration: 'underline', padding: 0 }}
              >
                Export again
              </button>
            </div>
          )}

          {exportPhase === 'exporting' && (
            <div style={{ fontSize: 13, color: B.muted }}>Generating export... this may take a few seconds.</div>
          )}

          {exportPhase === 'confirm' && (
            <div style={{ padding: '18px 20px', background: B.surface, borderRadius: 10, border: `1px solid ${B.border}`, maxWidth: 380 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confirm your password</div>
              <div style={{ fontSize: 12, color: B.muted, marginBottom: 14, lineHeight: 1.6 }}>
                Enter your account password to start the export.
              </div>
              <input
                type="password"
                value={exportPassword}
                autoFocus
                onChange={(e) => { setExportPassword(e.target.value); setExportError(null) }}
                onKeyDown={(e) => { if (e.key === 'Enter') runExport() }}
                placeholder="Your password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${exportError ? B.red : B.border}`, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
              />
              {exportError && (
                <div style={{ padding: '8px 12px', borderRadius: 6, background: '#FFF5F5', border: '1px solid #FECACA', fontSize: 12, color: B.redText, marginBottom: 12 }}>
                  {exportError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={runExport}
                  disabled={!exportPassword.trim()}
                  style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: exportPassword.trim() ? B.primary : B.xlight, color: exportPassword.trim() ? '#fff' : B.muted, fontSize: 13, fontWeight: 600, cursor: exportPassword.trim() ? 'pointer' : 'not-allowed' }}
                >
                  Download ZIP
                </button>
                <button
                  onClick={() => { setExportPhase('idle'); setExportPassword(''); setExportError(null) }}
                  style={{ padding: '9px 14px', borderRadius: 8, border: `1px solid ${B.border}`, background: 'transparent', fontSize: 13, cursor: 'pointer', color: B.muted }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── What's included card ─────────────────────────────────────────── */}
      <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, padding: '16px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>What is included in the export?</div>
        {[
          { label: 'Firm details', note: 'Name, address, contact information' },
          { label: 'Account and team', note: 'User accounts (no passwords)' },
          { label: 'Clients', note: 'All client records including name, NINO, email' },
          { label: 'Notes', note: 'All notes created for clients' },
          { label: 'Chase history', note: 'All chase logs and templates' },
          { label: 'Portal messages', note: 'Messages sent to client portal users' },
          { label: 'Uploaded files', note: 'Documents uploaded by clients via portal' },
          { label: 'Notifications', note: 'In-app notification history' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: B.text, marginBottom: 6 }}>
            <span>{item.label}</span>
            <span style={{ color: B.muted, maxWidth: 260, textAlign: 'right' }}>{item.note}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.border}`, fontSize: 12, color: B.muted, lineHeight: 1.6 }}>
          Passwords, password hashes, HMRC access tokens, TOTP secrets, and encryption keys are never exported.
        </div>
      </div>

      {/* ── GDPR note ────────────────────────────────────────────────────── */}
      <div style={{ background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE', padding: '14px 18px', fontSize: 12, color: '#1E40AF', lineHeight: 1.7 }}>
        Under UK GDPR you have the right to access and receive a copy of the personal data we hold about you.
        This export fulfils that right. If you need help, contact us at{' '}
        <a href="mailto:info@mytaxdiary.co.uk" style={{ color: '#2563EB' }}>info@mytaxdiary.co.uk</a>.
      </div>

      {/* ── Delete card ──────────────────────────────────────────────────── */}
      <div style={{ background: B.white, borderRadius: 12, border: '1px solid #FECACA', overflow: 'hidden', marginTop: 8 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #FECACA', fontSize: 14, fontWeight: 700, color: B.redText }}>
          Delete account and data
        </div>
        <div style={{ padding: '20px' }}>

          {/* Pending state */}
          {deletePhase === 'pending' && deleteStatus && (
            <div>
              <div style={{ padding: '14px 18px', borderRadius: 8, background: '#FFF5F5', border: '1px solid #FECACA', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.redText, marginBottom: 6 }}>
                  Deletion scheduled for {executeDate}
                </div>
                <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6 }}>
                  Your account and all firm data will be permanently deleted on this date. You can cancel this request before then.
                </div>
              </div>
              {deleteError && (
                <div style={{ padding: '8px 12px', borderRadius: 6, background: '#FFF5F5', border: '1px solid #FECACA', fontSize: 12, color: B.redText, marginBottom: 12 }}>
                  {deleteError}
                </div>
              )}
              <button
                onClick={runCancelDeletion}
                disabled={isCancelling}
                style={{ padding: '9px 18px', borderRadius: 8, border: `1px solid ${B.border}`, background: 'transparent', color: B.text, fontSize: 13, fontWeight: 600, cursor: isCancelling ? 'not-allowed' : 'pointer' }}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel deletion request'}
              </button>
            </div>
          )}

          {/* Idle / Confirm / Requesting states */}
          {(deletePhase === 'idle' || deletePhase === 'confirm' || deletePhase === 'requesting') && (
            <div>
              <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, maxWidth: 540, marginBottom: 16 }}>
                Permanently delete your account and all associated firm data. A 7-day grace period applies.
                A confirmation email will be sent. Billing records are retained for legal compliance.
              </div>

              {deletePhase === 'idle' && (
                <button
                  onClick={() => { setDeletePhase('confirm'); setDeleteError(null) }}
                  style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #FECACA', background: 'transparent', color: B.redText, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Request account deletion
                </button>
              )}

              {(deletePhase === 'confirm' || deletePhase === 'requesting') && (
                <div style={{ padding: '18px 20px', background: '#FFF5F5', borderRadius: 10, border: '1px solid #FECACA', maxWidth: 420 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B.redText, marginBottom: 4 }}>This cannot be undone</div>
                  <div style={{ fontSize: 12, color: B.muted, marginBottom: 14, lineHeight: 1.6 }}>
                    All clients, notes, chase logs, portal data, and uploaded files will be permanently deleted
                    after 7 days. Type <strong>delete</strong> below and enter your password to confirm.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      autoFocus
                      onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(null) }}
                      placeholder="Type delete to confirm"
                      style={{
                        padding: '10px 12px', borderRadius: 8, fontSize: 13, outline: 'none',
                        border: `1px solid ${deleteConfirmText && deleteConfirmText.toUpperCase() !== 'DELETE' ? B.red : B.border}`,
                        fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em',
                      }}
                    />
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(null) }}
                      placeholder="Your password"
                      style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, outline: 'none' }}
                    />
                    {mfaEnabled && (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={deleteMfaCode}
                        onChange={(e) => { setDeleteMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setDeleteError(null) }}
                        placeholder="6-digit authenticator code"
                        maxLength={6}
                        style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, outline: 'none', fontFamily: 'monospace', letterSpacing: '0.1em' }}
                      />
                    )}
                    {deleteError && (
                      <div style={{ padding: '8px 12px', borderRadius: 6, background: '#FFF5F5', border: '1px solid #FECACA', fontSize: 12, color: B.redText }}>
                        {deleteError}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(() => {
                        const canSubmit =
                          deletePhase !== 'requesting' &&
                          deleteConfirmText.toUpperCase() === 'DELETE' &&
                          deletePassword.trim() !== '' &&
                          (!mfaEnabled || deleteMfaCode.length === 6)
                        return (
                          <button
                            onClick={runDeleteRequest}
                            disabled={!canSubmit}
                            style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: canSubmit ? B.red : B.xlight, color: canSubmit ? '#fff' : B.muted, fontSize: 13, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                          >
                            {deletePhase === 'requesting' ? 'Submitting...' : 'Request deletion'}
                          </button>
                        )
                      })()}
                      <button
                        onClick={() => { setDeletePhase('idle'); setDeletePassword(''); setDeleteMfaCode(''); setDeleteConfirmText(''); setDeleteError(null) }}
                        style={{ padding: '9px 14px', borderRadius: 8, border: `1px solid ${B.border}`, background: 'transparent', fontSize: 13, cursor: 'pointer', color: B.muted }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
