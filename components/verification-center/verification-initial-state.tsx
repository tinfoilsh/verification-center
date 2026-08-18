import { useState } from 'react'
import { PiCaretDown, PiSpinner } from 'react-icons/pi'
import { TfShieldX as ShieldXIcon, TfLock as LockIcon, TfTerminal as TerminalIcon, TfCpuCheck as CpuCheckIcon, TfWarning as WarningIcon, TfBoxCheckmark as CheckmarkIcon, TfBoxX as XIcon } from '@tinfoilsh/tinfoil-icons'
import { motion, AnimatePresence } from 'framer-motion'
import { FONT_FAMILIES } from '@/lib/constants/verification'
import { TINFOIL_ACCENT_LIGHT, TINFOIL_ACCENT_DARK } from '@/lib/constants/colors'
import type { VerificationDocument } from '@/lib/types/verification'
import { TextureGrid } from './texture-grid'
import { VerifierHeader } from './verifier-header'
import { KeyTab, CodeTab, ChipTab, MeasurementTab, OtherTab, type StepStatus } from './tabs'

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error'

type VerificationInitialStateProps = {
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
  status?: VerificationStatus
  errorMessage?: string
  stepStatuses?: {
    encryption: StepStatus
    code: StepStatus
    hardware: StepStatus
    measurement?: StepStatus
    other?: StepStatus
  }
  showHeader?: boolean
  type?: 'chat' | 'default'
}

type TabType = 'key' | 'code' | 'chip' | 'measurement' | 'other' | null
type TabId = NonNullable<TabType>

