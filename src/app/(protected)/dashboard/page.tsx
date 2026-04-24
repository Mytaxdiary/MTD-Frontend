'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import Dashboard from '@/features/dashboard/agentDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <Dashboard navigate={navigate} />
}
