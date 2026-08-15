import dynamic from "next/dynamic";
import { PiSpinner } from "react-icons/pi";
import type { VerificationDocument } from "@/lib/types/verification";
export type { VerificationDocument } from "@/lib/types/verification";
import { getVerificationStatus } from "@/lib/utils/verification-status";
import { VerifierHeader } from "./verifier-header";
import { TextureGrid } from "./texture-grid";

const VerificationInitialState = dynamic(
  () =>
    import("./verification-initial-state").then(
      (module) => module.VerificationInitialState,
    ),
  { loading: () => <VerificationLoadingState /> },
);

export type VerificationCenterProps = {
  /** The verification document to display */
  verificationDocument?: VerificationDocument;
  /** Dark mode toggle */
  isDarkMode?: boolean;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Display type: 'chat' for AI chat, 'default' for generic containers/servers */
  type?: 'chat' | 'default';
};

const placeholderDocument: VerificationDocument = {
  configRepo: "",
  enclaveHost: "",
  releaseDigest: "",
  codeMeasurement: { type: "", registers: [] },
  enclaveMeasurement: { measurement: { type: "", registers: [] } },
  tlsPublicKey: "",
  hpkePublicKey: "",
  codeFingerprint: "",
  enclaveFingerprint: "",
  selectedEnclaveEndpoint: "",
  securityVerified: false,
  steps: {
    fetchDigest: { status: "pending" },
    verifyCode: { status: "pending" },
    verifyEnclave: { status: "pending" },
    compareMeasurements: { status: "pending" },
  },
};

function VerificationLoadingState() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-surface-background">
      <TextureGrid className="z-0" />
      <div className="relative z-10 flex items-center gap-2 font-sans text-sm text-content-secondary">
        <PiSpinner className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

export function VerificationCenter({
  verificationDocument,
  isDarkMode = true,
  showHeader = true,
  type = 'default',
}: VerificationCenterProps) {
  const isLoading = !verificationDocument;
  const currentDocument = verificationDocument || placeholderDocument;

  const { allSuccess, hasError, firstErrorMessage } = getVerificationStatus(
    currentDocument,
    isLoading,
  );

  const status = isLoading
    ? "verifying"
    : hasError
      ? "error"
      : allSuccess
        ? "success"
        : "verifying";

  const errorMsg = hasError ? firstErrorMessage : undefined;

  const getStepStatusValue = (
    stepStatus: "pending" | "success" | "failed" | undefined,
    defaultToSuccess = false,
  ): "pending" | "success" | "error" => {
    if (isLoading) return "pending";
    if (!stepStatus) return defaultToSuccess ? "success" : "pending";
    if (stepStatus === "pending") return "pending";
    return stepStatus === "failed" ? "error" : "success";
  };

  const hasMeasurementError =
    currentDocument.steps.compareMeasurements?.status === "failed";
  const hasOtherError = currentDocument.steps.otherError?.status === "failed";

  const stepStatuses = {
    encryption: getStepStatusValue(
      currentDocument.steps.verifyCertificate?.status,
      true,
    ),
    code: getStepStatusValue(currentDocument.steps.verifyCode.status),
    hardware: getStepStatusValue(currentDocument.steps.verifyEnclave.status),
    measurement: hasMeasurementError ? ("error" as const) : undefined,
    other: hasOtherError ? ("error" as const) : undefined,
  };

  return (
    <div
      className={`tinfoil-verification-theme flex h-full w-full flex-col bg-background text-foreground ${
        isDarkMode ? "dark" : ""
      }`}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      {showHeader && (
        <VerifierHeader
          isDarkMode={isDarkMode}
          status={isLoading ? "verifying" : status}
        />
      )}
      {isLoading ? (
        <VerificationLoadingState />
      ) : (
        <VerificationInitialState
          isDarkMode={isDarkMode}
          verificationDocument={currentDocument}
          status={status}
          errorMessage={errorMsg}
          stepStatuses={stepStatuses}
          showHeader={false}
          type={type}
        />
      )}
    </div>
  );
}

export const Verifier = VerificationCenter;

export default VerificationCenter;
