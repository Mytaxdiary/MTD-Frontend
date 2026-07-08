'use client'
import { useCallback, useEffect, useState } from 'react'
import {
  chaseTemplatesService,
  type ChaseTemplateRecord,
  type CreateChaseTemplatePayload,
} from '@/services/chaseTemplates.service'
import {
  chaseService,
  renderTemplate,
  type ChaseClientRecord,
} from '@/services/chase.service'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import B from '@/styles/theme'

const ResponseBadge = ({ status }: { status: string }) => {
  const m: Record<string, { bg: string; c: string; b: string; l: string }> = {
    'no-response': { bg: B.redBg,    c: B.redText,    b: '#FECACA', l: 'No response' },
    opened:        { bg: B.amberBg,  c: B.amberText,  b: '#FDE68A', l: 'Opened'      },
    responded:     { bg: B.greenBg,  c: B.greenText,  b: '#A7F3D0', l: 'Responded'   },
    sent:          { bg: B.blueBg,   c: B.blueText,   b: '#BAE6FD', l: 'Sent'        },
    bounced:       { bg: B.redBg,    c: B.redText,    b: '#FECACA', l: 'Bounced'     },
    'not-started': { bg: B.surface,  c: B.light,      b: B.border,  l: 'Not chased'  },
  }
  const s = m[status] ?? { bg: B.surface, c: B.muted, b: B.border, l: status }
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: '3px 11px',
        borderRadius: 20,
        background: s.bg,
        color: s.c,
        border: `1px solid ${s.b}`,
      }}
    >
      {s.l}
    </span>
  )
}

type EditMode = 'edit' | 'new' | null

