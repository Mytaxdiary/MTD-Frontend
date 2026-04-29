'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const B = {
  primary: '#0EA5C9', primaryDark: '#0284A8', navy: '#1B2A4A',
  surface: '#F8FAFC', white: '#FFFFFF', border: '#E2E8F0', borderLight: '#F1F5F9',
  text: '#0F172A', muted: '#64748B', light: '#94A3B8', xlight: '#CBD5E1',
  red: '#EF4444', redBg: '#FEF2F2', redText: '#991B1B',
  green: '#10B981', greenBg: '#ECFDF5', greenText: '#065F46',
  amber: '#F59E0B', amberBg: '#FFFBEB', amberText: '#92400E',
}

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!password) e.password = 'New password is required'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (confirm !== password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    // TODO: call /api/auth/reset-password with { token, password } in next phase
    setTimeout(() => { setSubmitting(false); setDone(true) }, 800)
  }

  /* Expired / missing token state */
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: B.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${B.primary},${B.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 14, boxShadow: '0 4px 12px rgba(14,165,201,0.3)' }}>NE</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: '-0.02em' }}>NewEffect MTD ITSA</div>
          </div>
          <div style={{ background: B.white, borderRadius: 16, border: `1px solid ${B.border}`, padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚠</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>Invalid or expired link</div>
            <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
              This password reset link is invalid or has expired. Reset links are valid for 24 hours.
            </div>
            <Link href="/forgot-password" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: B.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Request a new link
            </Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
            <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>← Back to sign in</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: B.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${B.primary},${B.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 14, boxShadow: '0 4px 12px rgba(14,165,201,0.3)' }}>
            NE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: '-0.02em' }}>NewEffect MTD ITSA</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>Set a new password</div>
        </div>

        {/* Card */}
        <div style={{ background: B.white, borderRadius: 16, border: `1px solid ${B.border}`, padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {!done ? (
            <>
              <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
                Choose a strong password. It must be at least 8 characters.
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* New password */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                    placeholder="At least 8 characters"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${errors.password ? '#FECACA' : B.border}`, fontSize: 13, outline: 'none', background: B.white, color: B.text, boxSizing: 'border-box' }}
                  />
                  {errors.password && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.password}</div>}
                </div>

                {/* Confirm password */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Confirm new password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })) }}
                    placeholder="Re-enter your password"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${errors.confirm ? '#FECACA' : B.border}`, fontSize: 13, outline: 'none', background: B.white, color: B.text, boxSizing: 'border-box' }}
                  />
                  {errors.confirm && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.confirm}</div>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: submitting ? B.xlight : B.primary, color: submitting ? B.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em' }}
                >
                  {submitting ? 'Saving…' : 'Set new password'}
                </button>

              </form>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: B.greenBg, border: '2px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>Password updated</div>
              <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
                Your password has been reset successfully. You can now sign in with your new password.
              </div>
              <Link
                href="/login"
                style={{ display: 'inline-block', padding: '10px 28px', borderRadius: 8, background: B.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </div>
          )}

        </div>

        {!done && (
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
            <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
              ← Back to sign in
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
