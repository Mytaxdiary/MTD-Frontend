import axiosClient from '@/lib/api/axiosClient';

// ── Payload types ──────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  practiceName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

// ── Response types ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  firmName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

// ── Service ────────────────────────────────────────────────────────────────

/**
 * Auth API service.
 * All methods are pre-wired to the backend contract from mtd-api.
 * The auth pages currently use setTimeout stubs — replace those calls
 * with these methods once the auth module is live in the backend.
 *
 * TODO (auth phase): swap setTimeout in login/register pages with calls here.
 */
export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<{ success: true; data: AuthResponse }>(
      '/auth/login',
      payload,
    );
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<{ success: true; data: AuthResponse }>(
      '/auth/register',
      payload,
    );
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await axiosClient.post('/auth/forgot-password', payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await axiosClient.post('/auth/reset-password', payload);
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken'>> => {
    const { data } = await axiosClient.post<{
      success: true;
      data: Pick<AuthResponse, 'accessToken' | 'refreshToken'>;
    }>('/auth/refresh', { refreshToken });
    return data.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },
};
