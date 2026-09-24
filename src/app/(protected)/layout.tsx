import { redirect } from 'next/navigation'
import { checkAuth, getSessionKind } from '@/lib/auth/protectedRoute'
import AppShell from '@/components/layout/appShell'

/**
 * Protected layout — wraps authenticated firm (accountant) routes.
 * Platform admins are sent to /admin.
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await checkAuth()
  if (!authenticated) {
    redirect('/login')
  }
  if ((await getSessionKind()) === 'admin') {
    redirect('/admin')
  }
  return <AppShell>{children}</AppShell>
}
