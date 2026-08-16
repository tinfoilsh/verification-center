import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { VerificationDocument } from "@/lib/types/verification";
export type { VerificationDocument } from "@/lib/types/verification";
import { getVerificationStatus } from "@/lib/utils/verification-status";
import { VerifierHeader } from "./verifier-header";
import { TextureGrid } from "./texture-grid";
import { LogoLoading } from "./logo-loading";

const VerificationInitialState = dynamic(
  () =>
    import("./verification-initial-state").then(
      (module) => module.VerificationInitialState,
    ),
  { loading: () => <VerificationLoadingState /> },
);

const CONTENT_ASSET_PATHS = [
  "/icons/amd.svg",
  "/icons/intel.svg",
  "/icons/nvidia.svg",
];

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
      <TextureGrid className="z-10" />
      <div className="relative z-0 opacity-20" role="status" aria-label="Loading">
        <LogoLoading />
      </div>
    </div>
  );
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export function VerificationCenter({
  verificationDocument,
  isDarkMode = true,
  showHeader = true,
  type = 'default',
}: VerificationCenterProps) {
  const [areContentAssetsReady, setAreContentAssetsReady] = useState(false);
  const isLoading = !verificationDocument;
  const currentDocument = verificationDocument || placeholderDocument;

  useEffect(() => {
    let isCancelled = false;

    Promise.allSettled([
      document.fonts.load('14px "Aeonik Fono"'),
      document.fonts.load('500 14px "Aeonik Fono"'),
      ...CONTENT_ASSET_PATHS.map(preloadImage),
    ]).then(() => {
      if (!isCancelled) setAreContentAssetsReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

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
  const isContentReady = status !== "verifying" && areContentAssetsReady;

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
      {!isContentReady ? (
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
