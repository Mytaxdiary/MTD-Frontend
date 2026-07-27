'use client'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import B from '@/styles/theme'

interface Props {
  /** Tooltip body. Accepts nodes so callers can add lists or emphasis. */
  children: ReactNode
  /** Accessible label for the trigger button. */
  label: string
  /** Which side of the trigger the panel opens towards. */
  align?: 'left' | 'right'
  width?: number
}

/**
 * Small "?" affordance that reveals help text on hover or keyboard focus.
 * Renders the panel in a portal with fixed positioning so parent overflow
 * (e.g. card overflow:hidden) cannot clip it.
 */
export default function InfoTooltip({ children, label, align = 'right', width = 300 }: Props) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const tipId = useId()

  useEffect(() => {
    if (!open || !triggerRef.current) return

    const update = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      const left =
        align === 'left'
          ? Math.max(8, rect.left)
          : Math.min(window.innerWidth - width - 8, rect.right - width)
      setCoords({
        top: rect.bottom + 8,
        left,
      })
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, align, width])

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          border: `1px solid ${B.borderStrong}`,
          background: open ? B.navy : B.white,
          color: open ? B.white : B.light,
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'background 0.12s, color 0.12s',
        }}
      >
        ?
      </button>

      {open &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            id={tipId}
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width,
              padding: '12px 14px',
              background: B.navy,
              color: '#F1F5F9',
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.6,
              borderRadius: 10,
              boxShadow: '0 10px 28px rgba(15,23,42,0.22)',
              zIndex: 9999,
              textAlign: 'left',
              pointerEvents: 'none',
            }}
          >
            {children}
          </span>,
          document.body,
        )}
    </span>
  )
}
