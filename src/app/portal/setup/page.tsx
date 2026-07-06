'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import portalService from '@/services/portal.service'
import { setPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import B from '@/styles/theme'

function SetupForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const token        = params.get('token') ?? ''

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!token) { setError('Setup link is missing. Please use the link from your email.'); return }

    setLoading(true)
    try {
      await portalService.setup(token, password)
      setPortalSessionCookie()
      router.push('/portal/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Setup failed. Your link may have expired — contact your accountant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto' }}>
      <div
        style={{
          background: B.white,
          borderRadius: 12,
          border: `1px solid ${B.border}`,
          padding: '36px 32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: B.text }}>
          Set up your portal
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: B.muted }}>
          Choose a password to access your client portal. You&apos;ll use this to log in at any time.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
              placeholder="At least 8 characters"
            />
          </label>

          <label style={{ display: 'block', marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              style={inputStyle}
              placeholder="Repeat your password"
            />
          </label>

          {error && (
            <div
              style={{
                background: B.redBg,
                border: `1px solid #FECACA`,
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: B.redText,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '12px 0',
              background: '#1E3A5F',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Setting up…' : 'Create password & enter portal'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function PortalSetupPage() {
  return (
    <Suspense>
      <SetupForm />
    </Suspense>
  )
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '10px 12px',
  borderRadius: 8,
  border: `1px solid #CBD5E1`,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}
