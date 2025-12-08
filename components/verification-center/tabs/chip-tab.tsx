import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdFingerPrint } from 'react-icons/io'
import { FONT_FAMILIES } from '../constants'
import type { VerificationDocument } from '../types/verification'
import type { StepStatus } from './types'

type ChipTabProps = {
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
  stepStatus: StepStatus
}

export function ChipTab({
  isDarkMode = true,
  verificationDocument,
  stepStatus,
}: ChipTabProps) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  const typeString = verificationDocument?.enclaveMeasurement?.measurement?.type?.toLowerCase() || ''
  const isSEV = /sev/.test(typeString)
  const isTDX = /tdx/.test(typeString)

  return (
    <div className="space-y-4">
      <div>
        <h3
          className={`mb-2 text-lg font-semibold ${
            isDarkMode ? 'text-content-primary' : 'text-gray-900'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          Runtime is isolated
        </h3>
        <p
          className={`text-sm ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-600'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          The secure hardware enclave that processes your data has been attested and is verified.
          The code it is running matches the auditable open-source repository.
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
            Attested <span>✓</span>
          </div>
        )}
        <IoMdFingerPrint
          className={`h-5 w-5 flex-shrink-0 ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-400'
          }`}
        />
        <div className="flex-1 overflow-hidden pr-20">
          <div className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
            Enclave code fingerprint
          </div>
          <div
            className={`font-mono text-xs truncate ${
              isDarkMode ? 'text-content-primary' : 'text-gray-900'
            }`}
          >
            {verificationDocument?.enclaveFingerprint || 'No fingerprint available'}
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
            <div
              className={`rounded-xl border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="mb-2 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                Hardware Attestation
              </div>
              <p
                className={`text-xs mb-3 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                The verifier receives a signed measurement from NVIDIA{isSEV ? ', AMD' : ''}{isTDX ? ', Intel' : ''} certifying the enclave environment and the digest of the binary actively running inside it.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://docs.nvidia.com/attestation/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isDarkMode
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                  style={{ fontFamily: FONT_FAMILIES.AEONIK }}
                >
                  NVIDIA Attestation
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                {isSEV && (
                  <a
                    href="https://www.amd.com/en/developer/sev.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      isDarkMode
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                    style={{ fontFamily: FONT_FAMILIES.AEONIK }}
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
                    className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      isDarkMode
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                    style={{ fontFamily: FONT_FAMILIES.AEONIK }}
                  >
                    Intel TDX
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {verificationDocument?.selectedRouterEndpoint && (
              <div
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-1.5 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Router Endpoint
                </div>
                <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
                  {verificationDocument.selectedRouterEndpoint}
                </div>
              </div>
            )}

            {verificationDocument?.enclaveMeasurement?.tlsPublicKeyFingerprint && (
              <div
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-1.5 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  TLS Public Key Fingerprint
                </div>
                <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
                  {verificationDocument.enclaveMeasurement.tlsPublicKeyFingerprint}
                </div>
              </div>
            )}

            {verificationDocument?.enclaveMeasurement?.measurement && (
              <div
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-3 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Hardware Measurements
                </div>
                <div className="space-y-3">
                  {verificationDocument.enclaveMeasurement.measurement.type && (
                    <div>
                      <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>Type</div>
                      <div className={`font-mono text-xs ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
                        {verificationDocument.enclaveMeasurement.measurement.type}
                      </div>
                    </div>
                  )}
                  {verificationDocument.enclaveMeasurement.measurement.registers &&
                   verificationDocument.enclaveMeasurement.measurement.registers.length > 0 && (
                    <div className="space-y-3">
                      {verificationDocument.enclaveMeasurement.measurement.registers.map((reg: any, idx: number) => (
                        <div key={idx}>
                          <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>Register {idx}</div>
                          <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
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
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="mb-3 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Hardware Measurements
                </div>
                <div className="space-y-3">
                  {verificationDocument.hardwareMeasurement.ID && (
                    <div>
                      <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>Platform ID</div>
                      <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
                        {verificationDocument.hardwareMeasurement.ID}
                      </div>
                    </div>
                  )}
                  {verificationDocument.hardwareMeasurement.MRTD && (
                    <div>
                      <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>MRTD</div>
                      <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
                        {verificationDocument.hardwareMeasurement.MRTD}
                      </div>
                    </div>
                  )}
                  {verificationDocument.hardwareMeasurement.RTMR0 && (
                    <div>
                      <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>RTMR0</div>
                      <div className={`font-mono text-xs break-all ${isDarkMode ? 'text-content-primary' : 'text-gray-900'}`}>
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
