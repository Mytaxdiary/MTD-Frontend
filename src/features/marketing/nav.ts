export const SITE_NAV = [
  { href: '/site', label: 'Home' },
  { href: '/site/features', label: 'Features' },
  { href: '/site/pricing', label: 'Pricing' },
  { href: '/site/contact', label: 'Contact' },
] as const

export const SITE_LEGAL = {
  terms: '/site/terms',
  privacy: '/site/privacy',
  cookies: '/site/cookies',
} as const

export const SITE_APP_LOGIN = '/login'
export const SITE_APP_REGISTER = '/register'
