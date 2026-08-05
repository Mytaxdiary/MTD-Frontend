import '@/index.css'
import QueryProvider from '@/providers/queryProvider'

export const metadata = {
  title: 'My Tax Diary',
  description:
    'My Tax Diary: smart tax management for agents. Track MTD obligations, filings, and client progress.',
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
