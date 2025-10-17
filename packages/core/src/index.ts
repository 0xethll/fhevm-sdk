// Import utils first to execute global polyfill
import './utils'

// Main exports
export { initFHEVM, createFHEVMClient } from './client'

// Type exports
export type {
  FhevmInstance,
  CreateFHEVMClientOptions,
  EncryptedValue,
  EncryptParams,
  DecryptParams,
  FHEVMClient,
} from './types'

// Config exports
export { getNetworkConfig } from './config'

// Utility exports
export {
  formatTokenAmount,
  parseTokenAmount,
  uint8ArrayToHex,
  isBrowser,
} from './utils'

// Direct function exports (for advanced usage)
export {
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptUint128,
  encryptUint256,
} from './encrypt'
export { decryptForUser } from './decrypt'
