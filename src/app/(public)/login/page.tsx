'use client'
import Link from 'next/link'
import { validateLoginForm } from '@/validations/auth'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import SSOPlaceholder from '@/components/auth/ssoPlaceholder'
import FormField from '@/components/ui/formField'
import { authInputStyle } from '@/lib/helpers/inputStyles'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function LoginPage() {
  const { login, loading, error: apiError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validateLoginForm(email, password)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    await login({ email, password })
  }

  return (
    <AuthPageLayout
      subtitle="Sign in to your agent account"
      footerContent={
        <>
          Don&#39;t have an account?{' '}
          <Link
            href="/register"
            style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
          >
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {apiError && (
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
            {apiError}
          </div>
        )}

        <FormField label="Email address" error={errors.email} mb={18}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((p) => ({ ...p, email: undefined }))
            }}
            placeholder="jane@walkerco.co.uk"
            style={authInputStyle(errors.email)}
          />
        </FormField>

        <FormField label="Password" error={errors.password} mb={8}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((p) => ({ ...p, password: undefined }))
            }}
            placeholder="••••••••"
            style={authInputStyle(errors.password)}
          />
        </FormField>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <Link
            href="/forgot-password"
            style={{ fontSize: 12, color: B.primary, fontWeight: 500, textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 8,
            border: 'none',
            background: loading ? B.xlight : B.primary,
            color: loading ? B.muted : '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            letterSpacing: '0.01em',
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <SSOPlaceholder dividerText="or continue with" />
    </AuthPageLayout>
  )
}
