'use client'
import { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader } from '@/components/ui/card'
import B from '@/styles/theme'
import { clientsService, type NoteRecord } from '@/services/clients.service'

interface Props {
  clientId: string | null
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function NotesTab({ clientId }: Props) {
  const [notes, setNotes] = useState<NoteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)

  const [newText, setNewText] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    setError(null)
    try {
      setNotes(await clientsService.getNotes(clientId))
    } catch {
      setError('Failed to load notes.')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => { void load() }, [load])

  async function handleCreate() {
    if (!clientId || !newText.trim()) return
    setCreating(true)
    try {
      const note = await clientsService.createNote(clientId, newText.trim())
      setNotes((prev) => [note, ...prev])
      setNewText('')
      setShowNewForm(false)
    } catch {
      setError('Failed to save note.')
    } finally {
      setCreating(false)
    }
  }

  async function handleSaveEdit(id: string) {
    if (!clientId || !editText.trim()) return
    setSaving(true)
    try {
      const updated = await clientsService.updateNote(clientId, id, { text: editText.trim() })
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
      setEditingId(null)
    } catch {
      setError('Failed to update note.')
    } finally {
      setSaving(false)
    }
  }

  async function handleTogglePin(note: NoteRecord) {
    if (!clientId) return
    try {
      const updated = await clientsService.updateNote(clientId, note.id, { isPinned: !note.isPinned })
      setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)))
    } catch {
      setError('Failed to update note.')
    }
  }

  async function handleDelete(id: string) {
    if (!clientId) return
    try {
      await clientsService.deleteNote(clientId, id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch {
      setError('Failed to delete note.')
    }
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (!clientId) {
    return (
      <div style={{ padding: '10px 12px', background: B.amberBg, border: '1px solid #FDE68A', borderRadius: 8, fontSize: 12, color: B.amberText }}>
        Open a client to view and add notes.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780 }}>
      {error && (
        <div style={{ padding: '8px 12px', background: B.redBg, border: '1px solid #FECACA', borderRadius: 8, fontSize: 12, color: B.redText }}>
          {error}
        </div>
      )}

      <Card>
        <CardHeader
          title="Accountant notes"
          right={
            !showNewForm ? (
              <button
                type="button"
                onClick={() => { setShowNewForm(true); setError(null) }}
                style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: B.navy, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                + Add note
              </button>
            ) : null
          }
        />

        {showNewForm && (
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${B.border}` }}>
            <textarea
              autoFocus
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Type your note here..."
              rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${B.border}`, fontSize: 13, color: B.text, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' }}
              onFocus={(e) => { e.target.style.borderColor = B.primary }}
              onBlur={(e) => { e.target.style.borderColor = B.border }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating || !newText.trim()}
                style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: newText.trim() ? B.navy : B.xlight, color: newText.trim() ? '#fff' : B.muted, fontSize: 12, fontWeight: 600, cursor: newText.trim() && !creating ? 'pointer' : 'not-allowed' }}
              >
                {creating ? 'Saving...' : 'Save note'}
              </button>
              <button
                type="button"
                onClick={() => { setShowNewForm(false); setNewText('') }}
                style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${B.border}`, background: 'transparent', fontSize: 12, cursor: 'pointer', color: B.muted }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: '4px 20px 8px' }}>
          {loading ? (
            <div style={{ padding: '28px 0', textAlign: 'center', fontSize: 13, color: B.light }}>
              Loading notes...
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ padding: '28px 0', textAlign: 'center', fontSize: 13, color: B.light }}>
              No notes yet. Click &ldquo;+ Add note&rdquo; to record something about this client.
            </div>
          ) : (
            sorted.map((note, i) => (
              <div
                key={note.id}
                style={{ padding: '14px 0', borderBottom: i < sorted.length - 1 ? `1px solid ${B.borderLight}` : 'none' }}
              >
                {note.isPinned && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: B.amberText, fontWeight: 600 }}>Pinned</span>
                  </div>
                )}

                {editingId === note.id ? (
                  <div>
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${B.primary}`, fontSize: 13, color: B.text, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={saving || !editText.trim()}
                        style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: editText.trim() ? B.navy : B.xlight, color: editText.trim() ? '#fff' : B.muted, fontSize: 12, fontWeight: 600, cursor: editText.trim() && !saving ? 'pointer' : 'not-allowed' }}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${B.border}`, background: 'transparent', fontSize: 12, cursor: 'pointer', color: B.muted }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: B.text, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {note.text}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: B.light }}>
                        {fmtDate(note.updatedAt !== note.createdAt ? note.updatedAt : note.createdAt)} · {note.authorName}
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePin(note)}
                          title={note.isPinned ? 'Unpin' : 'Pin note'}
                          style={{ padding: '3px 8px', borderRadius: 5, border: `1px solid ${B.border}`, background: note.isPinned ? B.amberBg : 'transparent', fontSize: 11, cursor: 'pointer', color: note.isPinned ? B.amberText : B.muted }}
                        >
                          {note.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(note.id); setEditText(note.text) }}
                          style={{ padding: '3px 8px', borderRadius: 5, border: `1px solid ${B.border}`, background: 'transparent', fontSize: 11, cursor: 'pointer', color: B.muted }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #FECACA', background: 'transparent', fontSize: 11, cursor: 'pointer', color: B.redText }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
