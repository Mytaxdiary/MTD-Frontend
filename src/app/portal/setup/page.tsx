'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import portalService from '@/services/portal.service'
import { setPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import B from '@/styles/theme'
import LegalFooter from '@/components/ui/LegalFooter'

function SetupForm() {
  const router  = useRouter()
  const params  = useSearchParams()
  const token   = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

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
      setError(msg ?? 'Setup failed. Your link may have expired. Please contact your accountant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: '48px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: 14,
          background: '#1E3A5F',
          marginBottom: 16,
          fontSize: 24,
        }}>
          🔑
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: B.text }}>
          Set up your portal
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
          Choose a password to access your client portal. You can use this to log in at any time.
        </p>
      </div>

      <div style={{
        background: B.white,
        borderRadius: 14,
        border: `1px solid ${B.border}`,
        padding: '32px 32px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: B.text, marginBottom: 7 }}>
              New password
            </label>
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
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: B.text, marginBottom: 7 }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              style={inputStyle}
              placeholder="Repeat your password"
            />
          </div>

          {error && (
            <div style={{
              background: B.redBg,
              border: `1px solid #FECACA`,
              borderRadius: 9,
              padding: '11px 16px',
              fontSize: 14,
              color: B.redText,
              marginBottom: 20,
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '13px 0',
              background: loading || !token ? B.muted : '#1E3A5F',
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !token ? 'not-allowed' : 'pointer',
              letterSpacing: '0.1px',
            }}
          >
            {loading ? 'Setting up...' : 'Create password and enter portal'}
          </button>
        </form>
      </div>

      <LegalFooter />
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
  padding: '11px 14px',
  borderRadius: 9,
  border: `1.5px solid #CBD5E1`,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  color: '#0F172A',
  background: '#fff',
}
