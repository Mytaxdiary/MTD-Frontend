'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { validateResetPasswordForm } from '@/validations/auth'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import FormField from '@/components/ui/formField'
import { authInputStyle } from '@/lib/helpers/inputStyles'
import { teamService, type StaffInvitePreview } from '@/services/team.service'
import { setAccessTokenExpiry } from '@/lib/auth/accessTokenExpiry'
import { setSessionCookie } from '@/lib/auth/tokenStorage'

function AcceptInviteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [preview, setPreview] = useState<StaffInvitePreview | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(!!token)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoadingPreview(false)
      return
    }
    let cancelled = false
    teamService
      .previewInvite(token)
      .then((data) => {
        if (!cancelled) setPreview(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setPreviewError((err as Error)?.message ?? 'This invitation link is invalid or has expired.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!token) return
    const e = validateResetPasswordForm(password, confirm)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await teamService.acceptInvite(token, password)
      setAccessTokenExpiry(result.accessTokenExpiresAt)
      setSessionCookie()
      router.push('/dashboard')
    } catch (err: unknown) {
      setSubmitError((err as Error)?.message ?? 'Could not accept the invitation.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token || previewError) {
    return (
      <AuthPageLayout subtitle="">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>
            Invalid or expired invitation
          </div>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
            {previewError ?? 'This invitation link is invalid or has expired. Ask the firm owner to send a new invite.'}
          </div>
          <Link href="/login" style={{ color: B.link, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            Back to sign in
          </Link>
        </div>
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout
      subtitle={preview ? `Join ${preview.firmName}` : 'Join your firm'}
      footerContent={
        <Link href="/login" style={{ color: B.link, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          Back to sign in
        </Link>
      }
    >
      {loadingPreview ? (
        <div style={{ fontSize: 13, color: B.muted }}>Loading invitation...</div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
            Hi {preview?.firstName}. Set a password to create your account for{' '}
            <strong>{preview?.email}</strong>.
          </div>
          <form onSubmit={(ev) => void handleSubmit(ev)} noValidate>
            {submitError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 7,
                  background: '#FFF5F5',
                  border: '1px solid #FECACA',
                  marginBottom: 16,
                  fontSize: 13,
                  color: B.redText,
                }}
              >
                {submitError}
              </div>
            )}
            <FormField label="Password" error={errors.password} mb={18}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((p) => ({ ...p, password: undefined }))
                }}
                placeholder="At least 8 characters"
                style={authInputStyle(errors.password)}
              />
            </FormField>
            <FormField label="Confirm password" error={errors.confirm} mb={24}>
              <input
                type="password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setErrors((p) => ({ ...p, confirm: undefined }))
                }}
                placeholder="Re-enter your password"
                style={authInputStyle(errors.confirm)}
              />
            </FormField>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 8,
                border: 'none',
                background: submitting ? B.xlight : B.primary,
                color: submitting ? B.muted : '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </>
      )}
    </AuthPageLayout>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteContent />
    </Suspense>
  )
}
