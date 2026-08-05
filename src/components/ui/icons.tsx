/**
 * Shared line-icon set. All icons inherit `currentColor` and take a `size` prop
 * so they can be dropped into buttons, nav items and cards without extra CSS.
 */

export interface IconProps {
  size?: number
  strokeWidth?: number
  style?: React.CSSProperties
}

const base = (size: number): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

/* ── Navigation ─────────────────────────────────────────────────────────── */

export const GridIcon = ({ size = 18, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
  </svg>
)

export const UsersIcon = ({ size = 18, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" />
  </svg>
)

export const SendIcon = ({ size = 18, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3l-6.6 18-3.9-7.5L3 9.6 21 3Z" />
  </svg>
)

export const PlusCircleIcon = ({ size = 18, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8.4v7.2M8.4 12h7.2" />
  </svg>
)

export const SettingsIcon = ({ size = 18, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.08A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.87.35l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.7 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.35-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.7a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.08A1.7 1.7 0 0 0 15 4.7a1.7 1.7 0 0 0 1.87-.35l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.3 9v.02c.28.66.92 1.1 1.64 1.11H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.52 1.03Z" />
  </svg>
)

export const LinkIcon = ({ size = 18, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M10 13.5a4 4 0 0 0 5.66 0l2.6-2.6a4 4 0 0 0-5.66-5.66l-1.5 1.5" />
    <path d="M14 10.5a4 4 0 0 0-5.66 0l-2.6 2.6a4 4 0 0 0 5.66 5.66l1.5-1.5" />
  </svg>
)

export const SignOutIcon = ({ size = 16, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M15 4.5h3A1.5 1.5 0 0 1 19.5 6v12a1.5 1.5 0 0 1-1.5 1.5h-3" />
    <path d="M10.5 16.5 6 12l4.5-4.5" />
    <path d="M6 12h9" />
  </svg>
)

/* ── Metric cards ───────────────────────────────────────────────────────── */

export const AlertIcon = ({ size = 20, strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M12 7.5v5.2" />
    <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)

export const ClockIcon = ({ size = 20, strokeWidth = 1.9, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7.6V12l3.1 1.9" />
  </svg>
)

export const CheckIcon = ({ size = 20, strokeWidth = 2.2, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M5.5 12.6l4.2 4.2L18.6 7.9" />
  </svg>
)

export const RefreshIcon = ({ size = 20, strokeWidth = 1.9, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.6 4.6v4.2h-4.2" />
  </svg>
)

/* ── Toolbar ────────────────────────────────────────────────────────────── */

export const FilterIcon = ({ size = 15, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M3.5 5.5h17l-6.6 7.8V20l-3.8-2.2v-4.5L3.5 5.5Z" />
  </svg>
)

export const CalendarIcon = ({ size = 15, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
    <path d="M3.5 9.8h17M8.2 3.5v3M15.8 3.5v3" />
  </svg>
)

export const ExportIcon = ({ size = 15, strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M12 15.5V4.2" />
    <path d="M8.2 8l3.8-3.8L15.8 8" />
    <path d="M4.5 15.5v2.8A2.2 2.2 0 0 0 6.7 20.5h10.6a2.2 2.2 0 0 0 2.2-2.2v-2.8" />
  </svg>
)

export const ChevronDownIcon = ({ size = 14, strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M6.5 9.5 12 15l5.5-5.5" />
  </svg>
)

/* ── View switcher ──────────────────────────────────────────────────────── */

export const ListViewIcon = ({ size = 16, strokeWidth = 1.9, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const BoardViewIcon = ({ size = 16, strokeWidth = 1.7, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <rect x="3.5" y="3.5" width="7" height="17" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="17" rx="1.5" />
  </svg>
)

export const YearViewIcon = ({ size = 16, strokeWidth = 1.6, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1.8" />
    <path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" />
  </svg>
)

/* ── Buttons ────────────────────────────────────────────────────────────── */

export const PlusIcon = ({ size = 15, strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size)} strokeWidth={strokeWidth} style={style}>
    <path d="M12 5.5v13M5.5 12h13" />
  </svg>
)
