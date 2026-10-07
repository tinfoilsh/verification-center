import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { VerificationCenter, type VerificationDocument } from '@/components/verification-center/verifier'

function VerificationCenterPage() {
  const [verificationDocument, setVerificationDocument] = useState<VerificationDocument | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [type, setType] = useState<'chat' | 'default'>('default')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    setIsDarkMode(params.get('darkMode') === 'true')
    setShowHeader(params.get('showHeader') !== 'false')
    const typeParam = params.get('type')
    if (typeParam === 'chat') setType('chat')

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TINFOIL_VERIFICATION_DOCUMENT') {
        setVerificationDocument(event.data.document)
      } else if (event.data.type === 'TINFOIL_REQUEST_VERIFICATION_DOCUMENT') {
        window.parent.postMessage({ type: 'TINFOIL_REQUEST_VERIFICATION_DOCUMENT' }, '*')
      }
    }

    window.addEventListener('message', handleMessage)
    window.parent.postMessage({ type: 'TINFOIL_VERIFICATION_CENTER_READY' }, '*')

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <>
    <Head>
      <title>Tinfoil Verification Center</title>
    </Head>
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <VerificationCenter
        verificationDocument={verificationDocument ?? undefined}
        isDarkMode={isDarkMode}
        showHeader={showHeader}
        type={type}
      />
    </div>
    </>
  )
}

// Rendered on the client only. Components set styles through React style
// props, which the browser applies via the CSSOM. Server-rendering them
// would put style="" attributes in the HTML, which style-src 'self'
// blocks and hydration never re-applies.
export default dynamic(() => Promise.resolve(VerificationCenterPage), { ssr: false })
