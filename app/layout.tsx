import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tinfoil Verification Center',
  description: 'Embeddable Tinfoil verification center',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
