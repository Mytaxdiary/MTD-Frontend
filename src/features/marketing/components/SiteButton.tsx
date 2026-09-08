import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'on-dark'

type SiteButtonProps = {
  href?: string
  variant?: Variant
  block?: boolean
  className?: string
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}

function buttonClass(variant: Variant, block?: boolean, className?: string) {
  const parts = ['mtd-btn', `mtd-btn--${variant}`]
  if (block) parts.push('mtd-btn--block')
  if (className) parts.push(className)
  return parts.join(' ')
}

export default function SiteButton({
  href,
  variant = 'primary',
  block,
  className,
  children,
  onClick,
  type = 'button',
}: SiteButtonProps) {
  const cls = buttonClass(variant, block, className)

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
