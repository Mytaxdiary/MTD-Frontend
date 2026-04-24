'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import ChaseManager from '@/features/chase/chaseManager'

export default function ChasePage() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <ChaseManager navigate={navigate} />
}
