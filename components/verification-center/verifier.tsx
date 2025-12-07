import { useEffect, useState } from 'react'
import type { VerificationDocument } from './types/verification'
export type { VerificationDocument } from './types/verification'
import { MeasurementDiff, ProcessStep } from './steps'
import VerificationStatus from './verification-status'
import { VerifierFooter } from './verifier-footer'
import { VerificationInitialState } from './verification-initial-state'
import { getVerificationStatus } from './utils/verification-status'

export type VerificationCenterProps = {
  /** The verification document to display */
  verificationDocument?: VerificationDocument
  /** Optional callback to request a new verification document */
  onRequestVerificationDocument?: () => Promise<VerificationDocument | null | undefined>
  /** Dark mode toggle */
  isDarkMode?: boolean
  /** Whether the container should fill its parent height */
  fillContainer?: boolean
  /** Compact mode hides process step descriptions */
  compact?: boolean
  /** Show initial state before verification */
  showInitialState?: boolean
  /** Provider name for initial state message */
  provider?: string
}


function getStepTitle(step: 'runtime' | 'code' | 'security', status?: 'pending' | 'success' | 'failed'): string {
  const titles = {
    runtime: {
      pending: 'Runtime Verification',
      success: 'Runtime Verified',
      failed: 'Runtime Verification Failed',
    },
    code: {
      pending: 'Source Code Verification',
      success: 'Source Code Verified',
      failed: 'Source Code Verification Failed',
    },
    security: {
      pending: 'Fingerprint Verification',
      success: 'Fingerprints Verified',
      failed: 'Fingerprint Verification Failed',
    },
  }

  return titles[step][status || 'pending']
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
  onRequestVerificationDocument,
  isDarkMode = true,
  fillContainer = true,
  compact = true,
  showInitialState = false,
  provider = 'Tinfoil',
}: VerificationCenterProps) {
  const [isLoading, setIsLoading] = useState(!verificationDocument)
  const [isSafari, setIsSafari] = useState(false)
  const [currentDocument, setCurrentDocument] = useState(verificationDocument || placeholderDocument)

  const secondaryButtonClasses = isDarkMode
    ? 'border-border-subtle bg-transparent text-content-secondary hover:bg-surface-card/80'
    : 'border-border-subtle bg-surface-card text-content-secondary hover:bg-surface-card/80'

  useEffect(() => {
    if (verificationDocument) {
      setCurrentDocument(verificationDocument)
      setIsLoading(false)
    }
  }, [verificationDocument])


  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const isSafariMobile = ua.includes('safari') && ua.includes('mobile')
    const isIOS = /iphone|ipad|ipod/.test(ua)
    setIsSafari((isSafariMobile || isIOS) && !ua.includes('chrome'))
  }, [])


  const { allSuccess, hasError, summaryStatus, summaryMessage, firstErrorMessage } = getVerificationStatus(currentDocument, isLoading)

  // Determine which steps should be shown as pending due to earlier failures
  const hasEnclaveFailure = currentDocument.steps.verifyEnclave.status === 'failed'
  const hasCodeFailure = currentDocument.steps.verifyCode.status === 'failed'
  const hasIntegrityFailure = currentDocument.steps.compareMeasurements.status === 'failed'
  const hasHPKEFailure = currentDocument.steps.verifyHPKEKey?.status === 'failed'

  // Steps that come after failed steps should show as pending (not attempted)
  const shouldCodeBePending = hasEnclaveFailure
  const shouldIntegrityBePending = hasEnclaveFailure || hasCodeFailure
  const shouldHPKEBePending = hasEnclaveFailure || hasCodeFailure || hasIntegrityFailure
  const shouldConnectionBePending = hasEnclaveFailure || hasCodeFailure || hasIntegrityFailure || hasHPKEFailure

  // When loading, show pending status for all steps
  const getStepStatus = (stepStatus: 'pending' | 'success' | 'failed'): 'pending' | 'success' | 'error' | 'skipped' => {
    if (isLoading) return 'pending'
    return stepStatus === 'failed' ? 'error' : stepStatus as 'pending' | 'success'
  }

  if (showInitialState) {
    const initialStateStatus = isLoading
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
          status={initialStateStatus}
          errorMessage={errorMsg}
          stepStatuses={stepStatuses}
        />
      </div>
    )
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
      {/* Scrollable Content */}
      <div
        className="relative w-full flex-1 overflow-y-auto bg-surface-background"
        style={{
          scrollbarGutter: 'stable',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Verification Content */}
        <div className="space-y-3 px-3 pb-6 pt-3 sm:space-y-4 sm:px-4 sm:pt-4">
          {/* Verification Banner */}
          <VerificationStatus
            summary={{ status: summaryStatus, message: summaryMessage }}
            isDarkMode={isDarkMode}
            verificationDocument={currentDocument}
          />
          {/* Process Steps */}
          <ProcessStep
            title={isLoading ? getStepTitle('runtime', 'pending') : getStepTitle('runtime', currentDocument.steps.verifyEnclave.status)}
            description="This step verifies the secure hardware environment. The verifier receives a signed measurement from a combination of NVIDIA, AMD, and Intel certifying the enclave environment and the digest of the binary (i.e., code) actively running inside it."
            status={getStepStatus(currentDocument.steps.verifyEnclave.status)}
            error={isLoading ? undefined : currentDocument.steps.verifyEnclave.error}
            measurement={JSON.stringify(currentDocument.enclaveMeasurement.measurement)}
            digestType="RUNTIME"
            verificationDocument={currentDocument}
            isDarkMode={isDarkMode}
            compact={compact}
          />

          <ProcessStep
            title={shouldCodeBePending ? 'Enclave Source Code Verified' : isLoading ? getStepTitle('code', 'pending') : getStepTitle('code', currentDocument.steps.verifyCode.status)}
            description="This step verifies that the source code published publicly by Tinfoil on GitHub was correctly built through GitHub Actions and that the resulting binary is available on the Sigstore transparency log."
            status={shouldCodeBePending ? 'skipped' : getStepStatus(currentDocument.steps.verifyCode.status)}
            error={shouldCodeBePending ? undefined : isLoading ? undefined : currentDocument.steps.verifyCode.error}
            measurement={shouldCodeBePending ? undefined : JSON.stringify(currentDocument.codeMeasurement)}
            digestType="SOURCE"
            verificationDocument={currentDocument}
            githubHash={currentDocument.releaseDigest}
            isDarkMode={isDarkMode}
            compact={compact}
          />

          <ProcessStep
            title={shouldIntegrityBePending ? 'Enclave Code Integrity Verification' : isLoading ? getStepTitle('security', 'pending') : getStepTitle('security', currentDocument.steps.compareMeasurements.status)}
            description="This step verifies that the binary built from the source code matches the binary running in the secure enclave by comparing the fingerprints from the enclave and the expected fingerprints from the transparency log."
            status={shouldIntegrityBePending ? 'skipped' : getStepStatus(currentDocument.steps.compareMeasurements.status)}
            error={shouldIntegrityBePending ? undefined : isLoading ? undefined : currentDocument.steps.compareMeasurements.error}
            digestType="CODE_INTEGRITY"
            isDarkMode={isDarkMode}
            compact={compact}
          >
            {!shouldIntegrityBePending && (
              <MeasurementDiff
                sourceMeasurements={currentDocument.codeMeasurement}
                runtimeMeasurements={currentDocument.enclaveMeasurement.measurement}
                isVerified={currentDocument.securityVerified}
                isDarkMode={isDarkMode}
                showStatusBanner={true}
                sourceFingerprint={currentDocument.codeFingerprint}
                runtimeFingerprint={currentDocument.enclaveFingerprint}
                isLoading={isLoading || !currentDocument.codeMeasurement || !currentDocument.enclaveMeasurement?.measurement}
              />
            )}
          </ProcessStep>

          {!compact && currentDocument.hardwareMeasurement && (
            <ProcessStep
              title="Hardware Platform Verification"
              description="This step verifies the TDX platform measurements to ensure the hardware is genuine and unmodified."
              status={getStepStatus('success')}
              digestType="GENERIC"
              isDarkMode={isDarkMode}
              compact={compact}
            >
              <div className="space-y-3">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-content-primary">
                    Platform ID
                  </h4>
                  <div
                    className={`overflow-x-auto rounded-lg border p-3 transition-colors ${
                      isDarkMode
                        ? 'border-border-subtle bg-surface-chat text-content-primary'
                        : 'border-border-subtle bg-surface-card text-content-primary'
                    }`}
                  >
                    <div className="whitespace-nowrap font-mono text-sm">
                      {currentDocument.hardwareMeasurement.ID}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-content-primary">
                    MRTD (Measurement of TDX Module)
                  </h4>
                  <div
                    className={`overflow-x-auto rounded-lg border p-3 transition-colors ${
                      isDarkMode
                        ? 'border-border-subtle bg-surface-chat text-content-primary'
                        : 'border-border-subtle bg-surface-card text-content-primary'
                    }`}
                  >
                    <div className="whitespace-nowrap font-mono text-sm">
                      {currentDocument.hardwareMeasurement.MRTD}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-content-primary">
                    RTMR0 (Runtime Measurement Register 0)
                  </h4>
                  <div
                    className={`overflow-x-auto rounded-lg border p-3 transition-colors ${
                      isDarkMode
                        ? 'border-border-subtle bg-surface-chat text-content-primary'
                        : 'border-border-subtle bg-surface-card text-content-primary'
                    }`}
                  >
                    <div className="whitespace-nowrap font-mono text-sm">
                      {currentDocument.hardwareMeasurement.RTMR0}
                    </div>
                  </div>
                </div>
              </div>
            </ProcessStep>
          )}

          {!compact && (
            <ProcessStep
              title={shouldHPKEBePending ? 'Encryption Key Validation' : currentDocument.steps.verifyHPKEKey?.status === 'failed' ? 'Encryption Key Validation Failed' : 'Encryption Key Validated'}
              description="This step verifies the Hybrid Public Key Encryption (HPKE) key used for secure communication with the enclave is part of the attestation report."
              status={shouldHPKEBePending ? 'skipped' : getStepStatus(currentDocument.steps.verifyHPKEKey?.status || 'success')}
              error={shouldHPKEBePending ? undefined : isLoading ? undefined : currentDocument.steps.verifyHPKEKey?.error}
              digestType="HPKE_KEY"
              verificationDocument={currentDocument}
              isDarkMode={isDarkMode}
              compact={compact}
            />
          )}

          {!compact && (
            <ProcessStep
              title={shouldConnectionBePending ? 'Connection Established' : currentDocument.steps.createTransport?.status === 'failed' ? 'Connection Failed' : 'Connection Established'}
              description="This step establishes a secure encrypted connection with the verified enclave using the attested encryption key."
              status={shouldConnectionBePending ? 'skipped' : getStepStatus(currentDocument.steps.createTransport?.status || 'success')}
              error={shouldConnectionBePending ? undefined : isLoading ? undefined : currentDocument.steps.createTransport?.error}
              digestType="ROUTER_ENDPOINT"
              verificationDocument={currentDocument}
              isDarkMode={isDarkMode}
              compact={compact}
            />
          )}

          {currentDocument.steps.otherError && (
            <ProcessStep
              title="Initialization Error"
              description="An unexpected error occurred during the verification process."
              status={getStepStatus(currentDocument.steps.otherError.status)}
              error={isLoading ? undefined : currentDocument.steps.otherError.error}
              digestType="GENERIC"
              isDarkMode={isDarkMode}
              compact={compact}
            />
          )}

        </div>
        {isSafari && <div className="h-[30px]" aria-hidden="true" />}
      </div>

      {/* Footer */}
      <div className="flex-none">
        <VerifierFooter isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}

export const Verifier = VerificationCenter

export default VerificationCenter
