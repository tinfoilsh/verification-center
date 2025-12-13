import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONT_FAMILIES } from '@/lib/constants/verification'
import { TINFOIL_ACCENT_LIGHT, TINFOIL_ACCENT_LIGHT_DARKER } from '@/lib/constants/colors'
import { TfKey as KeyIcon } from '@tinfoilsh/tinfoil-icons'
import type { VerificationDocument } from '@/lib/types/verification'
import type { StepStatus } from './types'

type KeyTabProps = {
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
  stepStatus: StepStatus
  errorMessage?: string
}

export function KeyTab({
  isDarkMode = true,
  verificationDocument,
  stepStatus,
  errorMessage,
}: KeyTabProps) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  if (stepStatus === 'error') {
    return (
      <div className="space-y-4">
        <div>
          <h3
            className={`mb-2 font-semibold ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}
            style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
          >
            An error occurred
          </h3>
          <p
            className={isDarkMode ? 'text-red-400' : 'text-red-600'}
            style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
          >
            {errorMessage || 'Failed to verify encryption.'}
          </p>
        </div>

        <div
          className={`relative flex items-center gap-3 rounded-xl border p-3 ${
            isDarkMode
              ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div
            className={`absolute top-2 right-2 flex items-center gap-1 font-medium ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}
            style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}
          >
            Unverified <span>✗</span>
          </div>
          <KeyIcon
            className={`w-5 h-5 flex-shrink-0 ${
              isDarkMode ? 'text-content-secondary' : 'text-gray-400'
            }`}
          />
          <div className="flex-1 overflow-hidden pr-20">
            <div className="font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}>
              Your unique encryption key
            </div>
            <div
              className={`font-mono truncate ${
                isDarkMode ? 'text-content-primary' : 'text-gray-900'
              }`}
              style={{ fontSize: '12px' }}
            >
              {verificationDocument?.hpkePublicKey || 'No key available'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3
          className={`mb-2 font-semibold ${
            isDarkMode ? 'text-content-primary' : 'text-gray-900'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
        >
          Data is encrypted
        </h3>
        <p
          className={isDarkMode ? 'text-content-secondary' : 'text-gray-600'}
          style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
        >
          Your data is encrypted using a unique key generated inside the secure hardware enclave and verified on your device.
        </p>
      </div>
      <div
        className={`relative flex items-center gap-3 rounded-xl border p-3 ${
          isDarkMode
            ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
            : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
        }`}
      >
        {stepStatus === 'success' && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 font-medium"
            style={{
              fontFamily: FONT_FAMILIES.AEONIK,
              fontSize: '12px',
              color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER
            }}
          >
            Attested <span>✓</span>
          </div>
        )}
        <KeyIcon
          className={`w-5 h-5 flex-shrink-0 ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-400'
          }`}
        />
        <div className="flex-1 overflow-hidden pr-20">
          <div className="font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}>
            Your unique encryption key
          </div>
          <div
            className={`font-mono truncate ${
              isDarkMode ? 'text-content-primary' : 'text-gray-900'
            }`}
            style={{ fontSize: '12px' }}
          >
            {verificationDocument?.hpkePublicKey || 'No key available'}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
        className={`w-full rounded-xl border px-4 py-2.5 font-medium transition-all ${
          isDarkMode
            ? 'border-border-subtle bg-surface-chat text-content-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-surface-card'
            : 'border-border-subtle bg-gray-100 text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-200'
        }`}
        style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
      >
        {showAdditionalInfo ? 'Hide additional info' : 'Show additional info'}
      </button>

      <AnimatePresence>
        {showAdditionalInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
            }}
            className="overflow-hidden space-y-3"
          >
            <div
              className={`rounded-xl border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="mb-2 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}>
                Encryption Protocol
              </div>
              <p
                className={`mb-3 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}
              >
                EHBP (Encrypted HTTP Body Protocol) encrypts HTTP message bodies end-to-end using HPKE, ensuring only the intended recipient can decrypt the payload.
              </p>
              <a
                href="https://docs.tinfoil.sh/resources/ehbp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium transition-colors"
                style={{
                  color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER,
                  fontFamily: FONT_FAMILIES.AEONIK,
                  fontSize: '12px'
                }}
              >
                Learn more about EHBP
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {verificationDocument?.hpkePublicKey && (
              <div
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-1.5 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}>
                  Full HPKE Public Key
                </div>
                <div className={`font-mono break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                  {verificationDocument.hpkePublicKey}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
