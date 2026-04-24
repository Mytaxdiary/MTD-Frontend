'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import ClientDetail from '@/features/clients/clientDetail'

export default function ClientDetailPage() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <ClientDetail navigate={navigate} />
}
