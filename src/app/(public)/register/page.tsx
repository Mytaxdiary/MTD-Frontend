'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const B = {
  primary: '#0EA5C9', primaryDark: '#0284A8', navy: '#1B2A4A',
  surface: '#F8FAFC', white: '#FFFFFF', border: '#E2E8F0', borderLight: '#F1F5F9',
  text: '#0F172A', muted: '#64748B', light: '#94A3B8', xlight: '#CBD5E1',
  red: '#EF4444', redBg: '#FEF2F2', redText: '#991B1B',
}

interface FormFields {
  firstName: string
  lastName: string
  practiceName: string
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormFields>({ firstName: '', lastName: '', practiceName: '', email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const set = (key: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    setErrors(p => ({ ...p, [key]: undefined }))
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.practiceName.trim()) e.practiceName = 'Practice name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    return e
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    // TODO: connect to registration API in next phase
    setTimeout(() => {
      setSubmitting(false)
      router.push('/dashboard')
    }, 800)
  }

  const inputStyle = (hasError?: string) => ({
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${hasError ? '#FECACA' : B.border}`,
    fontSize: 13, outline: 'none', background: B.white, color: B.text,
    boxSizing: 'border-box' as const,
  })

  return (
    <div style={{ minHeight: '100vh', background: B.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${B.primary},${B.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 14, boxShadow: '0 4px 12px rgba(14,165,201,0.3)' }}>
            NE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: '-0.02em' }}>NewEffect MTD ITSA</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>Create your agent account</div>
        </div>

        {/* Card */}
        <div style={{ background: B.white, borderRadius: 16, border: `1px solid ${B.border}`, padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* First Name + Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>First name</label>
                <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Jane" style={inputStyle(errors.firstName)} />
                {errors.firstName && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.firstName}</div>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Last name</label>
                <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Walker" style={inputStyle(errors.lastName)} />
                {errors.lastName && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.lastName}</div>}
              </div>
            </div>

            {/* Practice Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Practice name</label>
              <input type="text" value={form.practiceName} onChange={set('practiceName')} placeholder="Walker & Co Accountants" style={inputStyle(errors.practiceName)} />
              {errors.practiceName && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.practiceName}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Email address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="jane@walkerco.co.uk" style={inputStyle(errors.email)} />
              {errors.email && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" style={inputStyle(errors.password)} />
              {errors.password && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.password}</div>}
            </div>

            {/* Captcha placeholder */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ padding: '16px', borderRadius: 8, border: `1px dashed ${B.xlight}`, background: B.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${B.xlight}`, background: B.white }} />
                  <span style={{ fontSize: 13, color: B.light }}>I&#39;m not a robot</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: B.xlight, fontWeight: 600, letterSpacing: '0.04em' }}>CAPTCHA</div>
                  <div style={{ fontSize: 9, color: B.xlight }}>placeholder</div>
                </div>
              </div>
              {/* TODO: integrate reCAPTCHA or hCaptcha in next phase */}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: submitting ? B.xlight : B.primary, color: submitting ? B.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em' }}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: B.border }} />
            <span style={{ fontSize: 11, color: B.light, fontWeight: 500, whiteSpace: 'nowrap' }}>or sign up with</span>
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
          Already have an account?{' '}
          <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>

      </div>
    </div>
  )
}
