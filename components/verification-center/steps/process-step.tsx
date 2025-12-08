import { LuChevronDown, LuTriangleAlert } from 'react-icons/lu'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { StatusIcon } from './status-icon'
import { parseMeasurement, type MeasurementData } from '../utils/measurement'
import type { VerificationDocument } from '../types/verification'
import { FONT_FAMILIES } from '../constants'
import {
  getCardClasses,
  getHoverClasses,
  getMeasurementBorderClasses,
  getAttestationCardClasses,
  getInvertClass
} from '../utils/theme'

type DigestType = 'SOURCE' | 'RUNTIME' | 'CODE_INTEGRITY' | 'HPKE_KEY' | 'ROUTER_ENDPOINT' | 'GENERIC'

/**
 * Map a digestType into a title and subtitle for the measurement block.
 * Keeps presentation strings co-located and reduces inline branching.
 */
function getMeasurementLabel(digestType?: DigestType): {
  title: string
  subtitle?: string
} {
  switch (digestType) {
    case 'SOURCE':
      return {
        title: 'Source Fingerprint',
        subtitle: 'Fingerprint of the source binary built from the open source code published on GitHub and Sigstore.',
      }
    case 'RUNTIME':
      return {
        title: 'Enclave Fingerprint',
        subtitle: 'Fingerprint of the binary running in the secure enclave.',
      }
    case 'CODE_INTEGRITY':
      return {
        title: 'Security Verification',
        subtitle: 'Comparison of source and runtime measurements.',
      }
    case 'HPKE_KEY':
      return {
        title: 'Attested Encryption Key',
      }
    case 'ROUTER_ENDPOINT':
      return {
        title: 'Enclave URL',
      }
    default:
      return { title: 'Measurement' }
  }
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.02, staggerChildren: 0.03 },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  },
} as const

type ProcessStepProps = {
  title: string
  description: string
  status: 'pending' | 'success' | 'error' | 'skipped'
  error?: string
  measurement?: MeasurementData | string
  technicalDetails?: string
  children?: ReactNode
  digestType?: DigestType
  githubHash?: string
  verificationDocument?: VerificationDocument
  isDarkMode?: boolean
  compact?: boolean
}

