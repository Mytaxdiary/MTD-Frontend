/**
 * Agent login page tests
 * File: src/app/(public)/login/page.tsx
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(public)/login/page'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockLogin = jest.fn()
const mockPush = jest.fn()

// Mutable so individual tests can override loading/error
let mockAuthReturn = { login: mockLogin, loading: false, error: null as string | null }

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
  Link.displayName = 'Link'
  return Link
})

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuthReturn,
}))

jest.mock('@/components/auth/authPageLayout', () => {
  const AuthPageLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  AuthPageLayout.displayName = 'AuthPageLayout'
  return AuthPageLayout
})

jest.mock('@/components/auth/ssoPlaceholder', () => {
  const SSOPlaceholder = () => <div data-testid="sso-placeholder" />
  SSOPlaceholder.displayName = 'SSOPlaceholder'
  return SSOPlaceholder
})

jest.mock('@/components/ui/formField', () => {
  const FormField = ({
    children,
    error,
    label,
  }: {
    children: React.ReactNode
    error?: string
    label: string
  }) => (
    <div>
      <label>{label}</label>
      {children}
      {error && <span role="alert">{error}</span>}
    </div>
  )
  FormField.displayName = 'FormField'
  return FormField
})

jest.mock('@/styles/theme', () => ({}))
jest.mock('@/lib/helpers/inputStyles', () => ({ authInputStyle: () => ({}) }))

// ── Helpers ───────────────────────────────────────────────────────────────────

// Agent login page uses placeholders to identify inputs (no htmlFor on labels)
const getEmailInput = () => screen.getByPlaceholderText('jane@walkerco.co.uk')
const getPasswordInput = () => screen.getByPlaceholderText('••••••••')
const getSubmitButton = () => screen.getByRole('button', { name: /sign in/i })

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('Agent Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthReturn = { login: mockLogin, loading: false, error: null }
  })

  // ── Render ──────────────────────────────────────────────────────────────────

  it('renders email field, password field and sign in button', () => {
    render(<LoginPage />)

    expect(getEmailInput()).toBeInTheDocument()
    expect(getPasswordInput()).toBeInTheDocument()
    expect(getSubmitButton()).toBeInTheDocument()
  })

  // ── Validation ──────────────────────────────────────────────────────────────

  it('shows "Email is required" when submitting with empty email', async () => {
    render(<LoginPage />)

    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('shows "Password is required" when email is filled but password is empty', async () => {
    render(<LoginPage />)

    await userEvent.type(getEmailInput(), 'user@example.com')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('shows "Enter a valid email address" for invalid email format', async () => {
    render(<LoginPage />)

    await userEvent.type(getEmailInput(), 'not-an-email')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('calls login() with email and password on valid submit', async () => {
    mockLogin.mockResolvedValue(undefined)
    render(<LoginPage />)

    await userEvent.type(getEmailInput(), 'john@example.com')
    await userEvent.type(getPasswordInput(), 'Secret123')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Secret123',
      })
    })
  })

  // ── API error ───────────────────────────────────────────────────────────────

  it('displays API error message when useAuth provides an error', () => {
    mockAuthReturn = { login: mockLogin, loading: false, error: 'Invalid credentials' }
    render(<LoginPage />)

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('does not show error block when there is no API error', () => {
    mockAuthReturn = { login: mockLogin, loading: false, error: null }
    render(<LoginPage />)

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
  })

  // ── Loading state ───────────────────────────────────────────────────────────

  it('shows "Signing in…" and disables the button while loading', () => {
    mockAuthReturn = { login: mockLogin, loading: true, error: null }
    render(<LoginPage />)

    const button = screen.getByRole('button', { name: /signing in/i })
    expect(button).toBeDisabled()
  })
})
