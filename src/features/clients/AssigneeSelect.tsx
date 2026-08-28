'use client'

import { useState } from 'react'
import B from '@/styles/theme'
import { clientsService } from '@/services/clients.service'
import type { AssignablePerson } from './useAssignableStaff'

interface Props {
  clientId: string
  assignedToUserId?: string | null
  people: AssignablePerson[]
  disabled?: boolean
  compact?: boolean
  onAssigned: (assignedToUserId: string | null) => void
}

export default function AssigneeSelect({
  clientId,
  assignedToUserId,
  people,
  disabled = false,
  compact = false,
  onAssigned,
}: Props) {
  const [saving, setSaving] = useState(false)
  const value = assignedToUserId ?? ''

  async function handleChange(next: string) {
    const assignedTo = next === '' ? null : next
    if (assignedTo === (assignedToUserId ?? null)) return
    setSaving(true)
    try {
      const updated = await clientsService.assign(clientId, assignedTo)
      onAssigned(updated.assignedToUserId ?? null)
    } catch (err) {
      alert((err as Error)?.message ?? 'Could not update assignment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      aria-label="Assigned to"
      value={value}
      disabled={disabled || saving}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        e.stopPropagation()
        void handleChange(e.target.value)
      }}
      style={{
        maxWidth: compact ? 160 : 220,
        padding: compact ? '5px 8px' : '7px 10px',
        borderRadius: 8,
        border: `1px solid ${B.border}`,
        background: B.white,
        fontSize: compact ? 12 : 13,
        color: B.text,
        cursor: saving || disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <option value="">Unassigned</option>
      {people.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
          {p.role === 'owner' ? ' (Owner)' : ''}
        </option>
      ))}
    </select>
  )
}
