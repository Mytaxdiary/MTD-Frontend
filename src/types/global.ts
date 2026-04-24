import type { RouteKey } from '@/config/routes'

/**
 * Navigation prop passed to every screen component.
 * Mirrors the current navigate(page: string) => void contract in App.jsx.
 */
export interface NavigateProps {
  navigate: (route: RouteKey) => void
}

/**
 * Placeholder for future API response shape.
 */
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
}
