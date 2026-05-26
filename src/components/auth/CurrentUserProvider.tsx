'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService, type AuthUser } from '@/services/auth.service'

interface CurrentUserContextValue {
  user: AuthUser | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined)

export default function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to load profile')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ user, loading, error, refresh }),
    [user, loading, error, refresh],
  )

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) {
    throw new Error('useCurrentUser must be used inside CurrentUserProvider')
  }
  return ctx
}

/** Returns "JW" from "Jane Walker" — first letter of first two words. Fallback "?". */
export function userInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return (first + second).toUpperCase() || '?'
}

/** Returns the first word of the user's name (e.g. "Jane" from "Jane Walker"). */
export function firstName(name?: string | null): string {
  if (!name) return ''
  return name.trim().split(/\s+/)[0] ?? ''
}
