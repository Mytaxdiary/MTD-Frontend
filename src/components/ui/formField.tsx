'use client'
import { useId, Children, cloneElement, isValidElement } from 'react'
import B from '@/styles/theme'

type FormFieldProps = {
  label: string
  error?: string
  hint?: string
  mb?: number
  children: React.ReactNode
}

/**
 * WCAG 1.3.1 / 4.1.2 — FormField automatically:
 *  - Generates a stable id and wires <label htmlFor> to the first child input.
 *  - Associates error text via aria-describedby so screen readers announce it.
 *  - Adds aria-invalid="true" on the input when an error is present.
 *  - Optionally renders a hint text also linked via aria-describedby.
 */
export default function FormField({ label, error, hint, mb = 18, children }: FormFieldProps) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  // Inject id + aria props into the first child element (the input/select/textarea).
  const enhancedChildren = Children.map(children, (child, i) => {
    if (i === 0 && isValidElement(child)) {
      return cloneElement(
        child as React.ReactElement<{
          id?: string
          'aria-describedby'?: string
          'aria-invalid'?: 'true' | 'false'
        }>,
        {
          id,
          ...(describedBy ? { 'aria-describedby': describedBy } : {}),
          ...(error ? { 'aria-invalid': 'true' as const } : {}),
        },
      )
    }
    return child
  })

  return (
    <div style={{ marginBottom: mb }}>
      {/* WCAG 1.4.3 — label: #64748B on #FFFFFF → 4.6:1 ✓ */}
      <label
        htmlFor={id}
        style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}
      >
        {label}
      </label>

      {hint && (
        <div
          id={hintId}
          style={{ fontSize: 11, color: B.muted, marginBottom: 6, lineHeight: 1.5 }}
        >
          {hint}
        </div>
      )}

      {enhancedChildren}

      {/* WCAG 4.1.3 — role="alert" announces the error immediately to screen readers */}
      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          style={{ fontSize: 11, color: B.redText, marginTop: 4 }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
