import B from '@/styles/theme'

const COMPATIBLE_SOFTWARE_URL =
  'https://www.gov.uk/guidance/find-software-thats-compatible-with-making-tax-digital-for-income-tax'

/**
 * HMRC checklist requirement: clearly state unsupported income types and that
 * end-of-year / Final Declaration filing is not supported, with a link to
 * GOV.UK compatible software guidance.
 */
export default function MtdScopeNotice() {
  return (
    <div
      style={{
        padding: '12px 14px',
        background: B.surface,
        border: `1px solid ${B.border}`,
        borderRadius: 8,
        fontSize: 13,
        color: B.muted,
        lineHeight: 1.55,
      }}
    >
      <div style={{ fontWeight: 700, color: B.text, marginBottom: 4 }}>
        What this software covers
      </div>
      My Tax Diary supports self-employment and UK property for in-year MTD
      oversight (obligations, status, and submitted figures). It does not cover
      non-mandated income sources, foreign property filing, or end-of-year
      processes including Final Declaration submission. For software that
      supports those areas, see{' '}
      <a
        href={COMPATIBLE_SOFTWARE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: B.link, fontWeight: 600 }}
      >
        GOV.UK Making Tax Digital compatible software
      </a>
      .
    </div>
  )
}

export { COMPATIBLE_SOFTWARE_URL }
