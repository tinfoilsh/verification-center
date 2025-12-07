import { useState } from 'react'
import { LuKey, LuShieldAlert, LuBug } from 'react-icons/lu'
import { FaGithub } from 'react-icons/fa'
import { IoMdFingerPrint } from 'react-icons/io'
import { PiSpinner } from 'react-icons/pi'
import { FONT_FAMILIES } from './constants'
import { motion, AnimatePresence } from 'framer-motion'
import type { VerificationDocument } from './types/verification'

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error'

type StepStatus = 'pending' | 'success' | 'error'

type VerificationInitialStateProps = {
  isDarkMode?: boolean
  provider?: string
  verificationDocument?: VerificationDocument
  status?: VerificationStatus
  errorMessage?: string
  stepStatuses?: {
    encryption: StepStatus
    code: StepStatus
    hardware: StepStatus
    other?: StepStatus
  }
}

type TabType = 'key' | 'code' | 'chip' | 'other' | null

export function VerificationInitialState({
  isDarkMode = true,
  provider = 'DuckDuckGo',
  verificationDocument,
  status = 'success',
  errorMessage,
  stepStatuses
}: VerificationInitialStateProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>(null)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  const getStepStatus = (tabId: TabType): StepStatus => {
    if (status === 'verifying') return 'pending'
    if (!stepStatuses) {
      return status === 'error' ? 'error' : 'success'
    }
    switch (tabId) {
      case 'key':
        return stepStatuses.encryption
      case 'code':
        return stepStatuses.code
      case 'chip':
        return stepStatuses.hardware
      case 'other':
        return stepStatuses.other || 'success'
      default:
        return 'success'
    }
  }

  const hasOtherError = stepStatuses?.other === 'error'

  const tabs = [
    {
      id: 'key' as const,
      prefix: 'Data is',
      label: 'Encrypted',
      icon: <img src="/icons/key.svg" alt="Key" className="h-8 w-8" style={{ fill: 'currentColor' }} />
    },
    {
      id: 'code' as const,
      prefix: 'Code is',
      label: 'Auditable',
      icon: <img src="/icons/code.svg" alt="Code" className="h-8 w-8" style={{ fill: 'currentColor' }} />
    },
    {
      id: 'chip' as const,
      prefix: 'Runtime is',
      label: 'Isolated',
      icon: <img src="/icons/cpu.svg" alt="CPU" className="h-8 w-8" style={{ fill: 'currentColor' }} />
    },
    {
      id: 'other' as const,
      prefix: '',
      label: 'Error',
      icon: <LuBug className="h-7 w-7" />,
      showOnlyOnError: true
    }
  ]

  const visibleTabs = tabs.filter(tab => !tab.showOnlyOnError || hasOtherError)

  const renderTabContent = (tabId: TabType) => {
    if (!tabId) return null

    switch (tabId) {
      case 'key':
        return (
          <div className="space-y-4">
            <div>
              <h3
                className={`mb-2 text-lg font-semibold ${
                  isDarkMode ? 'text-content-primary' : 'text-gray-900'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                Data is encrypted
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                Your data is encrypted using a unique key generated inside the secure hardware enclave and verified on your device.
              </p>
            </div>
            <div
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <LuKey
                className={`h-5 w-5 flex-shrink-0 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-400'
                }`}
              />
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Your unique encryption key
                </div>
                <div
                  className={`font-mono text-xs truncate ${
                    isDarkMode ? 'text-content-primary' : 'text-gray-900'
                  }`}
                >
                  {verificationDocument?.hpkePublicKey || 'No key available'}
                </div>
              </div>
            </div>
          </div>
        )

      case 'code':
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
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <IoMdFingerPrint
                className={`h-5 w-5 flex-shrink-0 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-400'
                }`}
              />
              <div className="flex-1 overflow-hidden">
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
            <div className="flex gap-3">
              <a
                href={`https://github.com/${verificationDocument?.configRepo || 'tinfoilsh'}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat text-content-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-surface-card'
                    : 'border-border-subtle bg-gray-100 text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-200'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                <FaGithub className="h-4 w-4 flex-shrink-0" />
                <span className="leading-none">See the code</span>
              </a>
              <a
                href="https://search.sigstore.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-chat text-content-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-surface-card'
                    : 'border-border-subtle bg-gray-100 text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-200'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                <img
                  src={isDarkMode ? '/icons/sigstore.svg' : '/icons/sigstore-light.svg'}
                  alt="Sigstore"
                  className="h-4 w-4 flex-shrink-0"
                />
                <span className="leading-none">Sigstore Entry</span>
              </a>
            </div>
          </div>
        )

      case 'chip':
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

            {/* Enclave Fingerprint - always visible */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                isDarkMode
                  ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <IoMdFingerPrint
                className={`h-5 w-5 flex-shrink-0 ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-400'
                }`}
              />
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                  Enclave fingerprint
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

            {/* Show Additional Info Button */}
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

            {/* Additional Info */}
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
                  {/* Router Endpoint */}
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

                  {/* TLS Public Key Fingerprint */}
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

                  {/* Enclave Measurements */}
                  {verificationDocument?.enclaveMeasurement?.measurement && (
                    <div
                      className={`rounded-xl border p-3 ${
                        isDarkMode
                          ? 'border-border-subtle bg-surface-chat shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                          : 'border-border-subtle bg-surface-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                      }`}
                    >
                      <div className="mb-3 text-xs font-medium opacity-70" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
                        Enclave Measurements
                      </div>
                      <div className="space-y-2">
                        {verificationDocument.enclaveMeasurement.measurement.type && (
                          <div>
                            <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>Type</div>
                            <div className={`rounded border p-2 font-mono text-xs ${isDarkMode ? 'bg-surface-background border-border-subtle text-content-primary' : 'bg-white border-gray-200 text-gray-900'}`}>
                              {verificationDocument.enclaveMeasurement.measurement.type}
                            </div>
                          </div>
                        )}
                        {verificationDocument.enclaveMeasurement.measurement.registers &&
                         verificationDocument.enclaveMeasurement.measurement.registers.length > 0 && (
                          <div className="space-y-2">
                            {verificationDocument.enclaveMeasurement.measurement.registers.map((reg: any, idx: number) => (
                              <div key={idx}>
                                <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>Register {idx}</div>
                                <div className={`rounded border p-2 font-mono text-xs break-all ${isDarkMode ? 'bg-surface-background border-border-subtle text-content-primary' : 'bg-white border-gray-200 text-gray-900'}`}>
                                  {typeof reg === 'object' ? JSON.stringify(reg) : reg}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hardware Measurements */}
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
                      <div className="space-y-2">
                        {verificationDocument.hardwareMeasurement.ID && (
                          <div>
                            <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>Platform ID</div>
                            <div className={`rounded border p-2 font-mono text-xs break-all ${isDarkMode ? 'bg-surface-background border-border-subtle text-content-primary' : 'bg-white border-gray-200 text-gray-900'}`}>
                              {verificationDocument.hardwareMeasurement.ID}
                            </div>
                          </div>
                        )}
                        {verificationDocument.hardwareMeasurement.MRTD && (
                          <div>
                            <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>MRTD</div>
                            <div className={`rounded border p-2 font-mono text-xs break-all ${isDarkMode ? 'bg-surface-background border-border-subtle text-content-primary' : 'bg-white border-gray-200 text-gray-900'}`}>
                              {verificationDocument.hardwareMeasurement.MRTD}
                            </div>
                          </div>
                        )}
                        {verificationDocument.hardwareMeasurement.RTMR0 && (
                          <div>
                            <div className="text-xs opacity-60 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>RTMR0</div>
                            <div className={`rounded border p-2 font-mono text-xs break-all ${isDarkMode ? 'bg-surface-background border-border-subtle text-content-primary' : 'bg-white border-gray-200 text-gray-900'}`}>
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

      case 'other':
        return (
          <div className="space-y-4">
            <div>
              <h3
                className={`mb-2 text-lg font-semibold ${
                  isDarkMode ? 'text-content-primary' : 'text-gray-900'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                Error Details
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-content-secondary' : 'text-gray-600'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              >
                {errorMessage || 'An unexpected error occurred during verification.'}
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const gridLineColor = isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
  const lineColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'

  return (
    <div className="relative w-full flex-1 overflow-y-auto bg-surface-background">
      {/* Dense Grid Background Pattern - z-0 */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: '4px 4px',
        }}
      />


      {/* Main content - z-10, above circuit lines */}
      <div className="relative z-10 space-y-3 px-3 pb-6 pt-3 sm:space-y-4 sm:px-4 sm:pt-4">
        {/* Status Banner */}
        <motion.div
          className={`flex min-h-16 flex-col gap-3 rounded-xl border p-4 ${
            status === 'error'
              ? isDarkMode
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : 'border-red-300 bg-red-50 text-red-600'
              : status === 'verifying'
                ? isDarkMode
                  ? 'border-border-subtle bg-gray-800/50 text-white'
                  : 'border-border-subtle bg-gray-100 text-gray-700'
                : isDarkMode
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-600'
          }`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                status === 'error'
                  ? isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
                  : status === 'verifying'
                    ? isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'
                    : isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
              }`}
            >
              {status === 'error' ? (
                <LuShieldAlert className="h-5 w-5" />
              ) : status === 'verifying' ? (
                <PiSpinner className="h-5 w-5 animate-spin" />
              ) : (
                <img src="/icons/shield-check.svg" alt="Shield Check" className="h-5 w-5" />
              )}
            </div>
            <p
              className="text-sm"
              style={{ fontFamily: FONT_FAMILIES.AEONIK }}
            >
              {status === 'error'
                ? 'An error occurred during initialization.'
                : status === 'verifying'
                  ? 'Verifying secure enclave...'
                  : `When using this chat, you have the guarantee that no-one can see your data, not even ${provider}.`}
            </p>
          </div>
        </motion.div>

        {/* Three Step Cards */}
        <motion.div
          className="relative flex items-center justify-center py-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Horizontal line through cards center */}
          <div
            className="absolute left-6 right-6 pointer-events-none"
            style={{ top: '50%', height: '1px', background: lineColor }}
          />

          {/* Vertical lines from each card up to status banner - dynamically positioned */}
          {visibleTabs.map((_, index) => {
            const cardWidth = visibleTabs.length > 3 ? 70 : 80
            const totalCards = visibleTabs.length
            const padding = 24 // px-6 = 24px
            // For justify-between with padding: calculate position within the padded area
            const position = totalCards === 1
              ? '50%'
              : `calc(${padding}px + ${(index / (totalCards - 1)) * 100}% - ${(index / (totalCards - 1)) * padding * 2}px + ${cardWidth / 2 - (index / (totalCards - 1)) * cardWidth}px)`

            return (
              <div
                key={`line-${index}`}
                className="absolute pointer-events-none"
                style={{
                  left: position,
                  top: '-16px',
                  width: '1px',
                  height: 'calc(50% + 16px)',
                  background: lineColor,
                  transform: 'translateX(-50%)'
                }}
              />
            )
          })}

          {/* Vertical line from selected card down to expanded content */}
          {selectedTab && (() => {
            const selectedIndex = visibleTabs.findIndex(t => t.id === selectedTab)
            if (selectedIndex === -1) return null
            const cardWidth = visibleTabs.length > 3 ? 70 : 80
            const totalCards = visibleTabs.length
            const padding = 24
            const position = totalCards === 1
              ? '50%'
              : `calc(${padding}px + ${(selectedIndex / (totalCards - 1)) * 100}% - ${(selectedIndex / (totalCards - 1)) * padding * 2}px + ${cardWidth / 2 - (selectedIndex / (totalCards - 1)) * cardWidth}px)`

            return (
              <motion.div
                key="connector-down"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none z-0"
                style={{
                  left: position,
                  top: '50%',
                  width: '1px',
                  height: 'calc(50% + 20px)',
                  background: lineColor,
                  transform: 'translateX(-50%)'
                }}
              />
            )
          })()}

          {/* Cards */}
          <div className="relative z-10 flex w-full items-center justify-between px-6">
            {visibleTabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setSelectedTab(selectedTab === tab.id ? null : tab.id)}
                className={`group relative z-10 flex flex-col items-center justify-center rounded-xl border transition-all duration-150 ${
                  selectedTab === tab.id
                    ? getStepStatus(tab.id) === 'error'
                      ? isDarkMode
                        ? 'border-red-500/50 bg-surface-card'
                        : 'border-red-300 bg-red-50'
                      : isDarkMode
                        ? 'border-emerald-500/50 bg-surface-card'
                        : 'border-emerald-300 bg-emerald-50'
                    : isDarkMode
                      ? 'border-border-subtle bg-surface-card hover:border-border-subtle hover:bg-surface-card/80'
                      : 'border-border-subtle bg-surface-card hover:bg-gray-50'
                }`}
                style={{ width: visibleTabs.length > 3 ? '70px' : '80px', height: visibleTabs.length > 3 ? '70px' : '80px' }}
                initial={tab.id === 'other' ? { opacity: 0, x: 20 } : { opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.15,
                  delay: tab.id === 'other' ? 0 : 0.08 + (index * 0.03),
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                {/* Status Badge */}
                <div
                  className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full ${
                    getStepStatus(tab.id) === 'error'
                      ? isDarkMode
                        ? 'bg-red-500/40 text-red-400'
                        : 'bg-red-100 text-red-600'
                      : getStepStatus(tab.id) === 'pending'
                        ? isDarkMode
                          ? 'bg-gray-700/50 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                        : isDarkMode
                          ? 'bg-emerald-500/40 text-emerald-400'
                          : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {getStepStatus(tab.id) === 'error' ? (
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : getStepStatus(tab.id) === 'pending' ? (
                    <PiSpinner className="h-3 w-3 animate-spin" />
                  ) : (
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <div
                  className="flex flex-col items-center mb-1"
                  style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '10px' }}
                >
                  <span className={isDarkMode ? 'text-content-muted' : 'text-gray-400'}>
                    {tab.prefix}
                  </span>
                  <span
                    className={`${
                      selectedTab === tab.id
                        ? getStepStatus(tab.id) === 'error'
                          ? isDarkMode ? 'text-red-400' : 'text-red-600'
                          : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                        : isDarkMode ? 'text-content-secondary' : 'text-gray-500'
                    } transition-colors`}
                  >
                    {tab.label}
                  </span>
                </div>

                <div className={`${
                  selectedTab === tab.id
                    ? getStepStatus(tab.id) === 'error'
                      ? isDarkMode ? 'text-red-400' : 'text-red-600'
                      : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    : isDarkMode ? 'text-content-secondary' : 'text-gray-400'
                } transition-colors`}>
                  {tab.icon}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Expanded Content */}
        <AnimatePresence mode="wait">
          {selectedTab && (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
              }}
              className="overflow-hidden"
            >
              <div
                className={`rounded-xl border p-4 ${
                  isDarkMode
                    ? 'border-border-subtle bg-surface-card'
                    : 'border-border-subtle bg-surface-card'
                }`}
              >
                {renderTabContent(selectedTab)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
