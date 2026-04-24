import type { RouteKey } from '@/config/routes'

export interface AppShellProps {
  navigate: (page: RouteKey) => void
  activePage: RouteKey
  children: React.ReactNode
  overdueCount?: number
}

export interface AppSidebarProps {
  navigate: (page: RouteKey) => void
  activePage: RouteKey
  overdueCount?: number
}
