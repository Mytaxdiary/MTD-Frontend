/**
 * Typed environment variable access.
 *
 * IMPORTANT: Next.js only inlines NEXT_PUBLIC_ vars at build time when accessed
 * as static string literals (process.env.NEXT_PUBLIC_FOO).
 * Dynamic access like process.env[key] does NOT work client-side — always use
 * direct property references below.
 */

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'NewEffect MTD ITSA',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
} as const