export function VerificationInitialState({
  isDarkMode = true,
  verificationDocument,
  status = 'success',
  errorMessage,
  stepStatuses,
  showHeader = true,
  type = 'default'
}: VerificationInitialStateProps) {
  const [selectedTabs, setSelectedTabs] = useState<TabId[]>([])

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
      case 'measurement':
        return stepStatuses.measurement || 'success'
      case 'other':
        return stepStatuses.other || 'success'
      default:
        return 'success'
    }
  }

  const tabs = [
    {
      id: 'chip' as const,
      prefix: 'Runtime is',
      label: 'Isolated',
      failureLabel: 'Not Isolated',
      icon: <CpuCheckIcon className="w-[18px] h-[18px]" />
    },
    {
      id: 'key' as const,
      prefix: type === 'chat' ? 'Chat is' : 'Data is',
      label: 'Encrypted',
      failureLabel: 'Not Encrypted',
      icon: <LockIcon className="w-4 h-4" />
    },
    {
      id: 'code' as const,
      prefix: 'Code is',
      label: 'Auditable',
      failureLabel: 'Not Auditable',
      icon: <TerminalIcon className="w-4 h-4" />
    },
    {
      id: 'measurement' as const,
      prefix: 'Fingerprint',
      label: 'Mismatch',
      failureLabel: 'Mismatch',
      icon: <ShieldXIcon className="w-4 h-4" />,
      showOnlyOnError: true
    },
    {
      id: 'other' as const,
      prefix: 'Unexpected',
      label: 'Error',
      failureLabel: 'Error',
      icon: <WarningIcon className="w-4 h-4" />,
      showOnlyOnError: true
    }
  ]

  const hasMeasurementError = stepStatuses?.measurement === 'error'
  const hasOtherError = stepStatuses?.other === 'error'
  const visibleTabs = tabs.filter(tab => !tab.showOnlyOnError || (tab.id === 'measurement' && hasMeasurementError) || (tab.id === 'other' && hasOtherError))

  const renderTabContent = (tabId: TabType) => {
    if (!tabId) return null

    const stepStatus = getStepStatus(tabId)

    switch (tabId) {
      case 'key':
        return <KeyTab isDarkMode={isDarkMode} verificationDocument={verificationDocument} stepStatus={stepStatus} errorMessage={errorMessage} type={type} />
      case 'code':
        return <CodeTab isDarkMode={isDarkMode} verificationDocument={verificationDocument} stepStatus={stepStatus} errorMessage={errorMessage} />
      case 'chip':
        return <ChipTab isDarkMode={isDarkMode} verificationDocument={verificationDocument} stepStatus={stepStatus} errorMessage={errorMessage} />
      case 'measurement':
        return <MeasurementTab isDarkMode={isDarkMode} verificationDocument={verificationDocument} stepStatus={stepStatus} errorMessage={errorMessage} />
      case 'other':
        return <OtherTab isDarkMode={isDarkMode} errorMessage={errorMessage} />
      default:
        return null
    }
  }

  const typeString = verificationDocument?.enclaveMeasurement?.measurement?.type?.toLowerCase() || ''
  const isSEV = /sev/.test(typeString)
  const isTDX = /tdx/.test(typeString)

  const isVerifying = status === 'verifying'
  const activeTabs = isVerifying ? [] : selectedTabs

  return (
    <div className="relative flex h-full w-full flex-col bg-surface-background">
      {showHeader && <VerifierHeader isDarkMode={isDarkMode} status={status} />}

      <div className="relative w-full flex-1 overflow-y-auto">
        <TextureGrid className="z-0" />


        {/* Main content - z-10, above circuit lines */}
        <div className="relative z-10 space-y-3 px-3 pb-6 pt-6 sm:space-y-4 sm:px-4 sm:pt-7">
        {/* Status Banner */}
        <div
          className={`flex flex-col justify-center gap-3 rounded-site-lg border p-4 ${
            status === 'error'
              ? isDarkMode
                ? 'text-red-400'
                : 'text-red-600'
              : status === 'verifying'
                ? isDarkMode
                  ? 'border-border-subtle bg-gray-800/50 text-white'
                  : 'border-border-subtle bg-gray-100 text-gray-700'
                : ''
          }`}
          style={
            status === 'success' ? {
              borderColor: isDarkMode ? 'rgba(104, 199, 172, 0.3)' : 'rgba(0, 68, 68, 0.3)',
              backgroundColor: isDarkMode ? 'hsl(240, 3.4%, 11.4%)' : 'hsl(0, 0%, 100%)',
              color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_DARK
            } : status === 'error' ? {
              borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              backgroundColor: isDarkMode ? 'hsl(240, 3.4%, 11.4%)' : 'hsl(0, 0%, 100%)',
            } : {}
          }
        >
          <div className="flex flex-col gap-2">
            <p
              style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
            >
              {status === 'error'
                ? 'An error occurred during initialization.'
                : status === 'verifying'
                  ? 'Verifying secure enclave...'
                  : type === 'chat'
                    ? 'Your conversations are encrypted end-to-end to an AI model running inside a secure hardware enclave.'
                    : 'Your data is encrypted end-to-end to a server running inside a secure hardware enclave.'}
            </p>
            {status === 'success' && (
              <div
                className="flex items-center gap-2 flex-wrap"
                style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
              >
                <span className="font-medium">Hardware attested by:</span>
                {isSEV && (
                  <span
                    className="inline-block h-3 w-12"
                    aria-label="AMD"
                    style={{
                      backgroundColor: 'currentColor',
                      maskImage: 'url(/icons/amd.svg)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: 'url(/icons/amd.svg)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                )}
                {isTDX && (
                  <span
                    className="inline-block h-3.5 w-8"
                    aria-label="Intel"
                    style={{
                      backgroundColor: 'currentColor',
                      maskImage: 'url(/icons/intel.svg)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: 'url(/icons/intel.svg)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                )}
                <span
                  className="inline-block h-4 w-16"
                  aria-label="NVIDIA"
                  style={{
                    backgroundColor: 'currentColor',
                    maskImage: 'url(/icons/nvidia.svg)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url(/icons/nvidia.svg)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Verification Steps */}
        <div
          className="overflow-hidden rounded-site-lg border border-border-subtle bg-surface-card"
        >
          {visibleTabs.map((tab, index) => {
            const stepStatus = getStepStatus(tab.id)
            const isActive = activeTabs.includes(tab.id)
            const successColor = isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_DARK

            return (
              <div
                key={tab.id}
                className={index === 0 ? '' : 'border-t border-border-subtle'}
              >
                <button
                  type="button"
                  onClick={() => !isVerifying && setSelectedTabs(currentTabs =>
                    currentTabs.includes(tab.id)
                      ? currentTabs.filter(tabId => tabId !== tab.id)
                      : [...currentTabs, tab.id]
                  )}
                  disabled={isVerifying}
                  aria-expanded={isActive}
                  aria-controls={`verification-step-${tab.id}`}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                    isVerifying ? 'cursor-default' : isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-site-control ${
                    stepStatus === 'error'
                      ? isDarkMode ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'
                      : stepStatus === 'success'
                        ? isDarkMode ? 'bg-white/[0.04]' : 'bg-gray-100'
                        : isDarkMode ? 'bg-white/[0.04] text-content-secondary' : 'bg-gray-100 text-gray-500'
                  }`} style={stepStatus === 'success' ? { color: successColor } : {}}>
                    {tab.icon}
                  </span>

                  <span
                    className={`min-w-0 flex-1 ${
                      stepStatus === 'error'
                        ? isDarkMode ? 'text-red-400' : 'text-red-600'
                        : stepStatus === 'success'
                          ? ''
                          : isDarkMode ? 'text-content-primary' : 'text-gray-900'
                    }`}
                    style={{
                      fontFamily: FONT_FAMILIES.AEONIK_FONO,
                      fontSize: '14px',
                      ...(stepStatus === 'success' ? { color: successColor } : {})
                    }}
                  >
                    <span className={stepStatus === 'success' ? '' : isDarkMode ? 'text-content-muted' : 'text-gray-500'}>{tab.prefix}</span>{' '}
                    <span className="font-medium">{stepStatus === 'error' ? tab.failureLabel : tab.label}</span>
                  </span>

                  <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center ${
                     stepStatus === 'error'
                       ? isDarkMode ? 'text-red-400' : 'text-red-600'
                       : stepStatus === 'pending'
                         ? isDarkMode ? 'rounded-full bg-gray-700/50 text-gray-400' : 'rounded-full bg-gray-200 text-gray-500'
                         : ''
                   }`} style={stepStatus === 'success' ? {
                     color: successColor
                   } : {}}>
                    {stepStatus === 'error' ? (
                      <XIcon className="h-5 w-5" />
                    ) : stepStatus === 'pending' ? (
                      <PiSpinner className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckmarkIcon className="h-5 w-5" />
                    )}
                  </span>

                  <PiCaretDown
                    className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive ? 'rotate-180' : ''
                    } ${stepStatus === 'success' ? '' : isDarkMode ? 'text-content-muted' : 'text-gray-400'}`}
                    style={stepStatus === 'success' ? { color: successColor } : {}}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      id={`verification-step-${tab.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border-subtle p-4">
                        {renderTabContent(tab.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </div>
  )
}
