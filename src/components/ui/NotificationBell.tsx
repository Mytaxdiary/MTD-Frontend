'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import appNotificationsService, {
  type AppNotification,
} from '@/services/appNotifications.service'

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const fetchCount = useCallback(async () => {
    try {
      const n = await appNotificationsService.unreadCount()
      setCount(n)
    } catch {
      // silent — count badge is best-effort
    }
  }, [])

  // Poll unread count every 30 seconds.
  useEffect(() => {
    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    return () => clearInterval(id)
  }, [fetchCount])

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openPanel = async () => {
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    setLoading(true)
    try {
      const data = await appNotificationsService.list()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id: string) => {
    await appNotificationsService.markRead(id)
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)))
    setCount((c) => Math.max(0, c - 1))
  }

  const handleMarkAllRead = async () => {
    await appNotificationsService.markAllRead()
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })))
    setCount(0)
  }

  const handleItemClick = async (n: AppNotification) => {
    if (!n.readAt) await handleMarkRead(n.id)
    if (n.clientId) {
      router.push(`/clients/detail?id=${n.clientId}`)
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        type="button"
        aria-label={count > 0 ? `${count} unread notifications` : 'Notifications'}
        onClick={openPanel}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 7,
          width: 32,
          height: 32,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        }}
      >
        <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)' }} aria-hidden="true">
          🔔
        </span>
        {count > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#ef4444',
              color: '#fff',
              borderRadius: 10,
              fontSize: 9,
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Dropdown panel — opens upward from the bottom of the sidebar */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            width: 320,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Notifications</span>
            {count > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  fontSize: 11,
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {loading && (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#6b7280',
                }}
              >
                Loading...
              </div>
            )}
            {!loading && items.length === 0 && (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#6b7280',
                }}
              >
                No notifications yet
              </div>
            )}
            {!loading &&
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleItemClick(n)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f9fafb',
                    background: n.readAt ? '#fff' : '#eff6ff',
                    cursor: n.clientId ? 'pointer' : 'default',
                    border: 'none',
                    borderBottomColor: '#f3f4f6',
                    borderBottomWidth: 1,
                    borderBottomStyle: 'solid',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (n.clientId)
                      e.currentTarget.style.background = n.readAt ? '#f9fafb' : '#dbeafe'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = n.readAt ? '#fff' : '#eff6ff'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: n.readAt ? 500 : 600,
                        color: '#111827',
                      }}
                    >
                      {n.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#9ca3af',
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>{n.body}</div>
                  {!n.readAt && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 10,
                        color: '#3b82f6',
                        fontWeight: 600,
                      }}
                    >
                      {n.clientId ? 'View client' : 'Mark as read'}
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
