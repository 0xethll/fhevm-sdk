import { useState, useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useFHEVM } from './useFHEVM'

/**
 * Parameters for decrypt function
 */
interface DecryptFunctionParams {
  ciphertextHandle: string
  contractAddress: string
}

/**
 * Return type for useDecrypt hook
 */
interface UseDecryptReturn {
  /** Function to decrypt a ciphertext handle */
  decrypt: (params: DecryptFunctionParams) => Promise<bigint>
  /** Whether decryption is in progress */
  isDecrypting: boolean
  /** Error message if decryption failed */
  error: string | null
  /** Whether decryption can be performed (FHEVM ready, wallet connected) */
  canDecrypt: boolean
}

/**
 * Hook to decrypt confidential values using viem WalletClient
 *
 * This hook provides a simple interface for decrypting encrypted values
 * stored in confidential contracts. It handles the EIP-712 signature
 * process automatically using the connected wallet.
 *
 * @returns Decrypt function and state management
 *
 * @example
 * ```tsx
 * const { decrypt, isDecrypting, error, canDecrypt } = useDecrypt()
 *
 * const handleDecrypt = async () => {
 *   if (!canDecrypt) return
 *
 *   const balance = await decrypt({
 *     ciphertextHandle: '0x...',
 *     contractAddress: '0x...'
 *   })
 *
 *   console.log('Decrypted balance:', balance)
 * }
 * ```
 */
export function useDecrypt(): UseDecryptReturn {
  const { client, isReady } = useFHEVM()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const decrypt = useCallback(
    async (params: {
      ciphertextHandle: string
      contractAddress: string
    }): Promise<bigint> => {
      // Validate FHEVM is ready
      if (!isReady || !client) {
        throw new Error('FHEVM is not ready')
      }

      // Validate wallet is connected
      if (!address) {
        throw new Error('Wallet not connected')
      }

      // Validate wallet client is available
      if (!walletClient) {
        throw new Error('Wallet client not available')
      }

      setIsDecrypting(true)
      setError(null)

      try {
        // Decrypt using viem WalletClient directly
        // No need to convert from ethers - native viem integration!
        const result = await client.decrypt({
          ciphertextHandle: params.ciphertextHandle,
          contractAddress: params.contractAddress,
          walletClient,
        })

        return result
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Decryption failed'
        setError(errorMsg)
        throw err
      } finally {
        setIsDecrypting(false)
      }
    },
    [client, isReady, address, walletClient],
  )

  return {
    decrypt,
    isDecrypting,
    error,
    canDecrypt: isReady && !!address && !!walletClient,
  }
}
