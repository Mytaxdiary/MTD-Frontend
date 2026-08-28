'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/hooks/usePermissions'

/** Redirects away when the signed-in user lacks the given permission. */
export default function PermissionGate({
  allow,
  redirectTo = '/dashboard',
  children,
}: {
  allow: boolean
  redirectTo?: string
  children: React.ReactNode
}) {
  const { loading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !allow) router.replace(redirectTo)
  }, [loading, allow, redirectTo, router])

  if (loading || !allow) return null
  return children
}
