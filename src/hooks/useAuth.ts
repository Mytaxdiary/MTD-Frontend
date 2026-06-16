'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  authService,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/services/auth.service'
import { setAccessTokenExpiry, clearAccessTokenExpiry } from '@/lib/auth/accessTokenExpiry'
import { setSessionCookie, clearSessionCookie } from '@/lib/auth/tokenStorage'

interface AuthState {
  loading: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({ loading: false, error: null })

  const setLoading = (loading: boolean) => setState((s) => ({ ...s, loading }))
  const setError = (error: string | null) => setState((s) => ({ ...s, error }))

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.login(payload)

        // MFA required — store challenge token and redirect to /mfa page
        if (response.requiresMfa && response.mfaToken) {
          sessionStorage.setItem('mfa_token', response.mfaToken)
          router.push('/mfa')
          return
        }

        // Backend sets httpOnly cookies; no manual token handling needed
        setAccessTokenExpiry(response.accessTokenExpiresAt)
        setSessionCookie()

        if (!response.user.isEmailVerified) {
          router.push(`/check-email?email=${encodeURIComponent(payload.email)}`)
        } else {
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('Login error:', err)
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true)
      setError(null)
      try {
        // Backend sets httpOnly cookies; no manual token handling needed
        const response = await authService.register(payload)
        setAccessTokenExpiry(response.accessTokenExpiresAt)
        setSessionCookie()

        if (!response.user.isEmailVerified) {
          router.push(`/check-email?email=${encodeURIComponent(payload.email)}`)
        } else {
          router.push('/dashboard')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await authService.forgotPassword(payload)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (payload: ResetPasswordPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await authService.resetPassword(payload)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore logout API errors — always clear session and redirect
    } finally {
      clearAccessTokenExpiry()
      clearSessionCookie()
      router.push('/login')
    }
  }, [router])

  return { ...state, login, register, forgotPassword, resetPassword, logout }
}
