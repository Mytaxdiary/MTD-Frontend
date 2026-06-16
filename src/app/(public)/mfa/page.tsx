'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthPageLayout from '@/components/auth/authPageLayout'
import { authService } from '@/services/auth.service'
import { setAccessTokenExpiry } from '@/lib/auth/accessTokenExpiry'
import { setSessionCookie } from '@/lib/auth/tokenStorage'
import B from '@/styles/theme'

export default function MfaPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Redirect to login if no challenge token in session
    const token = sessionStorage.getItem('mfa_token')
    if (!token) router.replace('/login')
    else inputRef.current?.focus()
  }, [router])

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const mfaToken = sessionStorage.getItem('mfa_token')
    if (!mfaToken) { router.replace('/login'); return }

    const clean = code.replace(/\s/g, '')
    if (clean.length !== 6) {
      setError('Enter the 6-digit code from your authenticator app.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await authService.mfaVerify(mfaToken, clean)
      sessionStorage.removeItem('mfa_token')
      setAccessTokenExpiry(response.accessTokenExpiresAt)
      setSessionCookie()
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (val: string) => {
    // Allow only digits and spaces, max 6 digits
    const digits = val.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    setError(null)
  }

  return (
    <AuthPageLayout
      subtitle="Two-step verification"
      footerContent={
        <button
          onClick={() => { sessionStorage.removeItem('mfa_token'); router.push('/login') }}
          style={{ background: 'none', border: 'none', color: B.primary, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          ← Back to sign in
        </button>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: B.blueBg,
            border: `1px solid #BAE6FD`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            margin: '0 auto 20px',
          }}
        >
          🔐
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 6 }}>
            Enter your authenticator code
          </div>
          <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6 }}>
            Open your authenticator app and enter the 6-digit code.
          </div>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="000000"
          maxLength={6}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 8,
            border: `1.5px solid ${error ? B.red : B.border}`,
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.25em',
            outline: 'none',
            marginBottom: 20,
            color: B.navy,
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        />

        <button
          type="submit"
          disabled={loading || code.replace(/\D/g, '').length !== 6}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 8,
            border: 'none',
            background: loading || code.replace(/\D/g, '').length !== 6 ? B.xlight : B.primary,
            color: loading || code.replace(/\D/g, '').length !== 6 ? B.muted : '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: loading || code.replace(/\D/g, '').length !== 6 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'Verifying…' : 'Verify and sign in'}
        </button>
      </form>
    </AuthPageLayout>
  )
}
