import { useEffect, useState } from 'react'
import type { VerificationDocument } from '@/lib/types/verification'
export type { VerificationDocument } from '@/lib/types/verification'
import { VerificationInitialState } from './verification-initial-state'
import { getVerificationStatus } from '@/lib/utils/verification-status'

export type VerificationCenterProps = {
  /** The verification document to display */
  verificationDocument?: VerificationDocument
  /** Dark mode toggle */
  isDarkMode?: boolean
  /** Whether the container should fill its parent height */
  fillContainer?: boolean
  /** Provider name for initial state message */
  provider?: string
}

const placeholderDocument: VerificationDocument = {
  configRepo: '',
  enclaveHost: '',
  releaseDigest: '',
  codeMeasurement: { type: '', registers: [] },
  enclaveMeasurement: { measurement: { type: '', registers: [] } },
  tlsPublicKey: '',
  hpkePublicKey: '',
  codeFingerprint: '',
  enclaveFingerprint: '',
  selectedRouterEndpoint: '',
  securityVerified: false,
  steps: {
    fetchDigest: { status: 'pending' },
    verifyCode: { status: 'pending' },
    verifyEnclave: { status: 'pending' },
    compareMeasurements: { status: 'pending' },
  },
}

export function VerificationCenter({
  verificationDocument,
  isDarkMode = true,
  fillContainer = true,
  provider = 'Tinfoil',
}: VerificationCenterProps) {
  const [isLoading, setIsLoading] = useState(!verificationDocument)
  const [currentDocument, setCurrentDocument] = useState(verificationDocument || placeholderDocument)

  useEffect(() => {
    if (verificationDocument) {
      setCurrentDocument(verificationDocument)
      setIsLoading(false)
    }
  }, [verificationDocument])

  const { allSuccess, hasError, firstErrorMessage } = getVerificationStatus(currentDocument, isLoading)

  const status = isLoading
    ? 'verifying'
    : hasError
      ? 'error'
      : allSuccess
        ? 'success'
        : 'verifying'

  const errorMsg = hasError ? firstErrorMessage : undefined

  const getStepStatusValue = (stepStatus: 'pending' | 'success' | 'failed' | undefined, defaultToSuccess = false): 'pending' | 'success' | 'error' => {
    if (isLoading) return 'pending'
    if (!stepStatus) return defaultToSuccess ? 'success' : 'pending'
    if (stepStatus === 'pending') return 'pending'
    return stepStatus === 'failed' ? 'error' : 'success'
  }

  const hasOtherError = currentDocument.steps.createTransport?.status === 'failed' ||
    currentDocument.steps.otherError?.status === 'failed'

  const stepStatuses = {
    encryption: getStepStatusValue(currentDocument.steps.verifyHPKEKey?.status, true),
    code: getStepStatusValue(currentDocument.steps.verifyCode.status),
    hardware: getStepStatusValue(currentDocument.steps.verifyEnclave.status),
    other: hasOtherError ? 'error' as const : undefined
  }

  return (
    <div
      className={`tinfoil-verification-theme flex ${
        fillContainer ? 'h-full' : ''
      } w-full flex-col bg-background text-foreground ${
        isDarkMode ? 'dark' : ''
      }`}
      data-theme={isDarkMode ? 'dark' : 'light'}
      style={{ fontFamily: 'inherit' }}
    >
      <VerificationInitialState
        isDarkMode={isDarkMode}
        provider={provider}
        verificationDocument={currentDocument}
        status={status}
        errorMessage={errorMsg}
        stepStatuses={stepStatuses}
      />
    </div>
  )
}

export const Verifier = VerificationCenter

export default VerificationCenter
