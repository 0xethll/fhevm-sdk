import { ref, computed } from 'vue'
import { useAccount, useConnectorClient } from '@wagmi/vue'
import { walletActions } from 'viem'
import { useFHEVM } from './useFHEVM'

/**
 * Parameters for decrypt function
 */
interface DecryptFunctionParams {
  ciphertextHandle: string
  contractAddress: string
}

/**
 * Composable to decrypt confidential values using viem WalletClient
 *
 * @example
 * ```ts
 * import { useDecrypt } from '@fhevmsdk/vue'
 *
 * const { decrypt, isDecrypting, canDecrypt } = useDecrypt()
 *
 * const balance = await decrypt({
 *   ciphertextHandle: '0x...',
 *   contractAddress: '0x...'
 * })
 * ```
 */
export function useDecrypt() {
  const { client, isReady } = useFHEVM()
  const { address } = useAccount()
  const { data: connectorClient } = useConnectorClient()

  const isDecrypting = ref(false)
  const error = ref<string | null>(null)

  const canDecrypt = computed(() =>
    isReady.value && !!address.value && !!connectorClient.value
  )

  const decrypt = async (params: DecryptFunctionParams): Promise<bigint> => {
    // Validate FHEVM is ready
    if (!isReady.value || !client.value) {
      throw new Error('FHEVM is not ready')
    }

    // Validate wallet is connected
    if (!address.value) {
      throw new Error('Wallet not connected')
    }

    // Validate wallet client is available
    if (!connectorClient.value) {
      throw new Error('Wallet client not available')
    }

    // Validate account is available on connector client
    if (!connectorClient.value.account) {
      throw new Error('Wallet account not available')
    }

    isDecrypting.value = true
    error.value = null

    try {
      // Extend connector client with wallet actions to make it compatible with WalletClient
      const walletClient = connectorClient.value.extend(walletActions)

      const result = await client.value.decrypt({
        ciphertextHandle: params.ciphertextHandle,
        contractAddress: params.contractAddress,
        walletClient,
      })

      return result
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Decryption failed'
      error.value = errorMsg
      throw err
    } finally {
      isDecrypting.value = false
    }
  }

  return {
    decrypt,
    isDecrypting,
    error,
    canDecrypt,
  }
}
