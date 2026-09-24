import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/auth/protectedRoute'
import AdminShell from '@/components/admin/AdminShell'

/**
 * Protected admin layout — platform product-owner only.
 */
export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdminAuth()
  if (!isAdmin) {
    redirect('/admin/login')
  }
  return <AdminShell>{children}</AdminShell>
}
