'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import B from '@/styles/theme'

type Phase = 'idle' | 'setup-loading' | 'setup-ready' | 'enabling' | 'disable-confirm' | 'disabling'

export type MfaSettingsApi = {
  mfaSetup: () => Promise<{ secret: string; otpauthUrl: string; setupToken: string }>
  mfaEnable: (setupToken: string, code: string) => Promise<void>
  mfaDisable: (password: string, code: string) => Promise<void>
}

type Props = {
  mfaEnabled: boolean
  api: MfaSettingsApi
  onChanged?: () => void | Promise<void>
}

export default function MfaSettingsPanel({ mfaEnabled, api, onChanged }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [enableCode, setEnableCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [disableCode, setDisableCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const enableInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (phase === 'setup-ready') enableInputRef.current?.focus()
  }, [phase])

  async function startSetup() {
    setPhase('setup-loading')
    setError(null)
    setSuccessMsg(null)
    try {
      const res = await api.mfaSetup()
      setSecret(res.secret)
      setSetupToken(res.setupToken)
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
    if (clean.length !== 6) {
      setError('Enter the 6-digit code shown in your app.')
      return
    }
    setPhase('enabling')
    setError(null)
    try {
      await api.mfaEnable(setupToken, clean)
      setSuccessMsg('Two-step verification is now enabled.')
      setPhase('idle')
      setEnableCode('')
      await onChanged?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
      setPhase('setup-ready')
    }
  }

  async function confirmDisable() {
    const clean = disableCode.replace(/\D/g, '')
    if (!disablePassword.trim()) {
      setError('Enter your password.')
      return
    }
    if (clean.length !== 6) {
      setError('Enter the 6-digit code from your authenticator app.')
      return
    }
    setPhase('disabling')
    setError(null)
    try {
      await api.mfaDisable(disablePassword, clean)
      setSuccessMsg('Two-step verification has been disabled.')
      setPhase('idle')
      setDisablePassword('')
      setDisableCode('')
      await onChanged?.()
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
    <div
      style={{
        background: B.white,
        border: `1px solid ${B.borderLight}`,
        borderRadius: 12,
        padding: 22,
        boxShadow: B.cardShadow,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.text }}>
            Two-step verification (2FA)
          </div>
          <div style={{ fontSize: 13.5, color: B.muted, marginTop: 6, maxWidth: 520 }}>
            {mfaEnabled
              ? 'Your account is protected with an authenticator app. You will need your app each time you sign in.'
              : 'Add an extra layer of security. After enabling, you will be asked for a 6-digit code from an authenticator app each time you sign in.'}
          </div>
        </div>
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 999,
            background: mfaEnabled ? B.greenBg : B.surface,
            color: mfaEnabled ? B.greenText : B.muted,
            border: `1px solid ${mfaEnabled ? '#A7F3D0' : B.border}`,
          }}
        >
          {mfaEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      {successMsg && (
        <div
          style={{
            marginTop: 14,
            padding: '10px 12px',
            borderRadius: 8,
            background: B.greenBg,
            color: B.greenText,
            fontSize: 13,
          }}
        >
          {successMsg}
        </div>
      )}
      {error && (
        <div
          style={{
            marginTop: 14,
            padding: '10px 12px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {phase === 'idle' && (
        <button
          type="button"
          onClick={() => (mfaEnabled ? setPhase('disable-confirm') : void startSetup())}
          style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 8,
            border: `1px solid ${mfaEnabled ? B.border : B.primary}`,
            background: mfaEnabled ? 'transparent' : B.primary,
            color: mfaEnabled ? B.muted : '#fff',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      )}

      {phase === 'setup-loading' && (
        <div style={{ marginTop: 16, fontSize: 14, color: B.muted }}>Preparing setup…</div>
      )}

      {(phase === 'setup-ready' || phase === 'enabling') && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: B.text, marginBottom: 10 }}>
            Step 1: Scan this QR code with your authenticator app
          </div>
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="MFA QR code" width={160} height={160} style={{ borderRadius: 8 }} />
          )}
          <div style={{ fontSize: 12.5, color: B.muted, marginTop: 10 }}>
            Or enter this key manually: <code style={{ color: B.text }}>{secret}</code>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: B.text, margin: '18px 0 8px' }}>
            Step 2: Enter the 6-digit code
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              ref={enableInputRef}
              value={enableCode}
              onChange={(e) => setEnableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="123456"
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 16,
                letterSpacing: '0.12em',
                width: 140,
              }}
            />
            <button
              type="button"
              disabled={phase === 'enabling'}
              onClick={() => void confirmEnable()}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: B.primary,
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {phase === 'enabling' ? 'Enabling…' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={cancel}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                color: B.muted,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(phase === 'disable-confirm' || phase === 'disabling') && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13.5, color: B.muted, marginBottom: 12 }}>
            Enter your account password and current authenticator code to confirm.
          </div>
          <div style={{ display: 'grid', gap: 10, maxWidth: 320 }}>
            <input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              placeholder="Password"
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 14,
              }}
            />
            <input
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="6-digit code"
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                fontSize: 14,
                letterSpacing: '0.12em',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              type="button"
              disabled={phase === 'disabling'}
              onClick={() => void confirmDisable()}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: B.red,
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {phase === 'disabling' ? 'Disabling…' : 'Disable 2FA'}
            </button>
            <button
              type="button"
              onClick={cancel}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                color: B.muted,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
