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
    '/',
    '/features',
    '/pricing',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
  ]

  return paths.map((path) => ({
    url: path === '/' ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
