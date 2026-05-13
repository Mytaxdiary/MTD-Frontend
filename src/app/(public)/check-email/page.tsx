'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <AuthPageLayout
      subtitle="Check your email"
      footerContent={
        <Link
          href="/login"
          style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
        >
          ← Back to sign in
        </Link>
      }
    >
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            background: '#FEF3C7',
            border: '2px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 22,
          }}
        >
          📧
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 10 }}>
          Verify your email address
        </div>
        <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, marginBottom: 20 }}>
          We've sent a verification link to <b style={{ color: B.text }}>{email}</b>. 
          Click the link to activate your account and start using MTD ITSA.
        </div>
        <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.6, marginBottom: 24 }}>
          Didn't receive the email? Check your spam folder or try registering again.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
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
            Try again
          </Link>
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
            Already verified? Sign in
          </Link>
        </div>
      </div>
    </AuthPageLayout>
  )
}