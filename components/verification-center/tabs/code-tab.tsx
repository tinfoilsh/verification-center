import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdFingerPrint } from 'react-icons/io'
import { FaGithub } from 'react-icons/fa'
import { FONT_FAMILIES } from '../constants'
import type { VerificationDocument } from '../types/verification'
import type { StepStatus } from './types'

type CodeTabProps = {
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
  stepStatus: StepStatus
}

export function CodeTab({
  isDarkMode = true,
  verificationDocument,
  stepStatus,
}: CodeTabProps) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <h3
          className={`mb-2 text-lg font-semibold ${
            isDarkMode ? 'text-content-primary' : 'text-gray-900'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          Code is auditable
        </h3>
        <p
          className={`text-sm ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-600'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          All the code that is processing your data comes from a trusted open-source repository and is auditable through the Sigstore transparency log.
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
            className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-medium ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            }`}
            style={{ fontFamily: FONT_FAMILIES.AEONIK }}
          >
            Verified <span>✓</span>
          </div>
        )}
        <IoMdFingerPrint
          className={`h-5 w-5 flex-shrink-0 ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-400'
          }`}
        />
        <div className="flex-1 overflow-hidden pr-20">
          <div className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
            Source code fingerprint
          </div>
          <div
            className={`font-mono text-xs truncate ${
              isDarkMode ? 'text-content-primary' : 'text-gray-900'
            }`}
          >
            {verificationDocument?.codeFingerprint || 'No fingerprint available'}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
          isDarkMode
            ? 'border-border-subtle bg-surface-chat text-content-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-surface-card'
            : 'border-border-subtle bg-gray-100 text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-200'
        }`}
        style={{ fontFamily: FONT_FAMILIES.AEONIK }}
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
            {verificationDocument?.codeFingerprint && (
              <div
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-1.5 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Full Code Fingerprint
                </div>
                <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
                  {verificationDocument.codeFingerprint}
                </div>
              </div>
            )}
            {verificationDocument?.configRepo && (
              <div
                className={`relative rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <FaGithub className={`absolute top-3 right-3 h-6 w-6 ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} />
                <div className="mb-2 text-xs font-medium opacity-70 pr-8" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Configuration Repository
                </div>
                <p
                  className={`text-xs mb-3 pr-8 ${
                    isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                  }`}
                  style={{ fontFamily: FONT_FAMILIES.AEONIK }}
                >
                  The configuration repository specifies exactly what code is running inside the secure enclave, including dependencies and build instructions.
                </p>
                <a
                  href={`https://github.com/${verificationDocument.configRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isDarkMode
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                  style={{ fontFamily: FONT_FAMILIES.AEONIK }}
                >
                  {verificationDocument.configRepo}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            <div
              className={`relative rounded-xl border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <img
                src={isDarkMode ? '/icons/sigstore.svg' : '/icons/sigstore-light.svg'}
                alt="Sigstore"
                className="absolute top-3 right-3 h-6 w-6"
              />
              <div className="mb-2 text-xs font-medium opacity-70 pr-8" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                Sigstore Transparency Log
              </div>
              <p
                className={`text-xs mb-3 pr-8 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                Verifies that the source code published on GitHub was correctly built through GitHub Actions and that the resulting binary is available on the Sigstore transparency log.
              </p>
              <a
                href="https://search.sigstore.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  isDarkMode
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-emerald-600 hover:text-emerald-700'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                View on Sigstore
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
