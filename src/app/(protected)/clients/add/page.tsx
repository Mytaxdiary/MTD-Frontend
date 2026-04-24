'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import AddClient from '@/features/clients/addClient'

export default function AddClientPage() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <AddClient navigate={navigate} />
}
