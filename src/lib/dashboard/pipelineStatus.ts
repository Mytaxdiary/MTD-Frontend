/**
 * Single pipeline status used by every dashboard view (list / kanban / year).
 * Keep in sync with mtd-api/src/modules/dashboard/pipeline-status.ts
 */
export const PIPELINE_STATUSES = [
  'pending-invite',
  'not-started',
  'chased',
  'records-received',
  'ready-for-review',
  'submitted',
] as const

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number]

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, string> = {
  'pending-invite': 'Pending invite',
  'not-started': 'Not started',
  chased: 'Chased',
  'records-received': 'Records received',
  'ready-for-review': 'Ready for review',
  submitted: 'Submitted',
}

export type PipelineBadgeStyle = { bg: string; c: string; b: string }

export const PIPELINE_STATUS_STYLES: Record<PipelineStatus, PipelineBadgeStyle> = {
  'pending-invite': { bg: '#F5F3FF', c: '#5B21B6', b: '#DDD6FE' },
  'not-started': { bg: '#F8FAFC', c: '#475569', b: '#CBD5E1' },
  chased: { bg: '#FFFBEB', c: '#92400E', b: '#FDE68A' },
  'records-received': { bg: '#F0F9FF', c: '#0C4A6E', b: '#7DD3FC' },
  'ready-for-review': { bg: '#ECFDF5', c: '#065F46', b: '#A7F3D0' },
  submitted: { bg: '#ECFDF5', c: '#065F46', b: '#A7F3D0' },
}

export const PIPELINE_KANBAN_COLS: {
  key: PipelineStatus
  label: string
  color: string
  bg: string
}[] = [
  { key: 'pending-invite', label: 'Pending invite', color: '#8B5CF6', bg: '#F5F3FF' },
  { key: 'not-started', label: 'Not started', color: '#94A3B8', bg: '#F8FAFC' },
  { key: 'chased', label: 'Chased', color: '#F59E0B', bg: '#FFFDF7' },
  { key: 'records-received', label: 'Records received', color: '#0EA5C9', bg: '#F0FAFE' },
  { key: 'ready-for-review', label: 'Ready for review', color: '#10B981', bg: '#ECFDF5' },
  { key: 'submitted', label: 'Submitted', color: '#059669', bg: '#F0FDF8' },
]

export function isPipelineStatus(value: string): value is PipelineStatus {
  return (PIPELINE_STATUSES as readonly string[]).includes(value)
}

export const MANUAL_PIPELINE_STATUSES = ['records-received', 'ready-for-review'] as const
export type ManualPipelineStatus = (typeof MANUAL_PIPELINE_STATUSES)[number]

export function nextManualPipelineStatus(current: PipelineStatus): ManualPipelineStatus | null {
  if (current === 'chased') return 'records-received'
  if (current === 'records-received') return 'ready-for-review'
  return null
}
