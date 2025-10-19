import { useFHEVMContext } from '../FHEVMProvider'
import type { FHEVMClient } from '@fhevmsdk/core'

/**
 * Return type for useFHEVM hook
 */
interface UseFHEVMReturn {
  /** FHEVM client instance for encryption/decryption */
  client: FHEVMClient | null
  /** Whether FHEVM is initialized and ready to use */
  isReady: boolean
  /** Error message if initialization failed */
  error: string | null
  /** Function to retry FHEVM initialization */
  retry: () => void
}

/**
 * Main hook to access FHEVM client and status
 *
 * This hook provides access to the FHEVM client instance and its
 * initialization status. Use this to check if FHEVM is ready before
 * performing encryption or decryption operations.
 *
 * @returns FHEVM client, ready state, error, and retry function
 *
 * @example
 * ```tsx
 * const { client, isReady, error, retry } = useFHEVM()
 *
 * if (!isReady) return <div>Loading FHEVM...</div>
 * if (error) return (
 *   <div>
 *     Error: {error}
 *     <button onClick={retry}>Retry</button>
 *   </div>
 * )
 *
 * // Use client for encryption/decryption
 * const encrypted = await client.encrypt.uint64({ ... })
 * ```
 */
export function useFHEVM(): UseFHEVMReturn {
  const context = useFHEVMContext()
  return {
    client: context.client,
    isReady: context.isReady,
    error: context.error,
    retry: context.retry,
  }
}
