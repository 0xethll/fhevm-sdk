import { ref, computed } from 'vue'
import { useAccount } from '@wagmi/vue'
import { useFHEVM } from './useFHEVM'
import type { EncryptedValue } from '@fhevmsdk/core'
import { uint8ArrayToHex } from '@fhevmsdk/core'

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
 * Composable to encrypt values for confidential contracts
 *
 * @example
 * ```ts
 * import { useEncrypt } from '@fhevmsdk/vue'
 *
 * const { encryptUint64, isEncrypting, canEncrypt } = useEncrypt()
 *
 * const result = await encryptUint64({
 *   value: 1000000n,
 *   contractAddress: '0x...'
 * })
 * ```
 */
export function useEncrypt() {
  const { client, isReady } = useFHEVM()
  const { address } = useAccount()
  const isEncrypting = ref(false)
  const error = ref<string | null>(null)

  const canEncrypt = computed(() => isReady.value && !!address.value)

  const encryptValue = async (
    value: bigint,
    contractAddress: string,
    encryptFn: (params: any) => Promise<EncryptedValue>,
  ): Promise<EncryptedUint> => {
    if (!isReady.value || !client.value) {
      throw new Error('FHEVM is not ready')
    }

    if (!address.value) {
      throw new Error('Wallet not connected')
    }

    isEncrypting.value = true
    error.value = null

    try {
      const result = await encryptFn({
        value,
        contractAddress,
        userAddress: address.value,
      })

      return {
        data: uint8ArrayToHex(result.handle),
        proof: uint8ArrayToHex(result.proof),
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Encryption failed'
      error.value = errorMsg
      throw err
    } finally {
      isEncrypting.value = false
    }
  }

  const encryptUint8 = async (params: EncryptFunctionParams) => {
    return encryptValue(
      params.value,
      params.contractAddress,
      client.value!.encrypt.uint8,
    )
  }

  const encryptUint16 = async (params: EncryptFunctionParams) => {
    return encryptValue(
      params.value,
      params.contractAddress,
      client.value!.encrypt.uint16,
    )
  }

  const encryptUint32 = async (params: EncryptFunctionParams) => {
    return encryptValue(
      params.value,
      params.contractAddress,
      client.value!.encrypt.uint32,
    )
  }

  const encryptUint64 = async (params: EncryptFunctionParams) => {
    return encryptValue(
      params.value,
      params.contractAddress,
      client.value!.encrypt.uint64,
    )
  }

  const encryptUint128 = async (params: EncryptFunctionParams) => {
    return encryptValue(
      params.value,
      params.contractAddress,
      client.value!.encrypt.uint128,
    )
  }

  const encryptUint256 = async (params: EncryptFunctionParams) => {
    return encryptValue(
      params.value,
      params.contractAddress,
      client.value!.encrypt.uint256,
    )
  }

  return {
    encryptUint8,
    encryptUint16,
    encryptUint32,
    encryptUint64,
    encryptUint128,
    encryptUint256,
    isEncrypting,
    error,
    canEncrypt,
  }
}
