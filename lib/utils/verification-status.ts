import type { VerificationDocument } from '../types/verification'

export type VerificationStatus = {
  allSuccess: boolean
  hasError: boolean
  summaryStatus: 'progress' | 'error' | 'success'
  summaryMessage: string
  firstErrorMessage?: string
}

export function getVerificationStatus(
  doc: VerificationDocument | undefined,
  isLoading: boolean
): VerificationStatus {
  if (!doc || isLoading) {
    return {
      allSuccess: false,
      hasError: false,
      summaryStatus: 'progress',
      summaryMessage: 'Security verification in progress...',
      firstErrorMessage: undefined,
    }
  }

  const steps = doc.steps

  const allSuccess =
    steps.fetchDigest.status === 'success' &&
    steps.verifyCode.status === 'success' &&
    steps.verifyEnclave.status === 'success' &&
    steps.compareMeasurements.status === 'success' &&
    (!steps.createTransport || steps.createTransport.status === 'success') &&
    (!steps.verifyHPKEKey || steps.verifyHPKEKey.status === 'success') &&
    (!steps.otherError || steps.otherError.status !== 'failed')

  const hasError =
    steps.fetchDigest.status === 'failed' ||
    steps.verifyCode.status === 'failed' ||
    steps.verifyEnclave.status === 'failed' ||
    steps.compareMeasurements.status === 'failed' ||
    steps.createTransport?.status === 'failed' ||
    steps.verifyHPKEKey?.status === 'failed' ||
    steps.otherError?.status === 'failed'

  const summaryStatus = hasError ? 'error' : allSuccess ? 'success' : 'progress'

  const summaryMessage = hasError
    ? 'Enclave security verification failed'
    : allSuccess
      ? 'Security verified: The AI model is running in a secure hardware enclave. The source code is open-source and available on GitHub.'
      : 'Security verification in progress'

  const firstErrorMessage = hasError
    ? steps.fetchDigest.error ||
      steps.verifyCode.error ||
      steps.verifyEnclave.error ||
      steps.compareMeasurements.error ||
      steps.createTransport?.error ||
      steps.verifyHPKEKey?.error ||
      steps.otherError?.error ||
      'Verification failed'
    : undefined

  return {
    allSuccess,
    hasError,
    summaryStatus,
    summaryMessage,
    firstErrorMessage,
  }
}

export type BadgeStatus = {
  state: 'idle' | 'loading' | 'success' | 'error'
  label: string
}

export function getBadgeStatus(
  doc: VerificationDocument | undefined,
  fallbackState: 'idle' | 'loading' | 'success' | 'error' = 'idle'
): BadgeStatus {
  if (!doc) {
    if (fallbackState === 'success') return { state: 'success', label: 'Security verified' }
    if (fallbackState === 'loading') return { state: 'loading', label: 'Verifying security...' }
    if (fallbackState === 'error') return { state: 'error', label: 'Verification failed' }
    return { state: 'loading', label: 'Verifying security...' }
  }

  const { allSuccess, hasError } = getVerificationStatus(doc, false)

  if (allSuccess) {
    return { state: 'success', label: 'Security verified' }
  }
  if (hasError) {
    return { state: 'error', label: 'Verification failed' }
  }
  return { state: 'loading', label: 'Verifying security...' }
}
