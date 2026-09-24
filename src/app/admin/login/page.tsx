'use client'

import { useState } from 'react'
import Link from 'next/link'
import { validateLoginForm } from '@/validations/auth'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import FormField from '@/components/ui/formField'
import { authInputStyle } from '@/lib/helpers/inputStyles'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLoginPage() {
  const { adminLogin, loading, error: apiError } = useAuth()
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
    await adminLogin({ email, password })
  }

  return (
    <AuthPageLayout
      subtitle="Platform admin sign-in"
      footerContent={
        <>
          Accountant?{' '}
          <Link
            href="/login"
            style={{ color: B.link, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
          >
            Agent login
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
            placeholder="info@mytaxdiary.co.uk"
            style={authInputStyle(errors.email)}
            autoComplete="username"
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
            autoComplete="current-password"
          />
        </FormField>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <Link
            href="/forgot-password"
            style={{ fontSize: 12, color: B.link, fontWeight: 500, textDecoration: 'none' }}
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
            background: loading ? B.light : B.primaryBtn,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign in to admin'}
        </button>
      </form>
    </AuthPageLayout>
  )
}
