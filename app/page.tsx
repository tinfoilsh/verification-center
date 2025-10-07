'use client'

import { useEffect, useRef, useState } from 'react'
import type { VerificationDocument } from 'tinfoil'

export default function VerificationCenterPage() {
  const centerRef = useRef<any>(null)
  const [verificationDocument, setVerificationDocument] = useState<VerificationDocument | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showVerificationFlow, setShowVerificationFlow] = useState(true)

  useEffect(() => {
    import('@tinfoilsh/verification-center-ui').then(() => {
    }).catch(err => {
      console.error('Failed to load verification center UI:', err)
    })

    const params = new URLSearchParams(window.location.search)

    setIsDarkMode(params.get('darkMode') === 'true')
    setShowVerificationFlow(params.get('showVerificationFlow') !== 'false')
    setIsOpen(params.get('open') !== 'false')

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TINFOIL_VERIFICATION_DOCUMENT') {
        setVerificationDocument(event.data.document)
      } else if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_OPEN') {
        setIsOpen(true)
      } else if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_CLOSE') {
        setIsOpen(false)
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

  useEffect(() => {
    if (centerRef.current) {
      if (verificationDocument) {
        centerRef.current.verificationDocument = verificationDocument
      }
      centerRef.current.onRequestVerificationDocument = async () => {
        window.parent.postMessage({ type: 'TINFOIL_REQUEST_VERIFICATION_DOCUMENT' }, '*')
        return verificationDocument
      }
    }
  }, [verificationDocument])

  useEffect(() => {
    const center = centerRef.current
    if (center) {
      const handleClose = () => {
        setIsOpen(false)
        window.parent.postMessage({ type: 'TINFOIL_VERIFICATION_CENTER_CLOSED' }, '*')
      }
      center.addEventListener('close', handleClose)
      return () => {
        center.removeEventListener('close', handleClose)
      }
    }
  }, [])

  return (
    <div className="h-screen w-full">
      <tinfoil-verification-center
        ref={centerRef as any}
        open={isOpen ? 'true' : undefined}
        is-dark-mode={isDarkMode ? 'true' : 'false'}
        mode="embedded"
        show-verification-flow={showVerificationFlow ? 'true' : 'false'}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
