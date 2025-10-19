// Provider and context
export { FHEVMProvider, useFHEVMContext } from './FHEVMProvider'

// Hooks
export { useFHEVM } from './hooks/useFHEVM'
export { useEncrypt } from './hooks/useEncrypt'
export { useDecrypt } from './hooks/useDecrypt'
export { useConfidentialBalance } from './hooks/useConfidentialBalance'
export { useConfidentialTransfer } from './hooks/useConfidentialTransfer'

// Re-export core types and utilities
export type {
  FhevmInstance,
  CreateFHEVMClientOptions,
  EncryptedValue,
  EncryptParams,
  DecryptParams,
  FHEVMClient,
} from '@fhevmsdk/core'

export {
  formatTokenAmount,
  parseTokenAmount,
  uint8ArrayToHex,
} from '@fhevmsdk/core'
