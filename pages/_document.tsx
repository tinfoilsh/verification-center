import { Head, Html, Main, NextScript } from 'next/document'

// Pages Router on purpose: its static export has no executable inline
// scripts (only the __NEXT_DATA__ JSON block), so script-src 'self' holds
// without computing hashes at deploy time. The App Router streams its
// RSC payload as inline <script> tags, which WEBCAT can only admit by hash.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Embeddable Tinfoil verification center" />
        <link rel="preload" href="/fonts/aeonik-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/aeonikfono-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/icons/logo-green.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/logo-white.svg" as="image" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
