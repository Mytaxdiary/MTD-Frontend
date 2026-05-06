'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  authService,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/services/auth.service';

interface AuthState {
  loading: boolean;
  error: string | null;
}

/**
 * Auth hook — wraps authService calls with loading/error state.
 *
 * The auth pages currently use their own useState + setTimeout stubs.
 * TODO (auth phase): replace those stubs with useAuth() calls.
 *
 * Usage:
 *   const { login, loading, error } = useAuth();
 *   await login({ email, password });
 */
export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ loading: false, error: null });

  const setLoading = (loading: boolean) => setState((s) => ({ ...s, loading }));
  const setError = (error: string | null) => setState((s) => ({ ...s, error }));

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      setError(null);
      try {
        await authService.login(payload);
        // TODO (auth phase): store tokens in secure cookie/storage here
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      setError(null);
      try {
        await authService.register(payload);
        // TODO (auth phase): store tokens here
        router.push('/dashboard');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Registration failed. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Password reset failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors — always redirect
    } finally {
      // TODO (auth phase): clear stored tokens here
      router.push('/login');
    }
  }, [router]);

  return { ...state, login, register, forgotPassword, resetPassword, logout };
}
