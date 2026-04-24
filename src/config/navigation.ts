import type { RouteKey } from './routes'

export interface NavItemConfig {
  label: string
  icon: string
  route: RouteKey
  /** Pages on which this nav item appears active */
  activeOn: RouteKey[]
  /** If set, show the named badge count */
  badge?: 'overdue'
}

export const NAV_SECTIONS: { main: NavItemConfig[]; manage: NavItemConfig[] } = {
  main: [
    { label: 'Dashboard',     icon: '⊞', route: 'dashboard', activeOn: ['dashboard'] },
    { label: 'Clients',       icon: '⊡', route: 'clients',   activeOn: ['clients', 'client-detail', 'quarterly-review'] },
    { label: 'Chase manager', icon: '↗', route: 'chase',     activeOn: ['chase'], badge: 'overdue' },
    { label: 'Filing status', icon: '◎', route: 'dashboard', activeOn: [] },
  ],
  manage: [
    { label: 'Add client',      icon: '+',  route: 'add-client', activeOn: ['add-client'] },
    { label: 'Settings',        icon: '⚙',  route: 'settings',   activeOn: ['settings'] },
    { label: 'HMRC connection', icon: '⟷', route: 'settings',   activeOn: [] },
  ],
}
