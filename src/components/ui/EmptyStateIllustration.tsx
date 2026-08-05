/**
 * Decorative empty-state artwork: an open folder of client records with a
 * paper plane lifting away (mirrors the "chase" motif used across the app).
 * Purely presentational — callers supply the heading and action.
 */
export default function EmptyStateIllustration({ width = 210 }: { width?: number }) {
  return (
    <svg
      width={width}
      viewBox="0 0 210 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="es-folder" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="es-folder-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0EAFB" />
          <stop offset="100%" stopColor="#CBDDF7" />
        </linearGradient>
        <linearGradient id="es-halo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Soft halo */}
      <ellipse cx="105" cy="76" rx="86" ry="66" fill="url(#es-halo)" />

      {/* Folder back panel */}
      <path
        d="M46 52a6 6 0 0 1 6-6h28l8 9h68a6 6 0 0 1 6 6v53a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6V52Z"
        fill="url(#es-folder-back)"
      />

      {/* Document sheets */}
      <rect x="70" y="40" width="58" height="62" rx="4" fill="#FFFFFF" />
      <rect x="70" y="40" width="58" height="62" rx="4" stroke="#C7D8F2" strokeWidth="1.4" />
      <g stroke="#C7D8F2" strokeWidth="3" strokeLinecap="round">
        <path d="M80 54h30M80 63h38M80 72h24M80 81h34" />
      </g>

      <rect x="120" y="52" width="46" height="50" rx="4" fill="#FFFFFF" opacity="0.95" />
      <rect
        x="120"
        y="52"
        width="46"
        height="50"
        rx="4"
        stroke="#C7D8F2"
        strokeWidth="1.4"
        opacity="0.95"
      />
      <g stroke="#D6E3F6" strokeWidth="3" strokeLinecap="round">
        <path d="M129 65h22M129 74h28M129 83h18" />
      </g>

      {/* Folder front flap */}
      <path
        d="M46 66h118a6 6 0 0 1 5.9 7.06l-6.2 36A6 6 0 0 1 157.8 114H52.2a6 6 0 0 1-5.9-4.94l-6.2-36A6 6 0 0 1 46 66Z"
        fill="url(#es-folder)"
      />
      <path
        d="M40.1 73.06A6 6 0 0 1 46 66h118a6 6 0 0 1 5.9 7.06"
        stroke="#A9C7F0"
        strokeWidth="1.4"
      />

      {/* Client avatar chip resting on the folder */}
      <circle cx="105" cy="92" r="12" fill="#FFFFFF" />
      <circle cx="105" cy="92" r="12" stroke="#BFD6F5" strokeWidth="1.4" />
      <circle cx="105" cy="88.4" r="3.6" fill="#9CC0EE" />
      <path d="M99.4 98.6a6.2 6.2 0 0 1 11.2 0" fill="#9CC0EE" />

      {/* Paper plane */}
      <g>
        <path d="M150 14l-16 30-4-12-12-5 32-13Z" fill="#0EA5C9" opacity="0.9" />
        <path d="M150 14l-20 18" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M112 40c6-4 12-9 16-15"
          stroke="#9CC0EE"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="3 4"
        />
      </g>

      {/* Ambient dots */}
      <g fill="#CBDDF7">
        <circle cx="38" cy="34" r="3" />
        <circle cx="176" cy="46" r="2.4" />
        <circle cx="58" cy="126" r="2.4" />
        <circle cx="164" cy="124" r="3" />
      </g>
    </svg>
  )
}