export function ProcessStep({
  title,
  description,
  status,
  error,
  measurement,
  technicalDetails,
  children,
  digestType,
  githubHash,
  verificationDocument,
  isDarkMode = true,
  compact = false,
}: ProcessStepProps) {
  const [isOpen, setIsOpen] = useState(
    status === 'error' || error !== undefined,
  )

  useEffect(() => {
    if (status === 'error' || error !== undefined) {
      setIsOpen(true)
    }
  }, [status, error])

  // Feature flags for auxiliary UI derived strictly from digestType
  const isRemoteAttestation = digestType === 'RUNTIME'
  const isSourceCodeVerified = digestType === 'SOURCE'

  const label = getMeasurementLabel(digestType)

  const repoForLink = verificationDocument?.configRepo
  const hashForSigstore = verificationDocument?.releaseDigest ?? githubHash

  return (
    <div
      className={`w-full rounded-lg border transition-colors @container shadow-sm ${getCardClasses(isDarkMode, true)}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 text-left"
      >
        <div className="flex flex-row items-center gap-3 md:gap-4">
          <div className="flex items-center">
            <StatusIcon status={status} />
          </div>

          <div className="flex-1 text-left">
            <h3 className="text-sm font-medium text-content-primary">
              {title}
            </h3>
            {!compact && (
              <p
                className={`mt-2 hidden text-sm @[400px]:block ${
                  isDarkMode
                    ? 'text-content-secondary/80'
                    : 'text-gray-500'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                {description}
              </p>
            )}
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className={`rounded-lg p-2 transition-colors ${getHoverClasses(isDarkMode)}`}
          >
            <LuChevronDown className="h-5 w-5 text-content-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="process-step-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
            }}
            className="overflow-hidden"
          >
            <motion.div
              className="space-y-4 px-4 pb-4"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {error && status === 'error' && (
                <motion.div
                  variants={itemVariants}
                  className={`flex items-start gap-2 rounded-lg p-3 transition-colors ${
                    isDarkMode
                      ? 'bg-red-500/10 text-red-300'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  <LuTriangleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="overflow-hidden break-words text-sm">{error}</p>
                </motion.div>
              )}

              {(() => {
                const parsed = measurement ? parseMeasurement(measurement) : null

                const displayData = digestType === 'SOURCE' && verificationDocument
                  ? verificationDocument.codeFingerprint
                  : digestType === 'RUNTIME' && verificationDocument
                  ? verificationDocument.enclaveFingerprint
                  : digestType === 'HPKE_KEY' && verificationDocument
                  ? verificationDocument.hpkePublicKey
                  : digestType === 'ROUTER_ENDPOINT' && verificationDocument
                  ? verificationDocument.selectedRouterEndpoint
                  : null

                const shouldShowPlaceholder = status === 'pending' && (digestType === 'SOURCE' || digestType === 'RUNTIME' || digestType === 'HPKE_KEY' || digestType === 'ROUTER_ENDPOINT')

                if (!parsed && !displayData && !shouldShowPlaceholder) return null

                return (
                  <motion.div variants={itemVariants}>
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-content-primary">
                        {label.title}
                        {label.subtitle && status !== 'pending' && (
                          <span className="block text-xs font-normal text-content-secondary">
                            {label.subtitle}
                          </span>
                        )}
                      </h4>
                    </div>
                    <div>
                      <AnimatePresence mode="wait">
                        {shouldShowPlaceholder ? (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="space-y-2"
                          >
                            <div
                              className={`overflow-x-auto rounded-lg border p-3 transition-colors ${getMeasurementBorderClasses(isDarkMode, undefined)}`}
                            >
                              <div
                                className={`h-5 w-full animate-pulse rounded ${
                                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'
                                }`}
                              />
                            </div>
                          </motion.div>
                        ) : displayData ? (
                          <motion.div
                            key="displayData"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                            className="space-y-2"
                          >
                            <div
                              className={`overflow-x-auto rounded-lg border p-3 transition-colors ${getMeasurementBorderClasses(isDarkMode, status === 'success')}`}
                            >
                              <div className="whitespace-nowrap font-mono text-sm">
                                {displayData}
                              </div>
                            </div>
                          </motion.div>
                        ) : parsed ? (
                          <motion.div
                            key="parsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                            className="space-y-2"
                          >
                            {parsed.type && (
                              <div
                                className={`overflow-x-auto rounded-lg border p-3 transition-colors ${getMeasurementBorderClasses(isDarkMode, status === 'success')}`}
                              >
                                <div className="whitespace-nowrap font-mono text-sm">
                                  {parsed.type}
                                </div>
                              </div>
                            )}
                            {parsed.registers.map((register, i) => (
                              <div
                                key={i}
                                className={`overflow-x-auto rounded-lg border p-3 transition-colors ${getMeasurementBorderClasses(isDarkMode, status === 'success')}`}
                              >
                                <div className="whitespace-nowrap font-mono text-sm">
                                  {register}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })()}

              {isRemoteAttestation && status !== 'pending' && (() => {
                const parsed = measurement ? parseMeasurement(measurement) : null
                const typeString = parsed?.type?.toLowerCase() || ''
                const isSEV = /sev/.test(typeString)
                const isTDX = /tdx/.test(typeString)

                return (
                  <motion.div variants={itemVariants} className="mt-3">
                    <h4 className="mb-2 text-sm font-medium text-content-primary">
                      Runtime attested by
                    </h4>
                    <div className="mt-2 flex items-center space-x-2">
                      <a
                        href="https://docs.nvidia.com/attestation/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex h-10 w-20 items-center justify-center rounded-lg p-2 transition-colors ${getAttestationCardClasses(isDarkMode)}`}
                      >
                        <img
                          src="/icons/nvidia.svg"
                          alt="NVIDIA"
                          width={60}
                          height={18}
                          className={`max-h-4 w-auto opacity-60 ${getInvertClass(isDarkMode, true)}`}
                        />
                      </a>
                      {isSEV && (
                        <a
                          href="https://www.amd.com/en/developer/sev.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex h-10 w-20 items-center justify-center rounded-lg p-2 transition-colors ${getAttestationCardClasses(isDarkMode)}`}
                        >
                          <img
                            src="/icons/amd.svg"
                            alt="AMD"
                            width={40}
                            height={30}
                            className={`max-h-2.5 w-auto opacity-60 ${getInvertClass(isDarkMode)}`}
                          />
                        </a>
                      )}
                      {isTDX && (
                        <a
                          href="https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex h-10 w-20 items-center justify-center rounded-lg p-2 transition-colors ${getAttestationCardClasses(isDarkMode)}`}
                        >
                          <img
                            src="/icons/intel.svg"
                            alt="Intel"
                            width={36}
                            height={18}
                            className={`max-h-3 w-auto opacity-60 ${getInvertClass(isDarkMode)}`}
                          />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })()}

              {isSourceCodeVerified && status !== 'pending' && (
                <motion.div variants={itemVariants} className="mt-3">
                  <h4 className="mb-2 text-sm font-medium text-content-primary">
                    Code attested by
                  </h4>
                  <div className="mt-2 flex items-center space-x-4">
                    {repoForLink && (
                      <a
                        href={`https://github.com/${repoForLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-content-secondary transition-colors hover:text-content-primary"
                        style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO }}
                      >
                        <div className="flex items-center">
                          <img
                            src="/icons/github.svg"
                            alt="GitHub"
                            width={20}
                            height={20}
                            className={`h-5 w-auto ${getInvertClass(isDarkMode)}`}
                          />
                        </div>
                        <span>GitHub</span>
                      </a>
                    )}
                    {hashForSigstore && (
                      <a
                        href={`https://search.sigstore.dev/?hash=${hashForSigstore}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-content-secondary transition-colors hover:text-content-primary"
                        style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO }}
                      >
                        <div className="flex items-center">
                          <img
                            src={isDarkMode ? '/icons/sigstore.svg' : '/icons/sigstore-light.svg'}
                            alt="Sigstore"
                            width={20}
                            height={20}
                            className="h-5 w-auto"
                          />
                        </div>
                        <span>Sigstore</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {children && (
                <motion.div variants={itemVariants}>{children}</motion.div>
              )}

              {technicalDetails && (
                <motion.div variants={itemVariants}>
                  <h4 className="mb-2 text-sm font-medium text-content-primary">
                    Technical Details
                  </h4>
                  <p
                    className="text-sm text-content-secondary"
                  >
                    {technicalDetails}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {compact && (
              <motion.div variants={itemVariants} className="px-4 pb-4">
                <p
                  className={`text-sm ${
                    isDarkMode
                      ? 'text-content-secondary/60'
                      : 'text-gray-500'
                  }`}
                  style={{ fontFamily: FONT_FAMILIES.AEONIK }}
                >
                  {description}
                </p>
              </motion.div>
            )}
            {!compact && (
              <motion.div variants={itemVariants} className="block px-4 pb-4 @[400px]:hidden">
                <p
                  className={`text-sm ${
                    isDarkMode
                      ? 'text-content-secondary/60'
                      : 'text-gray-500'
                  }`}
                  style={{ fontFamily: FONT_FAMILIES.AEONIK }}
                >
                  {description}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
