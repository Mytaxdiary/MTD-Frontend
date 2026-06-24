import '@/index.css'
import QueryProvider from '@/providers/queryProvider'

export const metadata = {
  title: 'NewEffect MTD ITSA',
  description: 'MTD ITSA agent platform. Manage quarterly submissions and client filings.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
