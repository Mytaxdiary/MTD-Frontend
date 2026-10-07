const DEVICE_ID_KEY = 'mtd_hmrc_device_id'
const PUBLIC_IP_CACHE_KEY = 'mtd_hmrc_public_ip'
const IP_CACHE_MS = 5 * 60 * 1000
/** HMRC docs example — never send this as Gov-Client-Public-Port. */
const BANNED_EXAMPLE_PORTS = new Set(['12345'])

export interface FraudPreventionClientPayload {
  deviceId: string
  userAgent: string
  timezone: string
  screens: Array<{
    width: number
    height: number
    scalingFactor: number
    colourDepth: number
  }>
  windowWidth: number
  windowHeight: number
  publicIp?: string
  publicPort?: string
  publicIpTimestamp?: string
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `mtd-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY)
    if (existing) return existing
    const id = randomId()
    localStorage.setItem(DEVICE_ID_KEY, id)
    return id
  } catch {
    return randomId()
  }
}

function formatTimezone(): string {
  const offsetMin = -new Date().getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMin)
  const h = String(Math.floor(abs / 60)).padStart(2, '0')
  const m = String(abs % 60).padStart(2, '0')
  return `UTC${sign}${h}:${m}`
}

function collectScreens(): FraudPreventionClientPayload['screens'] {
  if (typeof window === 'undefined' || !window.screen) {
    return [{ width: 1920, height: 1080, scalingFactor: 1, colourDepth: 24 }]
  }
  const s = window.screen
  return [
    {
      width: s.width,
      height: s.height,
      scalingFactor: window.devicePixelRatio ?? 1,
      colourDepth: s.colorDepth ?? 24,
    },
  ]
}

/** HMRC rejects window larger than screen — clamp before send. */
export function clampWindowToScreens(
  windowWidth: number,
  windowHeight: number,
  screens: FraudPreventionClientPayload['screens']
): { width: number; height: number } {
  const primary = screens[0]
  const maxW = primary?.width && primary.width > 0 ? primary.width : windowWidth
  const maxH = primary?.height && primary.height > 0 ? primary.height : windowHeight
  return {
    width: Math.max(1, Math.min(Math.floor(windowWidth), maxW)),
    height: Math.max(1, Math.min(Math.floor(windowHeight), maxH)),
  }
}

function readCachedPublicIp(): string | undefined {
  try {
    const raw = sessionStorage.getItem(PUBLIC_IP_CACHE_KEY)
    if (!raw) return undefined
    const { ip, at } = JSON.parse(raw) as { ip: string; at: number }
    if (Date.now() - at > IP_CACHE_MS) return undefined
    return ip
  } catch {
    return undefined
  }
}

function cachePublicIp(ip: string): void {
  try {
    sessionStorage.setItem(PUBLIC_IP_CACHE_KEY, JSON.stringify({ ip, at: Date.now() }))
  } catch {
    // ignore
  }
}

/** Fetches the user's public IPv4 (browser cannot read it from localhost). */
export async function fetchClientPublicIp(): Promise<string | undefined> {
  const cached = readCachedPublicIp()
  if (cached) return cached

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeout)
    if (!res.ok) return undefined
    const data = (await res.json()) as { ip?: string }
    if (data.ip) {
      cachePublicIp(data.ip)
      return data.ip
    }
  } catch {
    // offline or blocked — IP optional; other headers still required
  }
  return undefined
}

/**
 * Optional configured port only — never invent 12345.
 * Browsers cannot read the real public TCP port for WEB_APP_VIA_SERVER.
 */
function configuredClientPublicPort(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_HMRC_CLIENT_PUBLIC_PORT?.trim()
  if (!raw || BANNED_EXAMPLE_PORTS.has(raw)) return undefined
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1 || n > 65535 || n === 80 || n === 443) return undefined
  return raw
}

/** Collects browser data for HMRC WEB_APP_VIA_SERVER (sent as X-Hmrc-Fraud-Context). */
export function collectFraudPreventionPayload(): FraudPreventionClientPayload {
  const screens = collectScreens()
  const rawW = typeof window !== 'undefined' ? window.innerWidth : 1920
  const rawH = typeof window !== 'undefined' ? window.innerHeight : 1080
  const clamped = clampWindowToScreens(rawW, rawH, screens)
  return {
    deviceId: getOrCreateDeviceId(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timezone: formatTimezone(),
    screens,
    windowWidth: clamped.width,
    windowHeight: clamped.height,
  }
}

/** Same as collectFraudPreventionPayload but enriches with public IP + port when available. */
export async function collectFraudPreventionPayloadAsync(): Promise<FraudPreventionClientPayload> {
  const payload = collectFraudPreventionPayload()
  const publicIp = await fetchClientPublicIp()
  if (publicIp) {
    payload.publicIp = publicIp
    payload.publicIpTimestamp = new Date().toISOString()
    const port = configuredClientPublicPort()
    if (port) payload.publicPort = port
  }
  return payload
}

export function encodeFraudContextHeader(payload: FraudPreventionClientPayload): string {
  const json = JSON.stringify(payload)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
