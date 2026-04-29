'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const B = {
  primary: '#0EA5C9', primaryDark: '#0284A8', navy: '#1B2A4A',
  surface: '#F8FAFC', white: '#FFFFFF', border: '#E2E8F0', borderLight: '#F1F5F9',
  text: '#0F172A', muted: '#64748B', light: '#94A3B8', xlight: '#CBD5E1',
  red: '#EF4444', redBg: '#FEF2F2', redText: '#991B1B',
  green: '#10B981', greenBg: '#ECFDF5', greenText: '#065F46',
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    // TODO: connect to auth API in next phase
    setTimeout(() => {
      setSubmitting(false)
      router.push('/dashboard')
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', background: B.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${B.primary},${B.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 14, boxShadow: '0 4px 12px rgba(14,165,201,0.3)' }}>
            NE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: '-0.02em' }}>NewEffect MTD ITSA</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>Sign in to your agent account</div>
        </div>

        {/* Card */}
        <div style={{ background: B.white, borderRadius: 16, border: `1px solid ${B.border}`, padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                placeholder="jane@walkerco.co.uk"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${errors.email ? '#FECACA' : B.border}`, fontSize: 13, outline: 'none', background: B.white, color: B.text, boxSizing: 'border-box' }}
              />
              {errors.email && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${errors.password ? '#FECACA' : B.border}`, fontSize: 13, outline: 'none', background: B.white, color: B.text, boxSizing: 'border-box' }}
              />
              {errors.password && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.password}</div>}
            </div>

            {/* Forgot password */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <Link href="/forgot-password" style={{ fontSize: 12, color: B.primary, fontWeight: 500, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: submitting ? B.xlight : B.primary, color: submitting ? B.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em' }}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: B.border }} />
            <span style={{ fontSize: 11, color: B.light, fontWeight: 500, whiteSpace: 'nowrap' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: B.border }} />
          </div>

          {/* SSO placeholder buttons */}
          {/* TODO: wire up real OAuth providers (Google Workspace, Microsoft 365) in next phase */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              disabled
              style={{ flex: 1, padding: '9px 14px', borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, color: B.muted, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.7 }}
            >
              <span style={{ fontSize: 14 }}>G</span> Google Workspace
            </button>
            <button
              type="button"
              disabled
              style={{ flex: 1, padding: '9px 14px', borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, color: B.muted, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.7 }}
            >
              <span style={{ fontSize: 14 }}>⊞</span> Microsoft 365
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: B.light }}>SSO coming soon</div>

        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: B.muted }}>
          Don&#39;t have an account?{' '}
          <Link href="/register" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            Create account
          </Link>
        </div>

      </div>
    </div>
  )
}
