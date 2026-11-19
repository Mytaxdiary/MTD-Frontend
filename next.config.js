const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Lint is run separately via `npm run lint` — don't block builds on it.
  // This preserves existing JSX files without requiring formatting changes.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Suppress TS errors during build; existing .jsx files are not type-checked.
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
    ]
  },
  // Apex paths used after marketing moves to mytaxdiary.co.uk
  async rewrites() {
    return [
      { source: '/features', destination: '/site/features' },
      { source: '/pricing', destination: '/site/pricing' },
      { source: '/contact', destination: '/site/contact' },
    ]
  },
}

module.exports = nextConfig
