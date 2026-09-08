import type { ReactNode } from 'react'

export default function SiteContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={['mtd-site-container', className].filter(Boolean).join(' ')}>{children}</div>
}
