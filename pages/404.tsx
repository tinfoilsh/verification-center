import Head from 'next/head'

// Next's built-in 404 page uses inline styles, which style-src 'self' blocks.
export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 – Tinfoil Verification Center</title>
      </Head>
      <main className="flex h-screen items-center justify-center font-sans text-sm text-gray-700">
        404 – This page could not be found.
      </main>
    </>
  )
}
