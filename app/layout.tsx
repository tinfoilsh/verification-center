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
      <head>
        <link rel="preload" href="/fonts/aeonik-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/aeonikfono-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/icons/chevron-band-divider.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/logo-green.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/logo-white.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/amd.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/intel.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/nvidia.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/logo-loading-loop.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
