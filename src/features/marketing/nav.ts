/** Final marketing origin (apex). App stays on app.mytaxdiary.co.uk. */
export const SITE_ORIGIN = 'https://mytaxdiary.co.uk'
export const APP_ORIGIN = 'https://app.mytaxdiary.co.uk'

export const SITE_HOME = SITE_ORIGIN

export const SITE_PAGES = {
  home: SITE_HOME,
  features: `${SITE_ORIGIN}/features`,
  pricing: `${SITE_ORIGIN}/pricing`,
  contact: `${SITE_ORIGIN}/contact`,
} as const

export const SITE_NAV = [
  { href: SITE_PAGES.home, label: 'Home' },
  { href: SITE_PAGES.features, label: 'Features' },
  { href: SITE_PAGES.pricing, label: 'Pricing' },
  { href: SITE_PAGES.contact, label: 'Contact' },
] as const

export const SITE_LEGAL = {
  terms: `${SITE_ORIGIN}/terms`,
  privacy: `${SITE_ORIGIN}/privacy`,
  cookies: `${SITE_ORIGIN}/cookies`,
} as const

/** Agent auth lives on the app subdomain to avoid apex CORS. */
export const SITE_APP_LOGIN = `${APP_ORIGIN}/login`
export const SITE_APP_REGISTER = `${APP_ORIGIN}/register`
