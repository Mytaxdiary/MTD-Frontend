/**
 * Client portal login page tests
 * File: src/app/portal/login/page.tsx
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PortalLoginPage from '@/app/portal/login/page'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn()
const mockPortalLogin = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/services/portal.service', () => ({
  __esModule: true,
  default: { login: (...args: unknown[]) => mockPortalLogin(...args) },
}))

jest.mock('@/lib/auth/portalTokenStorage', () => ({
  setPortalSessionCookie: jest.fn(),
}))

jest.mock('@/components/ui/LegalFooter', () => {
  const LegalFooter = () => <div data-testid="legal-footer" />
  LegalFooter.displayName = 'LegalFooter'
  return LegalFooter
})

jest.mock('@/styles/theme', () => ({
  white: '#fff',
  border: '#e2e8f0',
  cardShadow: 'none',
  text: '#0f172a',
  muted: '#64748b',
  redBg: '#FFF5F5',
  redText: '#DC2626',
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

// Portal login page has labels without htmlFor — identify inputs by placeholder
const getEmailInput = () => screen.getByPlaceholderText('you@example.com')
const getPasswordInput = () => screen.getByPlaceholderText('Enter your password')
const getSubmitButton = () => screen.getByRole('button', { name: /sign in/i })

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('Portal Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── Render ──────────────────────────────────────────────────────────────────

  it('renders email field, password field and sign in button', () => {
    render(<PortalLoginPage />)

    expect(getEmailInput()).toBeInTheDocument()
    expect(getPasswordInput()).toBeInTheDocument()
    expect(getSubmitButton()).toBeInTheDocument()
  })

  it('renders the portal heading', () => {
    render(<PortalLoginPage />)

    expect(screen.getByText(/sign in to your portal/i)).toBeInTheDocument()
  })

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('calls portalService.login with email and password on submit', async () => {
    mockPortalLogin.mockResolvedValue({ name: 'Carol Upton' })
    render(<PortalLoginPage />)

    await userEvent.type(getEmailInput(), 'carol@example.com')
    await userEvent.type(getPasswordInput(), 'MyPassword1')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(mockPortalLogin).toHaveBeenCalledWith('carol@example.com', 'MyPassword1')
    })
  })

  it('redirects to /portal/dashboard on successful login', async () => {
    mockPortalLogin.mockResolvedValue({ name: 'Carol Upton' })
    render(<PortalLoginPage />)

    await userEvent.type(getEmailInput(), 'carol@example.com')
    await userEvent.type(getPasswordInput(), 'MyPassword1')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/portal/dashboard')
    })
  })

  // ── Error state ─────────────────────────────────────────────────────────────

  it('shows "Invalid email or password" error on wrong credentials', async () => {
    mockPortalLogin.mockRejectedValue(new Error('Unauthorized'))
    render(<PortalLoginPage />)

    await userEvent.type(getEmailInput(), 'carol@example.com')
    await userEvent.type(getPasswordInput(), 'wrongpassword')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('does not redirect to dashboard when login fails', async () => {
    mockPortalLogin.mockRejectedValue(new Error('Unauthorized'))
    render(<PortalLoginPage />)

    await userEvent.type(getEmailInput(), 'carol@example.com')
    await userEvent.type(getPasswordInput(), 'wrongpassword')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  // ── Loading state ───────────────────────────────────────────────────────────

  it('disables submit button and shows "Signing in..." while request is in flight', async () => {
    // Promise that never resolves keeps loading = true
    mockPortalLogin.mockReturnValue(new Promise(() => {}))
    render(<PortalLoginPage />)

    await userEvent.type(getEmailInput(), 'carol@example.com')
    await userEvent.type(getPasswordInput(), 'MyPassword1')
    fireEvent.click(getSubmitButton())

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    })
  })
})
