'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import BrandLogo from '@/components/ui/BrandLogo'
import SiteButton from './SiteButton'
import SiteContainer from './SiteContainer'
import { SITE_APP_LOGIN, SITE_APP_REGISTER, SITE_NAV } from '../nav'

function isActive(pathname: string, href: string) {
  if (href === '/site') return pathname === '/site'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="mtd-site-header">
      <SiteContainer>
        <div className="mtd-site-header__inner">
          <Link href="/site" className="mtd-site-header__brand" aria-label="My Tax Diary home">
            <BrandLogo width={168} priority />
          </Link>

          <nav className="mtd-site-header__nav" aria-label="Primary">
            {SITE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mtd-site-header__link"
                data-active={isActive(pathname, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mtd-site-header__actions">
            <SiteButton href={SITE_APP_LOGIN} variant="ghost">
              Sign in
            </SiteButton>
            <SiteButton href={SITE_APP_REGISTER} variant="secondary">
              Get started
            </SiteButton>
          </div>

          <button
            type="button"
            className="mtd-site-header__menu-btn"
            aria-expanded={open}
            aria-controls="mtd-site-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </SiteContainer>

      <div id="mtd-site-mobile-nav" className="mtd-site-header__mobile" data-open={open}>
        <nav className="mtd-site-header__mobile-nav" aria-label="Mobile">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mtd-site-header__link"
              data-active={isActive(pathname, item.href)}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mtd-site-header__mobile-actions">
          <SiteButton href={SITE_APP_LOGIN} variant="ghost" block>
            Sign in
          </SiteButton>
          <SiteButton href={SITE_APP_REGISTER} variant="secondary" block>
            Get started
          </SiteButton>
        </div>
      </div>
    </header>
  )
}
