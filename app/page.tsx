'use client'

import { useEffect, useState } from 'react'
import { VerificationCenter, type VerificationDocument } from '@/components/verification-center/verifier'

export default function VerificationCenterPage() {
  const [verificationDocument, setVerificationDocument] = useState<VerificationDocument | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    setIsDarkMode(params.get('darkMode') === 'true')

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
    <div className="h-screen w-full">
      <VerificationCenter
        verificationDocument={verificationDocument ?? undefined}
        isDarkMode={isDarkMode}
        fillContainer={true}
      />
    </div>
  )
}
