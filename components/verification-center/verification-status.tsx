import { LuShieldAlert } from 'react-icons/lu'
import { PiSpinner } from 'react-icons/pi'
import { AnimatePresence, motion } from 'framer-motion'
import type { VerificationSummaryStatus, VerificationDocument } from './types/verification'
import { FONT_FAMILIES } from './constants'

type VerificationStatusProps = {
  summary: {
    status: VerificationSummaryStatus
    message?: string
  }
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
}

/**
 * VerificationStatus
 * Single-container banner that smoothly transitions colors between states.
 */
function VerificationStatus({ summary, isDarkMode = true, verificationDocument }: VerificationStatusProps) {
  const status = summary.status
  const message = summary.message

  const typeString = verificationDocument?.enclaveMeasurement?.measurement?.type?.toLowerCase() || ''
  const isSEV = /sev/.test(typeString)
  const isTDX = /tdx/.test(typeString)

  const containerColors =
    status === 'error'
      ? isDarkMode
        ? 'bg-red-500/10 text-red-400'
        : 'bg-red-50 text-red-600'
      : status === 'success'
        ? isDarkMode
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-emerald-50 text-emerald-600'
        : isDarkMode
          ? 'bg-gray-800/50 text-white'
          : 'bg-gray-100 text-gray-700'

  const resolvedStatus: VerificationSummaryStatus = status
  const resolvedMessage =
    message ||
    (resolvedStatus === 'error'
      ? 'Verification failed. Please check the errors.'
      : resolvedStatus === 'success'
        ? 'This AI is running inside a secure enclave.'
        : 'Verification in progress. This process ensures your data remains secure and private by confirming code integrity and runtime environment isolation.')

  return (
    <motion.div
      className={`flex min-h-16 items-center gap-2 rounded-lg border p-4 shadow-sm ${containerColors} ${
        isDarkMode ? 'border-border-subtle' : 'border-border-subtle'
      }`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backgroundColor: containerColors.includes('emerald')
          ? isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgb(236, 253, 245)'
          : containerColors.includes('red')
          ? isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgb(254, 242, 242)'
          : isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgb(243, 244, 246)'
      }}
      transition={{
        opacity: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
        backgroundColor: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      <AnimatePresence mode="wait">
        {resolvedStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-2 w-full"
          >
            <LuShieldAlert className="h-5 w-5 flex-shrink-0" />
            <p className="overflow-hidden break-words break-all text-sm" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
              {resolvedMessage}
            </p>
          </motion.div>
        )}

        {resolvedStatus === 'success' && (
          <motion.div
            key="success"
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <style>{`
              @keyframes pulse-green {
                0% {
                  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                }
                100% {
                  box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
                }
              }
              .pulse-green {
                animation: pulse-green 3s ease-out infinite;
              }
              @keyframes checkmark {
                0% {
                  transform: scale(0) rotate(-45deg);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.2) rotate(5deg);
                }
                100% {
                  transform: scale(1) rotate(0deg);
                  opacity: 1;
                }
              }
              .checkmark-animate {
                animation: checkmark 0.5s ease-out forwards;
              }
            `}</style>
            <motion.p
              className="text-base font-semibold"
              style={{ fontFamily: FONT_FAMILIES.AEONIK }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.02 }}
            >
              Enclave security verified
            </motion.p>
            <ul className="text-sm space-y-1 ml-0 list-none" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.04 }}
              >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full pulse-green flex-shrink-0 checkmark-animate">✓</span>
                <span>The AI model is running in a secure enclave.</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.06 }}
              >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full pulse-green flex-shrink-0 checkmark-animate" style={{ animationDelay: '0.05s' }}>✓</span>
                <span>The code is open source on GitHub.</span>
              </motion.li>
            </ul>
            <motion.div
              className={`flex items-center gap-2 opacity-70 ${
                isDarkMode ? 'text-white' : 'text-gray-700'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.15, delay: 0.08 }}
            >
              <span className="text-xs">Attested by</span>
              <img
                src="/icons/nvidia.svg"
                alt="NVIDIA"
                width={40}
                height={15}
                className={`${!isDarkMode ? 'invert' : ''} pt-0.5`}
              />
              {isSEV && (
                <>
                  <span className="text-sm">·</span>
                  <img
                    src="/icons/amd.svg"
                    alt="AMD"
                    width={25}
                    height={15}
                    className={`${isDarkMode ? 'invert' : ''} pt-0.5`}
                  />
                </>
              )}
              {isTDX && (
                <>
                  <span className="text-sm">·</span>
                  <img
                    src="/icons/intel.svg"
                    alt="Intel"
                    width={20}
                    height={10}
                    className={`${isDarkMode ? 'invert' : ''}`}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {resolvedStatus === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-2 w-full relative overflow-hidden"
          >
            <style>{`
              @keyframes shimmer {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(100%);
                }
              }
              .shimmer-effect::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  transparent 0%,
                  ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'} 50%,
                  transparent 100%
                );
                animation: shimmer 2s infinite;
              }
            `}</style>
            <div className="flex items-center gap-2 w-full shimmer-effect">
              <PiSpinner className="h-5 w-5 flex-shrink-0 animate-spin relative z-10" />
              <p className="break-words text-sm relative z-10" style={{ fontFamily: FONT_FAMILIES.AEONIK }}>{resolvedMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VerificationStatus
