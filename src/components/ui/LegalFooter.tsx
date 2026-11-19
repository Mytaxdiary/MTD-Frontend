import Link from 'next/link'
import { SITE_LEGAL } from '@/features/marketing/nav'

interface Props {
  style?: React.CSSProperties
}

export default function LegalFooter({ style }: Props) {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 28,
        lineHeight: 1.7,
        ...style,
      }}
    >
      By using this service you agree to our{' '}
      <Link href={SITE_LEGAL.terms} style={{ color: '#64748B', textDecoration: 'underline' }}>
        Terms &amp; Conditions
      </Link>{' '}
      and{' '}
      <Link href={SITE_LEGAL.privacy} style={{ color: '#64748B', textDecoration: 'underline' }}>
        Privacy Policy
      </Link>
      .
    </div>
  )
}
