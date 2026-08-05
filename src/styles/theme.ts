const theme = {
  primary: '#0EA5C9',
  primaryDark: '#0284A8',
  // WCAG AA — text links and focus outlines on white backgrounds (#0369A1 on #FFF → 5.47:1 ✓)
  link: '#0369A1',
  // WCAG AA — primary action buttons with white label (#075985 on #FFF → 7.3:1 if used as bg)
  primaryBtn: '#075985',
  navy: '#1B2A4A',
  surface: '#F8FAFC',
  white: '#FFFFFF',
  /** Default outline — clear enough on white cards (was too pale at #E2E8F0). */
  border: '#CBD5E1',
  borderLight: '#E2E8F0',
  /** Alias kept for newer screens; same weight as border. */
  borderStrong: '#94A3B8',
  /** Standard card elevation. Depth reads better than a thicker border. */
  cardShadow: '0 1px 2px rgba(15,23,42,0.05), 0 2px 6px rgba(15,23,42,0.06)',
  text: '#0F172A',
  muted: '#475569',
  light: '#64748B',
  xlight: '#94A3B8',
  red: '#EF4444',
  redBg: '#FEF2F2',
  redText: '#991B1B',
  amber: '#F59E0B',
  amberBg: '#FFFBEB',
  amberText: '#92400E',
  green: '#10B981',
  greenBg: '#ECFDF5',
  greenText: '#065F46',
  purple: '#8B5CF6',
  purpleBg: '#F5F3FF',
  purpleText: '#5B21B6',
  blueBg: '#F0F9FF',
  blueText: '#0C4A6E',

  /* ── Sidebar (dark shell) ──────────────────────────────────────────────
   * The sidebar sits on a near-black navy with a faint circuit motif.
   * Text opacities are tuned so inactive items still clear WCAG AA. */
  sidebarBg: '#0A1120',
  sidebarBgTop: '#101C33',
  sidebarBorder: 'rgba(148,163,184,0.14)',
  sidebarActiveBg: 'rgba(14,165,201,0.16)',
  sidebarActiveBorder: 'rgba(14,165,201,0.34)',
  sidebarHoverBg: 'rgba(255,255,255,0.06)',
  sidebarText: 'rgba(226,232,240,0.78)',
  sidebarTextActive: '#FFFFFF',
  sidebarLabel: 'rgba(148,163,184,0.72)',
}

export default theme
