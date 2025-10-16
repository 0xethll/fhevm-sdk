import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useFHEVM } from './useFHEVM'
import type { EncryptedValue } from '@fhevm/core'
import { uint8ArrayToHex } from '@fhevm/core'

/**
 * Encrypted value result with data and proof as hex strings
 */
export type EncryptedUint = {
  data: `0x${string}`
  proof: `0x${string}`
}

/**
 * Parameters for encrypt functions
 */
type EncryptFunctionParams = {
  value: bigint
  contractAddress: string
}

/**
 * Return type for useEncrypt hook
 */
interface UseEncryptReturn {
  /** Encrypt 8-bit unsigned integer */
  encryptUint8: (params: EncryptFunctionParams) => Promise<EncryptedUint>
  /** Encrypt 16-bit unsigned integer */
  encryptUint16: (params: EncryptFunctionParams) => Promise<EncryptedUint>
  /** Encrypt 32-bit unsigned integer */
  encryptUint32: (params: EncryptFunctionParams) => Promise<EncryptedUint>
  /** Encrypt 64-bit unsigned integer */
  encryptUint64: (params: EncryptFunctionParams) => Promise<EncryptedUint>
  /** Encrypt 128-bit unsigned integer */
  encryptUint128: (params: EncryptFunctionParams) => Promise<EncryptedUint>
  /** Encrypt 256-bit unsigned integer */
  encryptUint256: (params: EncryptFunctionParams) => Promise<EncryptedUint>
  /** Whether encryption is in progress */
  isEncrypting: boolean
  /** Error message if encryption failed */
  error: string | null
  /** Whether encryption can be performed (FHEVM ready and wallet connected) */
  canEncrypt: boolean
}

/**
 * Hook to encrypt values for confidential contracts
 *
 * Provides functions to encrypt different integer types for use in
 * confidential smart contract transactions.
 *
 * @returns Encrypt functions and state
 *
 * @example
 * ```tsx
 * const { encryptUint64, isEncrypting, error, canEncrypt } = useEncrypt()
 *
 * const handleEncrypt = async () => {
 *   if (!canEncrypt) return
 *
 *   const result = await encryptUint64({
 *     value: 1000000n,
 *     contractAddress: '0x...'
 *   })
 *
 *   // Use result.data and result.proof in contract calls
 *   await contract.write.transfer([recipient, result.data, result.proof])
 * }
 * ```
 */
export function useEncrypt(): UseEncryptReturn {
  const { client, isReady } = useFHEVM()
  const { address } = useAccount()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const encryptValue = useCallback(
    async (
      value: bigint,
      contractAddress: string,
      encryptFn: (params: any) => Promise<EncryptedValue>,
    ): Promise<EncryptedUint> => {
      if (!isReady || !client) {
        throw new Error('FHEVM is not ready')
      }

      if (!address) {
        throw new Error('Wallet not connected')
      }

      setIsEncrypting(true)
      setError(null)

      try {
        const result = await encryptFn({
          value,
          contractAddress,
          userAddress: address,
        })

        return {
          data: uint8ArrayToHex(result.handle),
          proof: uint8ArrayToHex(result.proof),
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Encryption failed'
        setError(errorMsg)
        throw err
      } finally {
        setIsEncrypting(false)
      }
    },
    [client, isReady, address],
  )

  const encryptUint8 = useCallback(
    async (params: { value: bigint; contractAddress: string }) => {
      return encryptValue(
        params.value,
        params.contractAddress,
        client!.encrypt.uint8,
      )
    },
    [client, encryptValue],
  )

  const encryptUint16 = useCallback(
    async (params: { value: bigint; contractAddress: string }) => {
      return encryptValue(
        params.value,
        params.contractAddress,
        client!.encrypt.uint16,
      )
    },
    [client, encryptValue],
  )

  const encryptUint32 = useCallback(
    async (params: { value: bigint; contractAddress: string }) => {
      return encryptValue(
        params.value,
        params.contractAddress,
        client!.encrypt.uint32,
      )
    },
    [client, encryptValue],
  )

  const encryptUint64 = useCallback(
    async (params: { value: bigint; contractAddress: string }) => {
      return encryptValue(
        params.value,
        params.contractAddress,
        client!.encrypt.uint64,
      )
    },
    [client, encryptValue],
  )

  const encryptUint128 = useCallback(
    async (params: { value: bigint; contractAddress: string }) => {
      return encryptValue(
        params.value,
        params.contractAddress,
        client!.encrypt.uint128,
      )
    },
    [client, encryptValue],
  )

  const encryptUint256 = useCallback(
    async (params: { value: bigint; contractAddress: string }) => {
      return encryptValue(
        params.value,
        params.contractAddress,
        client!.encrypt.uint256,
      )
    },
    [client, encryptValue],
  )

  return {
    encryptUint8,
    encryptUint16,
    encryptUint32,
    encryptUint64,
    encryptUint128,
    encryptUint256,
    isEncrypting,
    error,
    canEncrypt: isReady && !!address,
  }
}
