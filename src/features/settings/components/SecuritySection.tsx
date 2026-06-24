'use client'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { authService } from '@/services/auth.service'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import B from '@/styles/theme'

type Phase =
  | 'idle'
  | 'setup-loading'
  | 'setup-ready'
  | 'enabling'
  | 'disable-confirm'
  | 'disabling'

export default function SecuritySection() {
  const { user, refresh: reloadUser } = useCurrentUser()
  const mfaEnabled = (user as { mfaEnabled?: boolean })?.mfaEnabled ?? false

  const [phase, setPhase] = useState<Phase>('idle')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [secret, setSecret] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [enableCode, setEnableCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [disableCode, setDisableCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const enableInputRef = useRef<HTMLInputElement>(null)
  const disableInputRef = useRef<HTMLInputElement>(null)

  // Generate QR code image whenever otpauthUrl changes
  useEffect(() => {
    if (phase === 'setup-ready' && secret) {
      enableInputRef.current?.focus()
    }
  }, [phase, secret])

  async function startSetup() {
    setPhase('setup-loading')
    setError(null)
    setSuccessMsg(null)
    try {
      const res = await authService.mfaSetup()
      setSecret(res.secret)
      setSetupToken(res.setupToken)
      // Generate QR locally — no 3rd party service
      const dataUrl = await QRCode.toDataURL(res.otpauthUrl, { width: 200, margin: 1 })
      setQrDataUrl(dataUrl)
      setPhase('setup-ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start setup. Please try again.')
      setPhase('idle')
    }
  }

  async function confirmEnable() {
    const clean = enableCode.replace(/\D/g, '')
    if (clean.length !== 6) { setError('Enter the 6-digit code shown in your app.'); return }
    setPhase('enabling')
    setError(null)
    try {
      await authService.mfaEnable(setupToken, clean)
      setSuccessMsg('Two-step verification is now enabled.')
      setPhase('idle')
      setEnableCode('')
      reloadUser?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
      setPhase('setup-ready')
    }
  }

  async function confirmDisable() {
    const clean = disableCode.replace(/\D/g, '')
    if (!disablePassword.trim()) { setError('Enter your password.'); return }
    if (clean.length !== 6) { setError('Enter the 6-digit code from your authenticator app.'); return }
    setPhase('disabling')
    setError(null)
    try {
      await authService.mfaDisable(disablePassword, clean)
      setSuccessMsg('Two-step verification has been disabled.')
      setPhase('idle')
      setDisablePassword('')
      setDisableCode('')
      reloadUser?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not disable MFA. Please try again.')
      setPhase('disable-confirm')
    }
  }

  const cancel = () => {
    setPhase('idle')
    setError(null)
    setEnableCode('')
    setDisablePassword('')
    setDisableCode('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status card */}
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
          Two-step verification (2FA)
        </div>
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: mfaEnabled ? B.greenBg : B.surface,
                    color: mfaEnabled ? B.greenText : B.muted,
                    border: `1px solid ${mfaEnabled ? '#A7F3D0' : B.border}`,
                  }}
                >
                  {mfaEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, maxWidth: 460 }}>
                {mfaEnabled
                  ? 'Your account is protected with an authenticator app (TOTP). You will need your app each time you sign in.'
                  : 'Add an extra layer of security. After enabling, you will be asked for a 6-digit code from an authenticator app each time you sign in.'}
              </div>
            </div>
            {phase === 'idle' && (
              <button
                onClick={mfaEnabled ? () => { setPhase('disable-confirm'); setError(null); setSuccessMsg(null) } : startSetup}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: `1px solid ${mfaEnabled ? B.border : B.primary}`,
                  background: mfaEnabled ? 'transparent' : B.primary,
                  color: mfaEnabled ? B.muted : '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            )}
          </div>

          {/* Success message */}
          {successMsg && (
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: B.greenBg,
                border: '1px solid #A7F3D0',
                fontSize: 13,
                color: B.greenText,
              }}
            >
              {successMsg}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: '#FFF5F5',
                border: '1px solid #FECACA',
                fontSize: 13,
                color: B.redText,
              }}
            >
              {error}
            </div>
          )}

          {/* ─── Setup loading ─── */}
          {phase === 'setup-loading' && (
            <div style={{ marginTop: 20, fontSize: 13, color: B.muted }}>Generating QR code…</div>
          )}

          {/* ─── Setup ready — show QR + secret + code input ─── */}
          {phase === 'setup-ready' && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  padding: '16px',
                  background: B.surface,
                  borderRadius: 10,
                  border: `1px solid ${B.border}`,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  Step 1: Scan this QR code with your authenticator app
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="MFA QR code"
                      style={{ borderRadius: 8, border: `1px solid ${B.border}`, background: '#fff' }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: 12, color: B.muted, marginBottom: 6 }}>
                      Can&apos;t scan? Enter this key manually:
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        padding: '8px 12px',
                        background: B.white,
                        border: `1px solid ${B.border}`,
                        borderRadius: 6,
                        color: B.navy,
                        userSelect: 'all',
                      }}
                    >
                      {secret.match(/.{1,4}/g)?.join(' ') ?? secret}
                    </div>
                    <div style={{ fontSize: 11, color: B.light, marginTop: 8, lineHeight: 1.5 }}>
                      Compatible apps: Google Authenticator, Microsoft Authenticator, Authy
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Step 2: Enter the 6-digit code to confirm setup
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    ref={enableInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={enableCode}
                    onChange={(e) => { setEnableCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
                    placeholder="000000"
                    maxLength={6}
                    style={{
                      width: 140,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1.5px solid ${error ? B.red : B.border}`,
                      fontSize: 20,
                      fontWeight: 700,
                      textAlign: 'center',
                      letterSpacing: '0.2em',
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    onClick={confirmEnable}
                    disabled={enableCode.replace(/\D/g, '').length !== 6}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      border: 'none',
                      background: enableCode.replace(/\D/g, '').length === 6 ? B.green : B.xlight,
                      color: enableCode.replace(/\D/g, '').length === 6 ? '#fff' : B.muted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: enableCode.replace(/\D/g, '').length === 6 ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Confirm &amp; enable
                  </button>
                  <button
                    onClick={cancel}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${B.border}`,
                      background: 'transparent',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: B.muted,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Enabling spinner ─── */}
          {phase === 'enabling' && (
            <div style={{ marginTop: 16, fontSize: 13, color: B.muted }}>Enabling 2FA…</div>
          )}

          {/* ─── Disable confirmation ─── */}
          {phase === 'disable-confirm' && (
            <div
              style={{
                marginTop: 20,
                padding: '16px',
                background: '#FFF5F5',
                borderRadius: 10,
                border: '1px solid #FECACA',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: B.redText }}>
                Disable two-step verification
              </div>
              <div style={{ fontSize: 12, color: B.muted, marginBottom: 14, lineHeight: 1.6 }}>
                Enter your account password and current authenticator code to confirm.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}>
                <input
                  ref={disableInputRef}
                  type="password"
                  value={disablePassword}
                  onChange={(e) => { setDisablePassword(e.target.value); setError(null) }}
                  placeholder="Your password"
                  autoFocus
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={disableCode}
                  onChange={(e) => { setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
                  placeholder="6-digit code"
                  maxLength={6}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${B.border}`,
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={confirmDisable}
                    style={{
                      padding: '9px 18px',
                      borderRadius: 8,
                      border: 'none',
                      background: B.red,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Disable 2FA
                  </button>
                  <button
                    onClick={cancel}
                    style={{
                      padding: '9px 14px',
                      borderRadius: 8,
                      border: `1px solid ${B.border}`,
                      background: 'transparent',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: B.muted,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Disabling spinner ─── */}
          {phase === 'disabling' && (
            <div style={{ marginTop: 16, fontSize: 13, color: B.muted }}>Disabling 2FA…</div>
          )}
        </div>
      </div>

      {/* Info card */}
      <div
        style={{
          background: B.white,
          borderRadius: 12,
          border: `1px solid ${B.border}`,
          padding: '16px 20px',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Supported authenticator apps</div>
        {[
          { name: 'Google Authenticator', note: 'iOS & Android' },
          { name: 'Microsoft Authenticator', note: 'iOS & Android' },
          { name: 'Authy', note: 'iOS, Android & Desktop' },
          { name: '1Password', note: 'Built-in TOTP support' },
        ].map((a) => (
          <div
            key={a.name}
            style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: B.text, marginBottom: 6 }}
          >
            <span>{a.name}</span>
            <span style={{ color: B.muted }}>{a.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
