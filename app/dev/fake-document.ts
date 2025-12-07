import type { VerificationDocument } from '../../../src/types/verification'

const sourceMeasurement = {
  type: 'sev-snp',
  registers: [
    '886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
    '51d6595417a6de571d25fe1b6aa7cb334cbeff8a64d620dbc62efdc34f3d06a3',
    '18c9246b5bf5056f4b9b8c5b8e7dca83958e8759a8b22eed7320bcbaa5b8d79c',
  ],
}

const runtimeMeasurement = {
  type: 'sev-snp',
  registers: [
    '886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
    '51d6595417a6de571d25fe1b6aa7cb334cbeff8a64d620dbc62efdc34f3d06a3',
    '18c9246b5bf5056f4b9b8c5b8e7dca83958e8759a8b22eed7320bcbaa5b8d79c',
  ],
}

const runtimeFingerprint =
  'sha256:4dcec7f452e67341f72c7414973ab0c0f4649fa748ba1fd0fda92b3ad2562e8c'

const tdxMeasurement = {
  type: 'tdx-guest-v1',
  registers: [
    'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  ],
}

export const mockSuccessDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: sourceMeasurement,
  enclaveMeasurement: {
    measurement: runtimeMeasurement,
    tlsPublicKeyFingerprint: runtimeFingerprint,
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
  selectedRouterEndpoint: 'https://router.demo.tinfoil.sh/v1/chat',
  securityVerified: true,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: { status: 'success' },
    compareMeasurements: { status: 'success' },
  },
}

export const mockFailureDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: sourceMeasurement,
  enclaveMeasurement: {
    measurement: {
      ...runtimeMeasurement,
      registers: [
        '1111111111111111111111111111111111111111111111111111111111111111',
        ...runtimeMeasurement.registers.slice(1),
      ],
    },
    tlsPublicKeyFingerprint: runtimeFingerprint,
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
  selectedRouterEndpoint: 'https://router.demo.tinfoil.sh/v1/chat',
  securityVerified: false,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: { status: 'success' },
    compareMeasurements: {
      status: 'failed',
      error: 'Runtime and source measurements do not match.',
    },
  },
}

export const mockTransportFailureDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: sourceMeasurement,
  enclaveMeasurement: {
    measurement: runtimeMeasurement,
    tlsPublicKeyFingerprint: runtimeFingerprint,
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
  selectedRouterEndpoint: 'https://router.demo.tinfoil.sh/v1/chat',
  securityVerified: false,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: { status: 'success' },
    compareMeasurements: { status: 'success' },
    createTransport: {
      status: 'failed',
      error: 'Failed to initialize secure transport layer. Connection timeout.',
    },
  },
}

export const mockHPKEFailureDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: sourceMeasurement,
  enclaveMeasurement: {
    measurement: runtimeMeasurement,
    tlsPublicKeyFingerprint: runtimeFingerprint,
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
  selectedRouterEndpoint: 'https://router.demo.tinfoil.sh/v1/chat',
  securityVerified: false,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: { status: 'success' },
    compareMeasurements: { status: 'success' },
    createTransport: { status: 'success' },
    verifyHPKEKey: {
      status: 'failed',
      error: 'HPKE public key verification failed. Key does not match expected value.',
    },
  },
}

export const mockOtherErrorDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: sourceMeasurement,
  enclaveMeasurement: {
    measurement: runtimeMeasurement,
    tlsPublicKeyFingerprint: runtimeFingerprint,
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
  selectedRouterEndpoint: 'https://router.demo.tinfoil.sh/v1/chat',
  securityVerified: false,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: { status: 'success' },
    compareMeasurements: { status: 'success' },
    otherError: {
      status: 'failed',
      error: 'An unexpected error occurred during verification: Network connection lost.',
    },
  },
}

export const mockEnclaveFailureDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: sourceMeasurement,
  enclaveMeasurement: {
    measurement: runtimeMeasurement,
    tlsPublicKeyFingerprint: runtimeFingerprint,
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:886a7e94bbf06e25550cbd2f29d78ad441e205fe84c60c383ffddcb814a81898',
  selectedRouterEndpoint: 'https://router.demo.tinfoil.sh/v1/chat',
  securityVerified: false,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: {
      status: 'failed',
      error: 'Enclave attestation signature verification failed. Invalid certificate chain.',
    },
    compareMeasurements: { status: 'pending' },
  },
}

export const mockTDXSuccessDocument: VerificationDocument = {
  configRepo: 'tinfoilsh/example-configs',
  enclaveHost: 'https://tdx-demo.enclave.tinfoil.sh',
  releaseDigest:
    'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  codeMeasurement: tdxMeasurement,
  enclaveMeasurement: {
    measurement: tdxMeasurement,
    hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  },
  tlsPublicKey: runtimeFingerprint,
  hpkePublicKey: '04a8b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  hardwareMeasurement: {
    ID: '00000000000000000000000000000001234567890abcdef',
    MRTD: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    RTMR0: '60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752',
  },
  codeFingerprint: 'sha256:74e1b91b4867d4b0fc3a1e9bc82a999aa1dd96c7fa968eefc8c9a7bd403f2f00',
  enclaveFingerprint: 'sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  selectedRouterEndpoint: 'https://router.tdx-demo.tinfoil.sh/v1/chat',
  securityVerified: true,
  steps: {
    fetchDigest: { status: 'success' },
    verifyCode: { status: 'success' },
    verifyEnclave: { status: 'success' },
    compareMeasurements: { status: 'success' },
  },
}
