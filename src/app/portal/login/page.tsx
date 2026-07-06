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
          Client Portal
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: B.muted }}>
          Sign in to view your tax submissions and messages from your accountant.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
              placeholder="you@example.com"
            />
          </label>

          <label style={{ display: 'block', marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
              placeholder="••••••••"
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
            disabled={loading}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
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
