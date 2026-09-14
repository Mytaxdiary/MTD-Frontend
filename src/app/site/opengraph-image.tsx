import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'My Tax Diary — MTD ITSA software for UK accountants'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(145deg, #0a1120 0%, #123047 48%, #075985 100%)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#7dd3fc',
          }}
        >
          My Tax Diary
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 900,
            }}
          >
            MTD ITSA software for UK accountants
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              lineHeight: 1.4,
              color: 'rgba(226,232,240,0.9)',
              maxWidth: 820,
            }}
          >
            Agent portal · Client portal · HMRC · Chase · Staff permissions
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
