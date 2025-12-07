import { LuCheck } from 'react-icons/lu'
import type { MeasurementData } from '../utils/measurement'
import type { AttestationMeasurement } from '../types/verification'
import { AnimatePresence, motion } from 'framer-motion'

type FingerprintDisplayProps = {
  title: string
  subtitle: string
  fingerprint?: string
  isLoading: boolean
  isVerified: boolean
  isDarkMode: boolean
  animationKey: string
}

function FingerprintDisplay({
  title,
  subtitle,
  fingerprint,
  isLoading,
  isVerified,
  isDarkMode,
  animationKey,
}: FingerprintDisplayProps) {
  const baseBoxClasses = `overflow-x-auto rounded-lg border p-3 transition-colors ${
    isDarkMode
      ? 'border-border-subtle bg-surface-chat text-content-primary'
      : 'border-border-subtle bg-surface-card text-content-primary'
  }`

  return (
    <div>
      <div className="mb-2">
        <h4 className="text-sm font-medium text-content-primary">
          {title}
          <span className="block text-xs font-normal text-content-secondary">
            {subtitle}
          </span>
        </h4>
      </div>
      <div>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key={`loading-${animationKey}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="space-y-2"
            >
              <div className={baseBoxClasses}>
                <div
                  className={`h-5 w-full animate-pulse rounded ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'
                  }`}
                />
              </div>
            </motion.div>
          ) : fingerprint ? (
            <motion.div
              key={`content-${animationKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-2"
            >
              <div
                className={`${baseBoxClasses} ${isVerified ? 'border-emerald-500/50' : 'border-red-400/50'}`}
              >
                <div className="whitespace-nowrap font-mono text-sm">
                  {fingerprint}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

type MeasurementDiffProps = {
  sourceMeasurements: MeasurementData | string | AttestationMeasurement
  runtimeMeasurements: MeasurementData | string | AttestationMeasurement
  isVerified: boolean
  isDarkMode?: boolean
  showStatusBanner?: boolean
  sourceFingerprint?: string
  runtimeFingerprint?: string
  isLoading?: boolean
}

export function MeasurementDiff({
  isVerified,
  isDarkMode = true,
  showStatusBanner = true,
  sourceFingerprint,
  runtimeFingerprint,
  isLoading = false,
}: MeasurementDiffProps) {
  return (
    <div>
      {showStatusBanner && isVerified && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg p-3 transition-colors ${
            isDarkMode
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          <LuCheck className="h-5 w-5" />
          <span className="text-sm">
            Measurement verification passed
          </span>
        </div>
      )}

      <div className="space-y-4">
        <FingerprintDisplay
          title="Runtime Fingerprint"
          subtitle="Received from the enclave."
          fingerprint={runtimeFingerprint}
          isLoading={isLoading}
          isVerified={isVerified}
          isDarkMode={isDarkMode}
          animationKey="runtime"
        />

        <FingerprintDisplay
          title="Source Fingerprint"
          subtitle="Received from GitHub and Sigstore."
          fingerprint={sourceFingerprint}
          isLoading={isLoading}
          isVerified={isVerified}
          isDarkMode={isDarkMode}
          animationKey="source"
        />
      </div>
    </div>
  )
}
