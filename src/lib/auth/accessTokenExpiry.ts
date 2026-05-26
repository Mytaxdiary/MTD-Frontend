const STORAGE_KEY = 'mtd_at_exp'

/** Persist access-token expiry from login / refresh / session (non-sensitive). */
export function setAccessTokenExpiry(iso: string): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, iso)
}

export function getAccessTokenExpiry(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(STORAGE_KEY)
}

export function clearAccessTokenExpiry(): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}

/** True if expiry is missing or within bufferMs of now. */
export function isAccessTokenExpiringSoon(bufferMs = 60_000): boolean {
  const iso = getAccessTokenExpiry()
  if (!iso) return true
  return new Date(iso).getTime() - Date.now() < bufferMs
}
