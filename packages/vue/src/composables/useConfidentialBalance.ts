import { ref, watch, computed } from 'vue'
import { useAccount, useReadContract } from '@wagmi/vue'
import { useDecrypt } from './useDecrypt'
import type { Abi } from 'viem'

/**
 * Parameters for useConfidentialBalance composable
 */
interface UseConfidentialBalanceParams {
  contractAddress: `0x${string}`
  abi: Abi
  functionName?: string
  decimals?: number
}

/**
 * Composable to read and decrypt confidential token balance
 *
 * @example
 * ```ts
 * import { useConfidentialBalance } from '@fhevmsdk/vue'
 *
 * const {
 *   decryptedBalance,
 *   isVisible,
 *   revealBalance,
 *   hideBalance,
 *   formatBalance
 * } = useConfidentialBalance({
 *   contractAddress: '0x...',
 *   abi: tokenABI,
 *   decimals: 6
 * })
 * ```
 */
export function useConfidentialBalance({
  contractAddress,
  abi,
  functionName = 'confidentialBalanceOf',
  decimals = 6,
}: UseConfidentialBalanceParams) {
  const { address } = useAccount()
  const { decrypt, isDecrypting } = useDecrypt()

  const decryptedBalance = ref<bigint | null>(null)
  const isVisible = ref(false)

  // Read encrypted balance from contract
  const {
    data: encryptedBalance,
    refetch,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi,
    functionName,
    args: computed(() => (address.value ? [address.value] : undefined)),
    query: {
      enabled: computed(() => !!address.value),
    },
  })

  // Clear decrypted balance when encrypted balance changes
  watch(encryptedBalance, () => {
    if (isVisible.value && encryptedBalance.value) {
      decryptedBalance.value = null
      isVisible.value = false
    }
  })

  // Clear balance when address changes
  watch(address, () => {
    decryptedBalance.value = null
    isVisible.value = false
  })

  const revealBalance = async () => {
    if (!encryptedBalance.value || typeof encryptedBalance.value !== 'string') {
      throw new Error('No encrypted balance available')
    }

    isVisible.value = true

    try {
      const result = await decrypt({
        ciphertextHandle: encryptedBalance.value,
        contractAddress,
      })
      decryptedBalance.value = result
    } catch (err) {
      isVisible.value = false
      throw err
    }
  }

  const hideBalance = () => {
    isVisible.value = false
    decryptedBalance.value = null
  }

  const formatBalance = (balance: bigint): string => {
    const divisor = BigInt(10 ** decimals)
    const wholePart = balance / divisor
    const fractionalPart = balance % divisor

    if (fractionalPart === 0n) {
      return wholePart.toString()
    }

    const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
    const trimmedFractional = fractionalStr.replace(/0+$/, '')

    return `${wholePart}.${trimmedFractional}`
  }

  return {
    encryptedBalance: computed(() => encryptedBalance.value as `0x${string}` | undefined),
    decryptedBalance: computed(() => decryptedBalance.value),
    isVisible: computed(() => isVisible.value),
    isLoading: computed(() => isLoading.value),
    isDecrypting: computed(() => isDecrypting.value),
    revealBalance,
    hideBalance,
    formatBalance,
    refetch,
  }
}
