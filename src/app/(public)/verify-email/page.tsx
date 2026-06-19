'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import { authService } from '@/services/auth.service'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setErrorMsg('No verification token found in the link. Please use the link from your email.')
      setStatus('error')
      return
    }

    let cancelled = false
    authService
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus('success')
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : 'Verification failed. The link may have expired or already been used.'
          )
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <AuthPageLayout
      subtitle="Email verification"
      footerContent={
        <Link
          href="/login"
          style={{ color: B.link, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
        >
          ← Back to sign in
        </Link>
      }
    >
      {status === 'loading' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${B.xlight}`,
              borderTopColor: B.link,
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 14, color: B.muted }}>Verifying your email…</div>
        </div>
      )}

      {status === 'success' && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: B.greenBg,
              border: '2px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 22,
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>
            Email verified!
          </div>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
            Your email address has been confirmed. You can now sign in to your account.
          </div>
          <Link
            href="/login"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              borderRadius: 8,
              background: B.primary,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            Sign in
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: '#FFF5F5',
              border: '2px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 22,
            }}
          >
            ✕
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>
            Verification failed
          </div>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
            {errorMsg}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: 8,
                background: B.primary,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: 8,
                background: B.xlight,
                color: B.text,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </AuthPageLayout>
  )
}
