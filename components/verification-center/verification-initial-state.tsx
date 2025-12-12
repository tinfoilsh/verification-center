import { useState, useEffect } from 'react'
import { SpinnerIcon } from '@/components/icons/spinner'
import { motion, AnimatePresence } from 'framer-motion'
import { FONT_FAMILIES } from '@/lib/constants/verification'
import { TINFOIL_ACCENT_LIGHT, TINFOIL_ACCENT_LIGHT_DARKER } from '@/lib/constants/colors'
import type { VerificationDocument } from '@/lib/types/verification'
import { TextureGrid } from './texture-grid'
import { ShieldXIcon, ShieldCheckIcon, LockIcon, TerminalIcon, CpuCheckIcon, WarningIcon } from '@/components/icons'
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
}

type TabType = 'key' | 'code' | 'chip' | 'measurement' | 'other' | null

export function VerificationInitialState({
  isDarkMode = true,
  verificationDocument,
  status = 'success',
  errorMessage,
  stepStatuses,
  showHeader = true
}: VerificationInitialStateProps) {
  const getFirstErrorTab = (): TabType => {
    if (!stepStatuses) return null
    if (stepStatuses.encryption === 'error') return 'key'
    if (stepStatuses.code === 'error') return 'code'
    if (stepStatuses.hardware === 'error') return 'chip'
    if (stepStatuses.measurement === 'error') return 'measurement'
    if (stepStatuses.other === 'error') return 'other'
    return null
  }

  const [selectedTab, setSelectedTab] = useState<TabType>(getFirstErrorTab())

  useEffect(() => {
    const errorTab = getFirstErrorTab()
    setSelectedTab(errorTab)
  }, [stepStatuses?.encryption, stepStatuses?.code, stepStatuses?.hardware, stepStatuses?.measurement, stepStatuses?.other])

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
      id: 'key' as const,
      prefix: 'Data is',
      label: 'Encrypted',
      icon: <LockIcon size={16} />
    },
    {
      id: 'code' as const,
      prefix: 'Code is',
      label: 'Auditable',
      icon: <TerminalIcon size={16} />
    },
    {
      id: 'chip' as const,
      prefix: 'Runtime is',
      label: 'Isolated',
      icon: <CpuCheckIcon size={18} />
    },
    {
      id: 'measurement' as const,
      prefix: 'Fingerprint',
      label: 'Mismatch',
      icon: <ShieldXIcon size={16} />,
      showOnlyOnError: true
    },
    {
      id: 'other' as const,
      prefix: 'Unexpected',
      label: 'Error',
      icon: <WarningIcon size={16} />,
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
        return <KeyTab isDarkMode={isDarkMode} verificationDocument={verificationDocument} stepStatus={stepStatus} errorMessage={errorMessage} />
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

  const lineColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'

  return (
    <div className="relative flex h-full w-full flex-col bg-surface-background">
      {showHeader && <VerifierHeader isDarkMode={isDarkMode} status={status} />}

      <div className="relative w-full flex-1 overflow-y-auto">
        <TextureGrid className="z-0" />


        {/* Main content - z-10, above circuit lines */}
        <div className="relative z-10 space-y-3 px-3 pb-6 pt-3 sm:space-y-4 sm:px-4 sm:pt-4">
        {/* Status Banner */}
        <motion.div
          className={`flex min-h-[88px] flex-col justify-center gap-3 rounded-xl border p-4 ${
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
              borderColor: 'rgba(104, 199, 172, 0.3)',
              backgroundColor: isDarkMode ? 'hsl(240, 3.4%, 11.4%)' : 'hsl(0, 0%, 100%)',
              color: isDarkMode ? TINFOIL_ACCENT_LIGHT : TINFOIL_ACCENT_LIGHT_DARKER
            } : status === 'error' ? {
              borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              backgroundColor: isDarkMode ? 'hsl(240, 3.4%, 11.4%)' : 'hsl(0, 0%, 100%)',
            } : {}
          }
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                status === 'error'
                  ? ''
                  : status === 'verifying'
                    ? isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'
                    : ''
              }`}
              style={
                status === 'success' ? {
                  backgroundColor: 'rgba(104, 199, 172, 0.2)'
                } : status === 'error' ? {
                  backgroundColor: 'rgba(239, 68, 68, 0.2)'
                } : {}
              }
            >
              {status === 'error' ? (
                <ShieldXIcon size={20} />
              ) : status === 'verifying' ? (
                <SpinnerIcon size={20} className="animate-spin" />
              ) : (
                <ShieldCheckIcon size={20} />
              )}
            </div>
            <p
              style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
            >
              {status === 'error'
                ? 'An error occurred during initialization.'
                : status === 'verifying'
                  ? 'Verifying secure enclave...'
                  : 'When using this chat, you have the guarantee that no-one can see your data.'}
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
            className="absolute pointer-events-none -z-10"
            style={{
              left: visibleTabs.length > 3 ? '35px' : '40px',
              right: visibleTabs.length > 3 ? '35px' : '40px',
              top: '50%',
              height: '2px',
              background: lineColor
            }}
          />

          {/* Vertical lines from each card up to status banner - dynamically positioned */}
          {visibleTabs.map((_, index) => {
            const cardWidth = visibleTabs.length > 3 ? 70 : 80
            const totalCards = visibleTabs.length
            const padding = visibleTabs.length > 3 ? 0 : 0
            // For justify-between with padding: calculate position within the padded area
            const position = totalCards === 1
              ? '50%'
              : `calc(${padding}px + ${(index / (totalCards - 1)) * 100}% - ${(index / (totalCards - 1)) * padding * 2}px + ${cardWidth / 2 - (index / (totalCards - 1)) * cardWidth}px)`

            return (
              <div
                key={`line-${index}`}
                className="absolute pointer-events-none -z-10"
                style={{
                  left: position,
                  top: '-16px',
                  width: '2px',
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
            const padding = visibleTabs.length > 3 ? 0 : 0
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
                className="absolute pointer-events-none -z-10"
                style={{
                  left: position,
                  top: '50%',
                  width: '2px',
                  height: 'calc(50% + 20px)',
                  background: lineColor,
                  transform: 'translateX(-50%)'
                }}
              />
            )
          })()}

          {/* Cards */}
          <div className="relative z-10 flex w-full items-center justify-between">
            {visibleTabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setSelectedTab(selectedTab === tab.id ? null : tab.id)}
                className={`group relative z-10 flex flex-col items-center justify-center rounded-xl border transition-all duration-150 ${
                  selectedTab === tab.id
                    ? getStepStatus(tab.id) === 'error'
                      ? isDarkMode
                        ? 'border-red-500 bg-surface-card'
                        : 'border-red-300 bg-red-50'
                      : isDarkMode
                        ? 'border-[#68C7AC] bg-surface-card'
                        : 'border-[#5AB39A] bg-white'
                    : isDarkMode
                      ? 'border-border-subtle bg-surface-card hover:border-border-subtle hover:bg-surface-card/80'
                      : 'border-border-subtle bg-surface-card hover:bg-gray-50'
                }`}
                style={{
                  width: visibleTabs.length > 3 ? '70px' : '80px',
                  height: visibleTabs.length > 3 ? '70px' : '80px',
                  ...(selectedTab === tab.id && getStepStatus(tab.id) !== 'error' ? {
                    backgroundColor: isDarkMode ? 'hsl(240, 3.4%, 11.4%)' : 'hsl(0, 0%, 100%)'
                  } : {})
                }}
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
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-600'
                      : getStepStatus(tab.id) === 'pending'
                        ? isDarkMode
                          ? 'bg-gray-700/50 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                        : 'text-white'
                  }`}
                  style={getStepStatus(tab.id) === 'success' ? {
                    backgroundColor: TINFOIL_ACCENT_LIGHT
                  } : {}}
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
                    <SpinnerIcon size={12} className="animate-spin" />
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
                  style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}
                >
                  <span className={isDarkMode ? 'text-content-muted' : 'text-gray-400'}>
                    {tab.prefix}
                  </span>
                  <span
                    className={`${
                      selectedTab === tab.id
                        ? getStepStatus(tab.id) === 'error'
                          ? isDarkMode ? 'text-red-400' : 'text-red-600'
                          : isDarkMode ? 'text-[#68C7AC]' : 'text-[#5AB39A]'
                        : isDarkMode ? 'text-content-secondary' : 'text-gray-500'
                    } transition-colors`}
                  >
                    {tab.label}
                  </span>
                </div>

                <div className={`flex items-center justify-center ${
                  selectedTab === tab.id
                    ? getStepStatus(tab.id) === 'error'
                      ? isDarkMode ? 'text-red-400' : 'text-red-600'
                      : isDarkMode ? 'text-[#68C7AC]' : 'text-[#5AB39A]'
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
              className="relative z-10 overflow-hidden"
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
    </div>
  )
}
