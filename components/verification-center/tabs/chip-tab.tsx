import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdFingerPrint } from 'react-icons/io'
import { FONT_FAMILIES } from '@/lib/constants/verification'
import { TINFOIL_ACCENT_LIGHT, TINFOIL_ACCENT_LIGHT_DARKER } from '@/lib/constants/colors'
import type { VerificationDocument } from '@/lib/types/verification'
import type { StepStatus } from './types'

type ChipTabProps = {
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
  stepStatus: StepStatus
  errorMessage?: string
}

export function ChipTab({
  isDarkMode = true,
  verificationDocument,
  stepStatus,
  errorMessage,
}: ChipTabProps) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  const typeString = verificationDocument?.enclaveMeasurement?.measurement?.type?.toLowerCase() || ''
  const isSEV = /sev/.test(typeString)
  const isTDX = /tdx/.test(typeString)

  if (stepStatus === 'error') {
    return (
      <div className="space-y-4">
        <div>
          <h3
            className={`mb-2 font-semibold ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}
            style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
          >
            An error occurred
          </h3>
          <p
            className={isDarkMode ? 'text-red-400' : 'text-red-600'}
            style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
          >
            {errorMessage || 'Failed to verify runtime isolation.'}
          </p>
        </div>

        <div
          className={`relative flex items-start gap-3 rounded-site-lg border p-3 ${
            isDarkMode
              ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div
            className={`absolute top-2 right-2 flex items-center gap-1 font-medium ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}
            style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}
          >
            Unverified <span>✗</span>
          </div>
          <IoMdFingerPrint
            className={`h-5 w-5 flex-shrink-0 ${
              isDarkMode ? 'text-content-secondary' : 'text-gray-400'
            }`}
          />
          <div className="flex-1 overflow-hidden pr-20">
            <div className="mb-1 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
              Enclave code fingerprint
            </div>
            <div
              className={`truncate font-mono ${
                isDarkMode ? 'text-content-primary' : 'text-gray-900'
              }`}
              style={{ fontSize: '12px' }}
            >
              {verificationDocument?.enclaveFingerprint || 'No fingerprint available'}
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
          style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
        >
          Runtime is isolated
        </h3>
        <p
          className={isDarkMode ? 'text-content-secondary' : 'text-gray-600'}
          style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
        >
          The secure hardware enclave that processes your data has been attested and is verified.
          The code it is running matches the auditable open-source repository.
        </p>
      </div>

      <div
        className={`relative flex items-start gap-3 rounded-site-lg border p-3 ${
          isDarkMode
            ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
            : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
        }`}
      >
        {stepStatus === 'success' && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
            style={{
              fontFamily: FONT_FAMILIES.AEONIK_FONO,
              fontSize: '12px',
              color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER,
              backgroundColor: isDarkMode ? 'rgba(104, 199, 172, 0.15)' : 'rgba(0, 68, 68, 0.08)'
            }}
          >
            Attested <span>✓</span>
          </div>
        )}
        <IoMdFingerPrint
          className={`h-5 w-5 flex-shrink-0 ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-400'
          }`}
        />
        <div className="flex-1 overflow-hidden pr-20">
          <div className="mb-1 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
            Enclave code fingerprint
          </div>
          <div
            className={`truncate font-mono ${
              isDarkMode ? 'text-content-primary' : 'text-gray-900'
            }`}
            style={{ fontSize: '12px' }}
          >
            {verificationDocument?.enclaveFingerprint || 'No fingerprint available'}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
        className={`w-full rounded-site-control border px-4 py-2.5 font-medium transition-all ${
          isDarkMode
            ? 'border-border-subtle bg-surface-secondary text-content-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-surface-card'
            : 'border-border-subtle bg-gray-100 text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-200'
        }`}
        style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
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
              className={`rounded-site-lg border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="mb-2 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
                Hardware attestation
              </div>
              <p
                className={`mb-3 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}
              >
                The verifier receives a signed measurement from NVIDIA{isSEV ? ', AMD' : ''}{isTDX ? ', Intel' : ''} certifying the enclave environment and the digest of the binary actively running inside it.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://docs.nvidia.com/attestation/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors"
                  style={{
                    color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER,
                    fontFamily: FONT_FAMILIES.AEONIK_FONO,
                    fontSize: '12px'
                  }}
                >
                  NVIDIA attestation
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                {isSEV && (
                  <a
                    href="https://www.amd.com/en/developer/sev.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium transition-colors"
                    style={{
                      color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER,
                      fontFamily: FONT_FAMILIES.AEONIK_FONO,
                      fontSize: '12px'
                    }}
                  >
                    AMD SEV
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {isTDX && (
                  <a
                    href="https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium transition-colors"
                    style={{
                      color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER,
                      fontFamily: FONT_FAMILIES.AEONIK_FONO,
                      fontSize: '12px'
                    }}
                  >
                    Intel TDX
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {verificationDocument?.selectedEnclaveEndpoint && (
              <div
                className={`rounded-site-lg border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-1.5 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
                  Enclave endpoint
                </div>
                <div className={`break-all font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                  {verificationDocument.selectedEnclaveEndpoint}
                </div>
              </div>
            )}

            {verificationDocument?.enclaveMeasurement?.tlsPublicKeyFingerprint && (
              <div
                className={`rounded-site-lg border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-1.5 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
                  TLS public key fingerprint
                </div>
                <div className={`break-all font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                  {verificationDocument.enclaveMeasurement.tlsPublicKeyFingerprint}
                </div>
              </div>
            )}

            {verificationDocument?.enclaveMeasurement?.measurement && (
              <div
                className={`rounded-site-lg border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-3 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
                  Hardware measurements
                </div>
                <div className="space-y-3">
                  {verificationDocument.enclaveMeasurement.measurement.type && (
                    <div>
                      <div className="mb-1 opacity-60" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>Type</div>
                      <div className={`font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                        {verificationDocument.enclaveMeasurement.measurement.type}
                      </div>
                    </div>
                  )}
                  {verificationDocument.enclaveMeasurement.measurement.registers &&
                   verificationDocument.enclaveMeasurement.measurement.registers.length > 0 && (
                    <div className="space-y-3">
                      {verificationDocument.enclaveMeasurement.measurement.registers.map((reg: any, idx: number) => (
                        <div key={idx}>
                           <div className="mb-1 opacity-60" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>Register {idx}</div>
                           <div className={`break-all font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                            {typeof reg === 'object' ? JSON.stringify(reg) : reg}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationDocument?.hardwareMeasurement && (
              <div
                className={`rounded-site-lg border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-3 font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>
                  Hardware measurements
                </div>
                <div className="space-y-3">
                  {verificationDocument.hardwareMeasurement.ID && (
                    <div>
                      <div className="mb-1 opacity-60" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>Platform ID</div>
                      <div className={`break-all font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                        {verificationDocument.hardwareMeasurement.ID}
                      </div>
                    </div>
                  )}
                  {verificationDocument.hardwareMeasurement.MRTD && (
                    <div>
                      <div className="mb-1 opacity-60" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>MRTD</div>
                      <div className={`break-all font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                        {verificationDocument.hardwareMeasurement.MRTD}
                      </div>
                    </div>
                  )}
                  {verificationDocument.hardwareMeasurement.RTMR0 && (
                    <div>
                      <div className="mb-1 opacity-60" style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '12px' }}>RTMR0</div>
                      <div className={`break-all font-mono ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`} style={{ fontSize: '12px' }}>
                        {verificationDocument.hardwareMeasurement.RTMR0}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
