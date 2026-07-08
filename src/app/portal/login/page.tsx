'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService from '@/services/portal.service'
import { setPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import B from '@/styles/theme'

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await portalService.login(email, password)
      setPortalSessionCookie()
      router.push('/portal/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
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
          🔒
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: B.text }}>
          Sign in to your portal
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
          View your tax submissions and messages from your accountant.
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
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: B.text, marginBottom: 7 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
              placeholder="Enter your password"
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
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 0',
              background: loading ? B.muted : '#1E3A5F',
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.1px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
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
