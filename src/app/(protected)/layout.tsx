import { redirect } from 'next/navigation'
import { checkAuth } from '@/lib/auth/protectedRoute'
import AppShell from '@/components/layout/appShell'

/**
 * Protected layout — wraps all authenticated app routes.
 * Redirects unauthenticated users to /login.
 * TODO: When real auth is wired, checkAuth() will read a real session/cookie.
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await checkAuth()
  if (!authenticated) {
    redirect('/login')
  }
  return <AppShell>{children}</AppShell>
}
