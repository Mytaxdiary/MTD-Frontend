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
}

module.exports = nextConfig
