import axiosClient from '@/lib/api/axiosClient'

// ── Payload types ──────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  practiceName: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

// ── Response types ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  firmName: string
  isEmailVerified: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser
}

// ── Service ────────────────────────────────────────────────────────────────

/**
 * Auth API service.
 * Tokens are managed as httpOnly cookies by the backend.
 * The browser sends/receives them automatically — no manual handling needed.
 */
export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<{ success: true; data: AuthResponse }>(
      '/auth/login',
      payload
    )
    return data.data
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<{ success: true; data: AuthResponse }>(
      '/auth/register',
      payload
    )
    return data.data
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await axiosClient.post('/auth/forgot-password', payload)
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await axiosClient.post('/auth/reset-password', payload)
  },

  /**
   * Silent refresh — no body needed.
   * The refresh token httpOnly cookie is sent automatically by the browser.
   */
  refreshToken: async (): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken'>> => {
    const { data } = await axiosClient.post<{
      success: true
      data: Pick<AuthResponse, 'accessToken' | 'refreshToken'>
    }>('/auth/refresh')
    return data.data
  },

  /**
   * Logout — no body needed.
   * The backend reads the refresh token from the httpOnly cookie and clears both cookies.
   */
  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout')
  },

  /**
   * Verify email address with the token from the verification email link.
   */
  verifyEmail: async (token: string): Promise<void> => {
    await axiosClient.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
  },

  getProfile: async (): Promise<AuthUser> => {
    const { data } = await axiosClient.get<{ success: true; data: AuthUser }>('/auth/profile')
    return data.data
  },
}