export default function ChaseManager({
  navigate = () => {},
}: {
  navigate?: (route: string) => void
}) {
  const { user } = useCurrentUser()

  /* ── client list state ── */
  const [chaseClients, setChaseClients] = useState<ChaseClientRecord[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientsError, setClientsError] = useState<string | null>(null)

  const [selected, setSelected] = useState(new Set<string>())
  const [sending, setSending] = useState(false)
  // `sent` removed — we reload clients after send instead of local optimistic state
  const [sendError, setSendError] = useState<string | null>(null)
  const [clientChannels, setClientChannels] = useState<Record<string, string>>({})
  const [typeFilter, setTypeFilter] = useState('all')

  /* ── template state ── */
  const [templates, setTemplates] = useState<ChaseTemplateRecord[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [templatesError, setTemplatesError] = useState<string | null>(null)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('general')
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  /* ── load chase clients ── */
  const loadClients = useCallback(async () => {
    setClientsLoading(true)
    setClientsError(null)
    try {
      const data = await chaseService.listChaseClients()
      setChaseClients(data)
      setClientChannels(Object.fromEntries(data.map((c) => [c.id, c.channel])))
    } catch {
      setClientsError('Failed to load chase clients')
    } finally {
      setClientsLoading(false)
    }
  }, [])

  /* ── load templates ── */
  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true)
    setTemplatesError(null)
    try {
      const data = await chaseTemplatesService.list()
      setTemplates(data)
      if (data.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(data[0].id)
      }
    } catch {
      setTemplatesError('Failed to load templates')
    } finally {
      setTemplatesLoading(false)
    }
  }, [selectedTemplateId])

  useEffect(() => {
    void loadClients()
    loadTemplates()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── client helpers ── */
  const overdueClients = chaseClients.filter((c) => c.daysOverdue > 0)
  const upcomingClients = chaseClients.filter((c) => c.daysOverdue <= 0)
  const filteredOverdue =
    typeFilter === 'all' ? overdueClients : overdueClients.filter((c) => c.workflowType === typeFilter)
  const filteredUpcoming =
    typeFilter === 'all' ? upcomingClients : upcomingClients.filter((c) => c.workflowType === typeFilter)

  const toggleSelect = (id: string) =>
    setSelected((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const handleSend = async () => {
    if (!selectedTemplateId || !currentTemplate) {
      setSendError('Please select a template before sending.')
      return
    }
    setSending(true)
    setSendError(null)
    const selectedClients = chaseClients.filter((c) => selected.has(c.id))
    try {
      await Promise.all(
        selectedClients.map((c) => {
          const vars = {
            name: c.name,
            business: c.business,
            quarter: c.quarter,
            deadline: c.deadline,
            agent_name: user?.name ?? 'Your accountant',
            firm_name: (user as { firmName?: string })?.firmName ?? 'Your firm',
          }
          return chaseService.sendChase({
            clientId: c.id,
            templateId: selectedTemplateId,
            channel: clientChannels[c.id] ?? 'email',
            subject: renderTemplate(currentTemplate.subject, vars),
            body: renderTemplate(currentTemplate.body, vars),
          })
        }),
      )
      setSelected(new Set())
      // Reload to refresh chase counts / last chase dates
      void loadClients()
    } catch {
      setSendError('Some chases failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  /* ── template helpers ── */
  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null

  // First selected client — used to render a live preview with real variable values
  const previewClient = chaseClients.find((c) => selected.has(c.id)) ?? null

  const previewVars = previewClient
    ? {
        name:       previewClient.name,
        business:   previewClient.business,
        quarter:    previewClient.quarter,
        deadline:   previewClient.deadline,
        agent_name: (user as { name?: string })?.name ?? 'Your accountant',
        firm_name:  (user as { firmName?: string })?.firmName ?? 'Your firm',
      }
    : null

  const previewSubject = currentTemplate
    ? previewVars
      ? renderTemplate(currentTemplate.subject, previewVars)
      : currentTemplate.subject
    : ''

  const previewBody = currentTemplate
    ? previewVars
      ? renderTemplate(currentTemplate.body, previewVars)
      : currentTemplate.body
    : ''

  const openEdit = (t: ChaseTemplateRecord) => {
    setEditMode('edit')
    setEditName(t.name)
    setEditType(t.type)
    setEditSubject(t.subject)
    setEditBody(t.body)
    setSaveError(null)
  }

  const openNew = () => {
    setEditMode('new')
    setEditName('')
    setEditType('general')
    setEditSubject('')
    setEditBody('')
    setSaveError(null)
  }

  const cancelEdit = () => {
    setEditMode(null)
    setSaveError(null)
  }

  const handleSave = async () => {
    if (!editName.trim() || !editSubject.trim() || !editBody.trim()) {
      setSaveError('Name, subject and body are required')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      if (editMode === 'new') {
        const payload: CreateChaseTemplatePayload = {
          name: editName.trim(),
          type: editType,
          subject: editSubject.trim(),
          body: editBody.trim(),
        }
        const created = await chaseTemplatesService.create(payload)
        setTemplates((prev) => [...prev, created])
        setSelectedTemplateId(created.id)
      } else if (editMode === 'edit' && selectedTemplateId) {
        const updated = await chaseTemplatesService.update(selectedTemplateId, {
          name: editName.trim(),
          type: editType,
          subject: editSubject.trim(),
          body: editBody.trim(),
        })
        setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      }
      setEditMode(null)
    } catch {
      setSaveError('Failed to save template. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await chaseTemplatesService.delete(id)
      const remaining = templates.filter((t) => t.id !== id)
      setTemplates(remaining)
      if (selectedTemplateId === id) {
        setSelectedTemplateId(remaining[0]?.id ?? null)
      }
      setEditMode(null)
    } catch {
      /* silently ignore — template stays in list */
    } finally {
      setDeletingId(null)
    }
  }

  /* ── render ── */
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div
        style={{
          padding: '16px 32px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>
            Chase manager
          </div>
          <div style={{ fontSize: 14, color: B.muted, marginTop: 3 }}>
            {clientsLoading
              ? 'Loading clients...'
              : clientsError
                ? clientsError
                : `${chaseClients.length} authorised clients: ${overdueClients.length} overdue, ${upcomingClients.length} upcoming`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '8px 11px',
              borderRadius: 7,
              border: `1px solid ${B.border}`,
              fontSize: 13,
              color: B.text,
              background: B.white,
              cursor: 'pointer',
            }}
          >
            <option value="all">All workflow types</option>
            <option value="bookkeeping">Bookkeeping reminder</option>
            <option value="data-request">Data request</option>
          </select>
          {selected.size > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <button
                onClick={handleSend}
                disabled={sending}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: sending ? B.muted : B.primary,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: sending ? 'not-allowed' : 'pointer',
                }}
              >
                {sending
                  ? 'Sending...'
                  : `Send to ${selected.size} client${selected.size > 1 ? 's' : ''}`}
              </button>
              {sendError && (
                <span style={{ fontSize: 12, color: B.redText }}>{sendError}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '24px 32px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* ─────────── Left: client list ─────────── */}
          <div>
            {/* Send error banner */}
            {sendError && (
              <div style={{
                marginBottom: 12,
                padding: '10px 14px',
                background: B.redBg,
                border: '1px solid #FECACA',
                borderRadius: 8,
                fontSize: 13,
                color: B.redText,
              }}>
                {sendError}
              </div>
            )}

            {/* No template selected warning */}
            {selected.size > 0 && !selectedTemplateId && (
              <div style={{
                marginBottom: 12,
                padding: '10px 14px',
                background: B.amberBg,
                border: '1px solid #FDE68A',
                borderRadius: 8,
                fontSize: 13,
                color: B.amberText,
              }}>
                Select a template on the right before sending.
              </div>
            )}

            {clientsLoading && (
              <div style={{ padding: '36px', textAlign: 'center', fontSize: 14, color: B.muted }}>
                Loading clients...
              </div>
            )}

            {!clientsLoading && chaseClients.length === 0 && (
              <div style={{
                padding: '36px',
                textAlign: 'center',
                fontSize: 14,
                color: B.light,
                background: B.white,
                borderRadius: 12,
                border: `1px solid ${B.border}`,
              }}>
                No authorised clients yet. Add and authorise clients to start chasing.
              </div>
            )}

            {filteredOverdue.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: B.red }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: B.redText }}>
                    Overdue: deadline passed
                  </span>
                  <span style={{ fontSize: 12, color: B.muted }}>({filteredOverdue.length})</span>
                </div>
                <ClientTable
                  clients={filteredOverdue}
                  selected={selected}
                  clientChannels={clientChannels}
                  onToggle={toggleSelect}
                  onChannelChange={(id, ch) =>
                    setClientChannels({ ...clientChannels, [id]: ch })
                  }
                />
              </div>
            )}
            {filteredUpcoming.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: B.amber }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: B.amberText }}>
                    Upcoming: chase window open
                  </span>
                  <span style={{ fontSize: 12, color: B.muted }}>({filteredUpcoming.length})</span>
                </div>
                <ClientTable
                  clients={filteredUpcoming}
                  selected={selected}
                  clientChannels={clientChannels}
                  onToggle={toggleSelect}
                  onChannelChange={(id, ch) =>
                    setClientChannels({ ...clientChannels, [id]: ch })
                  }
                />
              </div>
            )}
          </div>

          {/* ─────────── Right: templates ─────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Template list card */}
            <div
              style={{
                background: B.white,
                borderRadius: 12,
                border: `1px solid ${B.border}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: `1px solid ${B.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700 }}>Chase templates</div>
                <button
                  onClick={openNew}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: `1px solid ${B.border}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    color: B.primary,
                  }}
                >
                  + New template
                </button>
              </div>

              <div style={{ padding: '8px 12px' }}>
                {templatesLoading && (
                  <div style={{ padding: '14px', fontSize: 13, color: B.muted, textAlign: 'center' }}>
                    Loading templates...
                  </div>
                )}
                {templatesError && (
                  <div style={{ padding: '14px', fontSize: 13, color: B.redText, textAlign: 'center' }}>
                    {templatesError}
                  </div>
                )}
                {!templatesLoading &&
                  templates.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplateId(t.id)
                        setEditMode(null)
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        marginBottom: 4,
                        background:
                          selectedTemplateId === t.id && editMode !== 'new'
                            ? B.blueBg
                            : 'transparent',
                        border: `1px solid ${selectedTemplateId === t.id && editMode !== 'new' ? '#BAE6FD' : 'transparent'}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color:
                              selectedTemplateId === t.id && editMode !== 'new'
                                ? B.blueText
                                : B.text,
                          }}
                        >
                          {t.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TypeBadge type={t.type} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(t.id)
                            }}
                            disabled={deletingId === t.id}
                            title="Delete template"
                            style={{
                              fontSize: 12,
                              padding: '2px 6px',
                              borderRadius: 5,
                              border: `1px solid ${B.borderLight}`,
                              background: 'transparent',
                              color: B.light,
                              cursor: 'pointer',
                              lineHeight: 1,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Preview / Edit card */}
            <div
              style={{
                background: B.white,
                borderRadius: 12,
                border: `1px solid ${B.border}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: `1px solid ${B.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    {editMode === 'new' ? 'New template' : editMode === 'edit' ? 'Edit template' : 'Preview'}
                  </div>
                  {!editMode && previewClient && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 10,
                        background: B.greenBg,
                        color: B.greenText,
                        border: '1px solid #A7F3D0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {selected.size > 1
                        ? `${previewClient.name} +${selected.size - 1} more`
                        : previewClient.name}
                    </span>
                  )}
                  {!editMode && !previewClient && currentTemplate && (
                    <span style={{ fontSize: 11, color: B.light }}>
                      select a client to preview with real data
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!editMode && currentTemplate && (
                    <button
                      onClick={() => openEdit(currentTemplate)}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        padding: '5px 12px',
                        borderRadius: 7,
                        border: `1px solid ${B.border}`,
                        background: 'transparent',
                        cursor: 'pointer',
                        color: B.muted,
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {editMode && (
                    <>
                      <button
                        onClick={cancelEdit}
                        style={{
                          fontSize: 12,
                          padding: '5px 12px',
                          borderRadius: 7,
                          border: `1px solid ${B.border}`,
                          background: 'transparent',
                          cursor: 'pointer',
                          color: B.muted,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '5px 12px',
                          borderRadius: 7,
                          border: 'none',
                          background: saving ? B.muted : B.green,
                          color: '#fff',
                          cursor: saving ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                {/* Preview mode */}
                {!editMode && currentTemplate && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>
                      Subject
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        marginBottom: 14,
                        padding: '9px 13px',
                        background: previewClient ? B.white : B.surface,
                        borderRadius: 7,
                        border: `1px solid ${previewClient ? B.border : B.borderLight}`,
                        color: B.text,
                      }}
                    >
                      {previewSubject}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>
                      Body
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: previewClient ? B.text : B.muted,
                        lineHeight: 1.7,
                        padding: '12px',
                        background: previewClient ? B.white : B.surface,
                        borderRadius: 7,
                        border: `1px solid ${previewClient ? B.border : B.borderLight}`,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {previewBody}
                    </div>
                  </>
                )}

                {/* Edit / New form */}
                {editMode && (
                  <>
                    {/* Name + type row */}
                    <div
                      style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 10, marginBottom: 14 }}
                    >
                      <div>
                        <div
                          style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}
                        >
                          Name
                        </div>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Template name"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 7,
                            border: `1px solid ${B.border}`,
                            fontSize: 13,
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}
                        >
                          Type
                        </div>
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 7,
                            border: `1px solid ${B.border}`,
                            fontSize: 13,
                            color: B.text,
                            background: B.white,
                            outline: 'none',
                          }}
                        >
                          <option value="bookkeeping">Bookkeeping</option>
                          <option value="data-request">Data request</option>
                          <option value="general">General</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}
                    >
                      Subject
                    </div>
                    <input
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="Email subject"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 7,
                        border: `1px solid ${B.border}`,
                        fontSize: 13,
                        marginBottom: 14,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />

                    {/* Body */}
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}
                    >
                      Body
                    </div>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      placeholder="Email body..."
                      rows={10}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 7,
                        border: `1px solid ${B.border}`,
                        fontSize: 13,
                        lineHeight: 1.7,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />

                    {saveError && (
                      <div
                        style={{ fontSize: 12, color: B.redText, marginTop: 8 }}
                      >
                        {saveError}
                      </div>
                    )}
                  </>
                )}

                <div style={{ fontSize: 11, color: B.light, marginTop: 12 }}>
                  Variables: {'{name}'}, {'{business}'}, {'{quarter}'}, {'{deadline}'},{' '}
                  {'{agent_name}'}, {'{firm_name}'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────── helpers ─────────────────────────────────────── */

function TypeBadge({ type }: { type: string }) {
  const bg =
    type === 'bookkeeping' ? B.purpleBg : type === 'data-request' ? B.blueBg : B.surface
  const color =
    type === 'bookkeeping' ? B.purpleText : type === 'data-request' ? B.blueText : B.muted
  const label = type === 'bookkeeping' ? 'BK' : type === 'data-request' ? 'DR' : 'GEN'
  return (
    <span
      style={{
        fontSize: 10,
        padding: '2px 7px',
        borderRadius: 5,
        background: bg,
        color,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  )
}

type ChaseClientRow = {
  id: string
  name: string
  business: string
  deadline: string
  daysOverdue: number
  lastChase: string | null
  chaseCount: number
  status: string
  workflowType: string
}

function ClientTable({
  clients,
  selected,
  clientChannels,
  onToggle,
  onChannelChange,
}: {
  clients: ChaseClientRow[]
  selected: Set<string>
  clientChannels: Record<string, string>
  onToggle: (id: string) => void
  onChannelChange: (id: string, ch: string) => void
}) {
  return (
    <div
      style={{
        background: B.white,
        borderRadius: 12,
        border: `1px solid ${B.border}`,
        overflow: 'hidden',
      }}
    >
      {clients.map((c, i) => (
        <div
          key={c.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            borderBottom: i < clients.length - 1 ? `1px solid ${B.borderLight}` : 'none',
            background: selected.has(c.id) ? '#F0F9FF' : 'transparent',
          }}
        >
          <input
            type="checkbox"
            checked={selected.has(c.id)}
            onChange={() => onToggle(c.id)}
            style={{ cursor: 'pointer', accentColor: B.primary }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                <span style={{ color: B.muted, fontSize: 13, marginLeft: 8 }}>{c.business}</span>
              </div>
              <ResponseBadge status={c.status} />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 6,
                fontSize: 12,
                color: B.light,
                alignItems: 'center',
              }}
            >
              {c.daysOverdue > 0 ? (
                <span>
                  Due: <b style={{ color: B.redText }}>{c.deadline}</b> ({c.daysOverdue}d overdue)
                </span>
              ) : (
                <span>
                  Due: <b style={{ color: B.text }}>{c.deadline}</b> ({Math.abs(c.daysOverdue)}d left)
                </span>
              )}
              <span>
                Chased: <b style={{ color: B.text }}>{c.chaseCount}x</b>
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 5,
                  background: c.workflowType === 'bookkeeping' ? B.purpleBg : B.blueBg,
                  color: c.workflowType === 'bookkeeping' ? B.purpleText : B.blueText,
                }}
              >
                {c.workflowType === 'bookkeeping' ? 'Bookkeeping' : 'Data request'}
              </span>
              <select
                value={clientChannels[c.id]}
                onChange={(e) => onChannelChange(c.id, e.target.value)}
                style={{
                  fontSize: 11,
                  padding: '3px 7px',
                  borderRadius: 5,
                  border: `1px solid ${B.borderLight}`,
                  background: B.white,
                  color: B.muted,
                  cursor: 'pointer',
                }}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
