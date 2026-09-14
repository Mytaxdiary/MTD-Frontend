import type { MetadataRoute } from 'next'

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://mytaxdiary.co.uk'
  )
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteOrigin()
  const now = new Date()

  const paths = [
    '/site',
    '/site/features',
    '/site/pricing',
    '/site/contact',
    '/site/terms',
    '/site/privacy',
    '/site/cookies',
    '/terms',
    '/privacy-policy',
    '/cookies',
  ]

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/site' ? 'weekly' : 'monthly',
    priority: path === '/site' ? 1 : path.startsWith('/site/') ? 0.8 : 0.5,
  }))
}
