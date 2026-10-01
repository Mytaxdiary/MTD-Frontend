'use client'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import B from '@/styles/theme'

interface Props {
  /** Short plain-language tip shown on hover/focus. */
  content: ReactNode
  children: ReactNode
  /** Preferred side of the trigger. Flips if there is not enough space. */
  side?: 'top' | 'bottom'
  maxWidth?: number
  /** Skip the tip and render children only. */
  enabled?: boolean
  wrapStyle?: CSSProperties
}

/**
 * Hover/focus tip for controls, badges, and icon-only actions.
 * Portals out of overflow-hidden parents (cards, tables).
 * Use InfoTooltip for longer help beside form labels.
 */
export default function Tooltip({
  content,
  children,
  side = 'bottom',
  maxWidth = 240,
  enabled = true,
  wrapStyle,
}: Props) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const tipId = useId()

  useEffect(() => {
    if (!open || !enabled || !triggerRef.current) return

    const update = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      const tipH = tipRef.current?.offsetHeight ?? 40
      const tipW = Math.min(maxWidth, tipRef.current?.offsetWidth || maxWidth)
      const pad = 8

      let preferTop = side === 'top'
      if (preferTop && rect.top < tipH + pad + 4) preferTop = false
      if (!preferTop && rect.bottom + tipH + pad > window.innerHeight - 4) preferTop = true

      const top = preferTop ? rect.top - tipH - pad : rect.bottom + pad
      const left = Math.min(
        window.innerWidth - tipW - pad,
        Math.max(pad, rect.left + rect.width / 2 - tipW / 2),
      )
      setCoords({ top, left })
    }

    update()
    // Re-measure after tip mounts so height is accurate.
    const raf = requestAnimationFrame(update)
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, enabled, side, maxWidth])

  if (!enabled) return <>{children}</>

  return (
    <span
      ref={triggerRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...wrapStyle }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      {children}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            ref={tipRef}
            id={tipId}
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
              maxWidth,
              padding: '8px 11px',
              background: B.navy,
              color: '#F1F5F9',
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.45,
              borderRadius: 8,
              boxShadow: '0 8px 22px rgba(15,23,42,0.22)',
              zIndex: 9999,
              textAlign: 'left',
              pointerEvents: 'none',
              visibility: coords ? 'visible' : 'hidden',
            }}
          >
            {content}
          </span>,
          document.body,
        )}
    </span>
  )
}
