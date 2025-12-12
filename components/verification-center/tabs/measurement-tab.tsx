import { FONT_FAMILIES } from '@/lib/constants/verification'
import type { VerificationDocument } from '@/lib/types/verification'
import type { StepStatus } from './types'
import { IoMdFingerPrint } from 'react-icons/io'

type MeasurementTabProps = {
  isDarkMode?: boolean
  verificationDocument?: VerificationDocument
  stepStatus: StepStatus
  errorMessage?: string
}

export function MeasurementTab({
  isDarkMode = true,
  verificationDocument,
  stepStatus,
  errorMessage,
}: MeasurementTabProps) {
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
            Fingerprint Mismatch
          </h3>
          <p
            className={isDarkMode ? 'text-red-400' : 'text-red-600'}
            style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '14px' }}
          >
            {errorMessage || 'Runtime and source measurements do not match.'}
          </p>
        </div>

        <div className="space-y-3">
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
              Mismatch <span>✗</span>
            </div>
            <IoMdFingerPrint
              className={`h-5 w-5 flex-shrink-0 ${
                isDarkMode ? 'text-content-secondary' : 'text-gray-400'
              }`}
            />
            <div className="flex-1 overflow-hidden pr-20">
              <div className="font-medium opacity-70 mb-1" style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}>
                Source code fingerprint
              </div>
              <div
                className={`font-mono truncate ${
                  isDarkMode ? 'text-content-primary' : 'text-gray-900'
                }`}
                style={{ fontSize: '12px' }}
              >
                {verificationDocument?.codeFingerprint || 'No fingerprint available'}
              </div>
            </div>
          </div>

          <div
            className={`relative flex items-center gap-3 rounded-xl border p-3 ${
              isDarkMode
                ? 'border-red-500/30 bg-red-500/10'
                : 'border-red-300 bg-red-50'
            }`}
          >
            <div
              className={`absolute top-2 right-2 flex items-center gap-1 font-medium ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}
              style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}
            >
              Mismatch <span>✗</span>
            </div>
            <IoMdFingerPrint
              className={`h-5 w-5 flex-shrink-0 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}
            />
            <div className="flex-1 overflow-hidden pr-20">
              <div
                className={`font-medium opacity-70 mb-1 ${
                  isDarkMode ? 'text-red-300' : 'text-red-700'
                }`}
                style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}
              >
                Enclave code fingerprint
              </div>
              <div
                className={`font-mono truncate ${
                  isDarkMode ? 'text-red-300' : 'text-red-700'
                }`}
                style={{ fontSize: '12px' }}
              >
                {verificationDocument?.enclaveFingerprint || 'No fingerprint available'}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-3 ${
            isDarkMode
              ? 'border-border-subtle bg-surface-chat/50'
              : 'border-border-subtle bg-gray-50'
          }`}
        >
          <p
            className={isDarkMode ? 'text-content-secondary' : 'text-gray-600'}
            style={{ fontFamily: FONT_FAMILIES.AEONIK, fontSize: '12px' }}
          >
            The code running in the enclave does not match the auditable source code. This could indicate a security issue.
          </p>
        </div>
      </div>
    )
  }

  return null
}
