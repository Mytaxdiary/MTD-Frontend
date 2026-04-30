'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateRegisterForm } from '@/validations/auth'
import B from '@/styles/theme'
import AuthPageLayout from '@/components/auth/authPageLayout'
import SSOPlaceholder from '@/components/auth/ssoPlaceholder'
import FormField from '@/components/ui/formField'
import { authInputStyle } from '@/lib/helpers/inputStyles'

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

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validateRegisterForm(form)
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    // TODO: connect to registration API in next phase
    setTimeout(() => {
      setSubmitting(false)
      router.push('/dashboard')
    }, 800)
  }

  return (
    <AuthPageLayout
      subtitle="Create your agent account"
      maxWidth={460}
      footerContent={
        <>Already have an account?{' '}
          <Link href="/login" style={{ color: B.primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>

        {/* First Name + Last Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>First name</label>
            <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Jane" style={authInputStyle(errors.firstName)} />
            {errors.firstName && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.firstName}</div>}
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>Last name</label>
            <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Walker" style={authInputStyle(errors.lastName)} />
            {errors.lastName && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{errors.lastName}</div>}
          </div>
        </div>

        <FormField label="Practice name" error={errors.practiceName} mb={18}>
          <input type="text" value={form.practiceName} onChange={set('practiceName')} placeholder="Walker & Co Accountants" style={authInputStyle(errors.practiceName)} />
        </FormField>

        <FormField label="Email address" error={errors.email} mb={18}>
          <input type="email" value={form.email} onChange={set('email')} placeholder="jane@walkerco.co.uk" style={authInputStyle(errors.email)} />
        </FormField>

        <FormField label="Password" error={errors.password} mb={20}>
          <input type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" style={authInputStyle(errors.password)} />
        </FormField>

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

        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: submitting ? B.xlight : B.primary, color: submitting ? B.muted : '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em' }}
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

      </form>

      <SSOPlaceholder dividerText="or sign up with" />

    </AuthPageLayout>
  )
}
