import type { MetadataRoute } from 'next'

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://mytaxdiary.co.uk'
  )
}

export default function robots(): MetadataRoute.Robots {
  const base = siteOrigin()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/',
          '/dashboard/',
          '/clients/',
          '/settings/',
          '/chase/',
          '/quarterly-review/',
          '/login',
          '/register',
          '/mfa',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/check-email',
          '/accept-invite',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
