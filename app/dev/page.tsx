'use client'

import { useCallback, useEffect, useState } from 'react'
import { VerificationCenter } from '@/components/verification-center/verifier'
import { TinfoilBadge } from '@/components/tinfoil-badge'
import {
  mockFailureDocument,
  mockSuccessDocument,
  mockTransportFailureDocument,
  mockHPKEFailureDocument,
  mockOtherErrorDocument,
  mockEnclaveFailureDocument,
} from './fake-document'
import './app.css'

type DisplayMode = 'sidebar' | 'modal' | 'embedded'
type MockOutcome = 'success' | 'failure' | 'transport-failure' | 'hpke-failure' | 'other-error' | 'enclave-failure' | 'loading'

export default function DevPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('sidebar')
  const [isVerifierOpen, setIsVerifierOpen] = useState(true)
  const [mockOutcome, setMockOutcome] = useState<MockOutcome>('success')
  const [verificationDocument, setVerificationDocument] = useState<typeof mockSuccessDocument | undefined>(undefined)
  const [showHeader, setShowHeader] = useState(true)

  useEffect(() => {
    if (mockOutcome === 'loading') {
      setVerificationDocument(undefined)
      return
    }

    setVerificationDocument(undefined)
    const timer = setTimeout(() => {
      const documentMap = {
        success: mockSuccessDocument,
        failure: mockFailureDocument,
        'transport-failure': mockTransportFailureDocument,
        'hpke-failure': mockHPKEFailureDocument,
        'other-error': mockOtherErrorDocument,
        'enclave-failure': mockEnclaveFailureDocument,
        loading: undefined,
      }
      setVerificationDocument(documentMap[mockOutcome])
    }, 2000)

    return () => clearTimeout(timer)
  }, [mockOutcome])

  const handleModeChange = useCallback((mode: DisplayMode) => {
    setDisplayMode(mode)
    setIsVerifierOpen(true)
  }, [])

  const handleToggleVerifier = useCallback(() => {
    setIsVerifierOpen((current) => !current)
  }, [])

  const appClassName = isDarkMode ? 'app app--dark' : 'app'

  return (
    <div className={appClassName}>
      <aside className="app__sidebar">
        <h1>Verification Center Demo</h1>
        <button type="button" onClick={handleToggleVerifier}>
          {isVerifierOpen ? 'Hide Verification Center' : 'Show Verification Center'}
        </button>

        <section className="app__controls">
          <label>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(event) => setIsDarkMode(event.target.checked)}
            />
            Dark mode
          </label>

          <label>
            <input
              type="checkbox"
              checked={showHeader}
              onChange={(event) => setShowHeader(event.target.checked)}
            />
            Show header
          </label>

          <div className="app__group">
            <p>Mock outcome</p>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="success"
                checked={mockOutcome === 'success'}
                onChange={() => setMockOutcome('success')}
              />
              Success
            </label>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="failure"
                checked={mockOutcome === 'failure'}
                onChange={() => setMockOutcome('failure')}
              />
              Measurement mismatch
            </label>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="enclave-failure"
                checked={mockOutcome === 'enclave-failure'}
                onChange={() => setMockOutcome('enclave-failure')}
              />
              Enclave attestation failure
            </label>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="transport-failure"
                checked={mockOutcome === 'transport-failure'}
                onChange={() => setMockOutcome('transport-failure')}
              />
              Transport failure
            </label>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="hpke-failure"
                checked={mockOutcome === 'hpke-failure'}
                onChange={() => setMockOutcome('hpke-failure')}
              />
              HPKE key failure
            </label>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="other-error"
                checked={mockOutcome === 'other-error'}
                onChange={() => setMockOutcome('other-error')}
              />
              Other error
            </label>
            <label>
              <input
                type="radio"
                name="mock-outcome"
                value="loading"
                checked={mockOutcome === 'loading'}
                onChange={() => setMockOutcome('loading')}
              />
              Loading state
            </label>
          </div>

          <div className="app__group">
            <p>Display mode</p>
            <label>
              <input
                type="radio"
                name="display-mode"
                value="sidebar"
                checked={displayMode === 'sidebar'}
                onChange={() => handleModeChange('sidebar')}
              />
              Sidebar
            </label>
            <label>
              <input
                type="radio"
                name="display-mode"
                value="modal"
                checked={displayMode === 'modal'}
                onChange={() => handleModeChange('modal')}
              />
              Modal
            </label>
            <label>
              <input
                type="radio"
                name="display-mode"
                value="embedded"
                checked={displayMode === 'embedded'}
                onChange={() => handleModeChange('embedded')}
              />
              Embedded
            </label>
          </div>
        </section>
      </aside>

      <main className="app__main">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Tinfoil Badge</h3>
            <div style={{ width: '200px', height: '45px' }}>
              <TinfoilBadge
                verificationDocument={verificationDocument}
                isDarkMode={isDarkMode}
                compact={false}
                onClick={handleToggleVerifier}
              />
            </div>
          </div>
        </div>
      </main>

      {displayMode === 'sidebar' && (
        <>
          <div
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '420px',
              maxWidth: '85vw',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderLeft: '1px solid',
              borderColor: isDarkMode ? '#1f2937' : '#e5e7eb',
              background: isDarkMode ? '#0b0f16' : '#ffffff',
              transform: isVerifierOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 200ms ease-in-out',
            }}
          >
            {isVerifierOpen && (
              <VerificationCenter
                verificationDocument={verificationDocument}
                isDarkMode={isDarkMode}
                showHeader={showHeader}
              />
            )}
          </div>
          {isVerifierOpen && (
            <div
              className="fixed inset-0 bg-black/50 md:hidden"
              style={{ zIndex: 9998 }}
              onClick={() => setIsVerifierOpen(false)}
            />
          )}
        </>
      )}

      {displayMode === 'modal' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(17, 24, 39, 0.5)',
            opacity: isVerifierOpen ? 1 : 0,
            pointerEvents: isVerifierOpen ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
          onClick={() => setIsVerifierOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: 'min(540px, 90vw)',
              height: 'min(80vh, 680px)',
              borderRadius: 8,
              overflow: 'hidden',
              background: isDarkMode ? '#0b0f16' : '#ffffff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 25px 50px rgba(0,0,0,0.15)',
              transform: isVerifierOpen ? 'scale(1) translateY(0)' : 'scale(0.98) translateY(4px)',
              transition: 'transform 250ms cubic-bezier(.2,.8,.2,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isVerifierOpen && (
              <VerificationCenter
                verificationDocument={verificationDocument}
                isDarkMode={isDarkMode}
                showHeader={showHeader}
              />
            )}
          </div>
        </div>
      )}

      {displayMode === 'embedded' && (
        <div style={{ width: 'min(720px, 100%)', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
          <VerificationCenter
            verificationDocument={verificationDocument}
            isDarkMode={isDarkMode}
            showHeader={showHeader}
          />
        </div>
      )}
    </div>
  )
}
