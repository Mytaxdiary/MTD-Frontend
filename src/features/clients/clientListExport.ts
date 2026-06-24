/**
 * Export helpers for the client list (CSV download + PDF print).
 * Kept in a separate module so clientList.tsx stays focused on UI.
 */

export type ColKeys = 'type' | 'mtd' | 'deadline' | 'filing' | 'chase' | 'income'

export type ClientListRow = {
  id: string
  name: string
  business: string
  type: string[]
  mtd: string
  deadline: string
  filing: string
  chase: string
  agentType: string
  income: number
  needsResend: boolean
}

// ── CSV ───────────────────────────────────────────────────────────────────────

function escapeCsvCell(value: unknown): string {
  const s = value == null ? '' : String(value)
  if (s.includes(',') || s.includes('\n') || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function titleCase(s: string): string {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function downloadCsv(rows: ClientListRow[], cols: Record<ColKeys, boolean>): void {
  const headers: string[] = [
    'Client name',
    'NINO',
    ...(cols.type     ? ['Business type']  : []),
    ...(cols.mtd      ? ['MTD status']     : []),
    ...(cols.deadline ? ['Next deadline']  : []),
    ...(cols.filing   ? ['Filing status']  : []),
    ...(cols.chase    ? ['Chase']          : []),
    ...(cols.income   ? ['YTD income (£)'] : []),
  ]

  const dataRows = rows.map((c) => {
    const cells: (string | number)[] = [
      escapeCsvCell(c.name),
      escapeCsvCell(c.business),
    ]
    if (cols.type)     cells.push(escapeCsvCell(c.type.join(', ') || '-'))
    if (cols.mtd)      cells.push(escapeCsvCell(c.mtd))
    if (cols.deadline) cells.push(escapeCsvCell(c.deadline))
    if (cols.filing)   cells.push(escapeCsvCell(titleCase(c.filing)))
    if (cols.chase)    cells.push(escapeCsvCell(c.needsResend ? 'Resend invite' : '-'))
    if (cols.income)   cells.push(escapeCsvCell(c.income > 0 ? c.income : '-'))
    return cells.join(',')
  })

  const csv = [headers.join(','), ...dataRows].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `clients_${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}

// ── PDF (browser print) ───────────────────────────────────────────────────────

const PDF_STYLES = `
  body { font-family: system-ui, sans-serif; font-size: 12px; margin: 24px; }
  h2   { margin: 0 0 4px; font-size: 16px; }
  p    { margin: 0 0 16px; color: #64748B; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #F8FAFC; padding: 8px 10px; text-align: left;
       font-size: 10px; font-weight: 600; color: #94A3B8;
       border-bottom: 1px solid #E2E8F0; letter-spacing: .04em; }
  td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; font-size: 12px; }
  tr:last-child td { border-bottom: none; }
  @media print { body { margin: 0; } }
`

const ALWAYS_COLS = [
  { key: 'name',     label: 'Client' },
  { key: 'business', label: 'NINO'   },
] as const

const OPTIONAL_COLS: { key: keyof ClientListRow; label: string; flag: ColKeys }[] = [
  { key: 'type',     label: 'Type',     flag: 'type'     },
  { key: 'mtd',      label: 'MTD',      flag: 'mtd'      },
  { key: 'deadline', label: 'Deadline', flag: 'deadline' },
  { key: 'filing',   label: 'Status',   flag: 'filing'   },
]

export function printPdf(rows: ClientListRow[], cols: Record<ColKeys, boolean>): void {
  const colDefs: { key: keyof ClientListRow; label: string }[] = [
    ...ALWAYS_COLS,
    ...OPTIONAL_COLS.filter((c) => cols[c.flag]),
  ]

  const thead = colDefs.map((c) => `<th>${c.label}</th>`).join('')
  const tbody = rows
    .map((r) => {
      const cells = colDefs.map((c) => {
        const val = r[c.key]
        const display = Array.isArray(val) ? val.join(', ') || '-' : String(val ?? '-')
        return `<td>${display}</td>`
      })
      return `<tr>${cells.join('')}</tr>`
    })
    .join('')

  const exportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Client list</title>
  <style>${PDF_STYLES}</style>
</head>
<body>
  <h2>Client list</h2>
  <p>Exported ${exportDate} | ${rows.length} client${rows.length !== 1 ? 's' : ''}</p>
  <table>
    <thead><tr>${thead}</tr></thead>
    <tbody>${tbody}</tbody>
  </table>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  win.print()
  win.close()
}
