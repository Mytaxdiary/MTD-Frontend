'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { validateResetPasswordForm } from '@/validations/auth'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import FormField from '@/components/ui/formField'
import { authInputStyle } from '@/lib/helpers/inputStyles'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validateResetPasswordForm(password, confirm)
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    // TODO: call /api/auth/reset-password with { token, password } in next phase
    setTimeout(() => { setSubmitting(false); setDone(true) }, 800)
  }

  /* Expired / missing token state */
  if (!token) {
    return (
      <AuthPageLayout subtitle="">
        <div style={{ textAlign: 'center' }}>
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
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout
      subtitle="Set a new password"
      footerContent={
        !done ? (
          <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            ← Back to sign in
          </Link>
        ) : undefined
      }
    >
      {!done ? (
        <>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
            Choose a strong password. It must be at least 8 characters.
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="New password" error={errors.password} mb={18}>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                placeholder="At least 8 characters"
                style={authInputStyle(errors.password)}
              />
            </FormField>

            <FormField label="Confirm new password" error={errors.confirm} mb={24}>
              <input
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })) }}
                placeholder="Re-enter your password"
                style={authInputStyle(errors.confirm)}
              />
            </FormField>

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
    </AuthPageLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
