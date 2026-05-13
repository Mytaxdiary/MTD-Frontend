'use client'
import { useState } from 'react'
import Link from 'next/link'
import { validateForgotPasswordEmail } from '@/validations/auth'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import FormField from '@/components/ui/formField'
import { authInputStyle } from '@/lib/helpers/inputStyles'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error: apiError } = useAuth()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const errors = validateForgotPasswordEmail(email)
    if (errors.email) { setEmailError(errors.email); return }
    const ok = await forgotPassword({ email })
    if (ok) setSubmitted(true)
  }

  return (
    <AuthPageLayout
      subtitle="Reset your password"
      footerContent={
        <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          ← Back to sign in
        </Link>
      }
    >
      {!submitted ? (
        <>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
            Enter your account email and we&#39;ll send you a link to reset your password.
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {apiError && (
              <div style={{ padding: '10px 14px', borderRadius: 7, background: '#FFF5F5', border: '1px solid #FECACA', marginBottom: 16, fontSize: 13, color: B.redText }}>
                {apiError}
              </div>
            )}

            <FormField label="Email address" error={emailError} mb={24}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError('') }}
                placeholder="jane@walkerco.co.uk"
                style={authInputStyle(emailError)}
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: loading ? B.xlight : B.primary, color: loading ? B.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em' }}
            >
              {loading ? 'Sending…' : 'Send reset link'}
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
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            style={{ fontSize: 12, color: B.primary, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            Resend email
          </button>
        </div>
      )}
    </AuthPageLayout>
  )
}
