/**
 * Route keys (legacy navigate() string values) and their Next.js URL paths.
 */
export const ROUTES = {
  DASHBOARD: 'dashboard',
  CLIENTS: 'clients',
  ADD_CLIENT: 'add-client',
  CLIENT_DETAIL: 'client-detail',
  CHASE: 'chase',
  QUARTERLY_REVIEW: 'quarterly-review',
  SETTINGS: 'settings',
} as const

export type RouteKey = (typeof ROUTES)[keyof typeof ROUTES]

/** Maps the legacy navigate(key) string to its Next.js URL path. */
export const ROUTE_PATHS: Record<string, string> = {
  'dashboard': '/dashboard',
  'clients': '/clients',
  'add-client': '/clients/add',
  'client-detail': '/clients/detail',
  'chase': '/chase',
  'quarterly-review': '/quarterly-review',
  'settings': '/settings',
}

/** Maps a URL pathname back to the nav-item key for active-state highlighting. */
export const PATH_ACTIVE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/clients': 'clients',
  '/clients/add': 'add-client',
  '/clients/detail': 'clients',
  '/chase': 'chase',
  '/quarterly-review': 'clients',
  '/settings': 'settings',
}
