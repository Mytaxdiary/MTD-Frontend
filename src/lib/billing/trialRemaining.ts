export interface TrialRemaining {
  daysLeft: number
  endsLabel: string
  urgent: boolean
}

/** Days remaining until trialEndsAt (ceil). Null if not on an active trial window. */
export function getTrialRemaining(
  billingStatus: string | null | undefined,
  trialEndsAt: string | null | undefined,
  now = new Date()
): TrialRemaining | null {
  if (billingStatus !== 'trial' || !trialEndsAt) return null
  const ends = new Date(trialEndsAt)
  if (Number.isNaN(ends.getTime())) return null
  const ms = ends.getTime() - now.getTime()
  if (ms <= 0) return null
  const daysLeft = Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)))
  const endsLabel = ends.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return {
    daysLeft,
    endsLabel,
    urgent: daysLeft <= 2,
  }
}
