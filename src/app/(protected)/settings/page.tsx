'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import Settings from '@/features/settings/settings'

export default function SettingsPage() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <Settings navigate={navigate} />
}
