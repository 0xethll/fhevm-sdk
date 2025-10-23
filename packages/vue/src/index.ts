/**
 * @fhevmsdk/vue - Vue composables for FHEVM SDK
 *
 * This package provides Vue 3 composables for building privacy-preserving
 * decentralized applications using Fully Homomorphic Encryption (FHE).
 *
 * @example
 * ```ts
 * // Setup in main.ts
 * import { createApp } from 'vue'
 * import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'
 *
 * const fhevmContext = setupFHEVM({ network: 'sepolia' })
 * const app = createApp(App)
 * app.provide(FHEVMContextKey, fhevmContext)
 * app.mount('#app')
 * ```
 *
 * @example
 * ```ts
 * // Use in components
 * import { useFHEVM, useConfidentialBalance } from '@fhevmsdk/vue'
 *
 * const { isReady, error } = useFHEVM()
 * const { decryptedBalance, revealBalance } = useConfidentialBalance({
 *   contractAddress: '0x...',
 *   abi: tokenABI
 * })
 * ```
 */

// Core FHEVM functionality
export {
  useFHEVM,
  setupFHEVM,
  FHEVMContextKey,
  type FHEVMContext,
} from './composables/useFHEVM'

// Encryption and decryption
export { useEncrypt, type EncryptedUint } from './composables/useEncrypt'
export { useDecrypt } from './composables/useDecrypt'

// High-level composables
export { useConfidentialBalance } from './composables/useConfidentialBalance'
export { useConfidentialTransfer } from './composables/useConfidentialTransfer'
