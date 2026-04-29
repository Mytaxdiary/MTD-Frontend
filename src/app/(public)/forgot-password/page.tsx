'use client'
import { useState } from 'react'
import Link from 'next/link'

const B = {
  primary: '#0EA5C9', primaryDark: '#0284A8', navy: '#1B2A4A',
  surface: '#F8FAFC', white: '#FFFFFF', border: '#E2E8F0', borderLight: '#F1F5F9',
  text: '#0F172A', muted: '#64748B', light: '#94A3B8', xlight: '#CBD5E1',
  red: '#EF4444', redText: '#991B1B',
  green: '#10B981', greenBg: '#ECFDF5', greenText: '#065F46',
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!email) { setEmailError('Email is required'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email address'); return }
    setSubmitting(true)
    // TODO: call password reset API in next phase
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 800)
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
          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>Reset your password</div>
        </div>

        {/* Card */}
        <div style={{ background: B.white, borderRadius: 16, border: `1px solid ${B.border}`, padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {!submitted ? (
            <>
              <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
                Enter your account email and we&#39;ll send you a link to reset your password.
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                    placeholder="jane@walkerco.co.uk"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${emailError ? '#FECACA' : B.border}`, fontSize: 13, outline: 'none', background: B.white, color: B.text, boxSizing: 'border-box' }}
                  />
                  {emailError && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{emailError}</div>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: submitting ? B.xlight : B.primary, color: submitting ? B.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em' }}
                >
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: B.greenBg, border: '2px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>Check your email</div>
              <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 20 }}>
                If <b style={{ color: B.text }}>{email}</b> is registered, you&#39;ll receive a reset link within a few minutes. Check your spam folder if it doesn&#39;t arrive.
              </div>
              {/* TODO: add real resend logic when email API is wired */}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{ fontSize: 12, color: B.primary, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Resend email
              </button>
            </div>
          )}

        </div>

        {/* Back to login */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: B.muted }}>
          <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            ← Back to sign in
          </Link>
        </div>

      </div>
    </div>
  )
}
