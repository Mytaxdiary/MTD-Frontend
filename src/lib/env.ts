/**
 * Safe, typed environment variable access helper.
 * All variables used across the app should be read from here, never directly from process.env.
 *
 * Public vars (exposed to browser) must be prefixed with NEXT_PUBLIC_
 * Server-only vars must NOT be prefixed with NEXT_PUBLIC_
 */

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function optionalEnv(key: string, fallback: string = ''): string {
  return process.env[key] ?? fallback
}

export const env = {
  appName: optionalEnv('NEXT_PUBLIC_APP_NAME', 'NewEffect MTD ITSA'),
  appEnv: optionalEnv('NEXT_PUBLIC_APP_ENV', 'development'),
  apiBaseUrl: optionalEnv('NEXT_PUBLIC_API_BASE_URL', ''),
} as const

export { requireEnv, optionalEnv }
