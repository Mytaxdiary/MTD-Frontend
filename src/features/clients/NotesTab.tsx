'use client'
import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/card'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import B from '@/styles/theme'

type NoteEntry = {
  id: number
  text: string
  author: string
  timestamp: string
  isPinned: boolean
}

const INITIAL_NOTES: NoteEntry[] = [
  {
    id: 1,
    text: 'Client uses Xero for bookkeeping. Submits own quarterly updates via Xero. We monitor and chase. 2nd POA due 31 Jul, remind client. May exceed £90k next year.',
    author: 'You',
    timestamp: '22 Apr 2026, 10:14',
    isPinned: true,
  },
]

function fmtNow(): string {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NotesTab() {
  const { user } = useCurrentUser()
  const authorName = user?.name ?? 'You'

  const [notes, setNotes] = useState<NoteEntry[]>(INITIAL_NOTES)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [newText, setNewText] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)

  function startEdit(note: NoteEntry) {
    setEditingId(note.id)
    setEditText(note.text)
  }

  function saveEdit(id: number) {
    if (!editText.trim()) return
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, text: editText.trim(), author: authorName, timestamp: fmtNow() }
          : n,
      ),
    )
    setEditingId(null)
  }

  function addNote() {
    if (!newText.trim()) return
    setNotes((prev) => [
      {
        id: Date.now(),
        text: newText.trim(),
        author: authorName,
        timestamp: fmtNow(),
        isPinned: false,
      },
      ...prev,
    ])
    setNewText('')
    setShowNewForm(false)
  }

  function deleteNote(id: number) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  function togglePin(id: number) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)))
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.id - a.id
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780 }}>
      {/* Add note card */}
      <Card>
        <CardHeader
          title="Accountant notes"
          right={
            !showNewForm ? (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: B.navy,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
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
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1.5px solid ${B.border}`,
                fontSize: 13,
                color: B.text,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = B.primary }}
              onBlur={(e) => { e.target.style.borderColor = B.border }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={addNote}
                disabled={!newText.trim()}
                style={{
                  padding: '6px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: newText.trim() ? B.navy : B.xlight,
                  color: newText.trim() ? '#fff' : B.muted,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: newText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save note
              </button>
              <button
                type="button"
                onClick={() => { setShowNewForm(false); setNewText('') }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${B.border}`,
                  background: 'transparent',
                  fontSize: 12,
                  cursor: 'pointer',
                  color: B.muted,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: '4px 20px 8px' }}>
          {sorted.length === 0 && (
            <div style={{ padding: '28px 0', textAlign: 'center', fontSize: 13, color: B.light }}>
              No notes yet. Click &ldquo;+ Add note&rdquo; to record something about this client.
            </div>
          )}

          {sorted.map((note, i) => (
            <div
              key={note.id}
              style={{
                padding: '14px 0',
                borderBottom: i < sorted.length - 1 ? `1px solid ${B.borderLight}` : 'none',
              }}
            >
              {/* Pin indicator */}
              {note.isPinned && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: B.amberText, fontWeight: 600 }}>📌 Pinned</span>
                </div>
              )}

              {editingId === note.id ? (
                /* ── Edit mode ── */
                <div>
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: `1.5px solid ${B.primary}`,
                      fontSize: 13,
                      color: B.text,
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => saveEdit(note.id)}
                      disabled={!editText.trim()}
                      style={{
                        padding: '5px 14px',
                        borderRadius: 6,
                        border: 'none',
                        background: editText.trim() ? B.navy : B.xlight,
                        color: editText.trim() ? '#fff' : B.muted,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: editText.trim() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        border: `1px solid ${B.border}`,
                        background: 'transparent',
                        fontSize: 12,
                        cursor: 'pointer',
                        color: B.muted,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Read mode ── */
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: B.text,
                      lineHeight: 1.65,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {note.text}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, color: B.light }}>
                      {note.timestamp} · {note.author}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => togglePin(note.id)}
                        title={note.isPinned ? 'Unpin' : 'Pin note'}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 5,
                          border: `1px solid ${B.border}`,
                          background: note.isPinned ? B.amberBg : 'transparent',
                          fontSize: 11,
                          cursor: 'pointer',
                          color: note.isPinned ? B.amberText : B.muted,
                        }}
                      >
                        {note.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 5,
                          border: `1px solid ${B.border}`,
                          background: 'transparent',
                          fontSize: 11,
                          cursor: 'pointer',
                          color: B.muted,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 5,
                          border: `1px solid #FECACA`,
                          background: 'transparent',
                          fontSize: 11,
                          cursor: 'pointer',
                          color: B.redText,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
