import { ref, computed, watch } from 'vue'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from '@wagmi/vue'
import { useEncrypt } from './useEncrypt'
import { isAddress } from 'viem'
import type { Abi } from 'viem'

/**
 * Parameters for useConfidentialTransfer composable
 */
interface UseConfidentialTransferParams {
  contractAddress: `0x${string}`
  abi: Abi
  functionName?: string
  decimals?: number
}

/**
 * Parameters for transfer function
 */
interface TransferParams {
  to: string
  amount: string | bigint
}

/**
 * Composable to perform confidential token transfers
 *
 * @example
 * ```ts
 * import { useConfidentialTransfer } from '@fhevmsdk/vue'
 *
 * const {
 *   transfer,
 *   isLoading,
 *   isSuccess,
 *   txHash,
 *   error
 * } = useConfidentialTransfer({
 *   contractAddress: '0x...',
 *   abi: tokenABI,
 *   decimals: 6
 * })
 *
 * await transfer({ to: '0x...', amount: '10.5' })
 * ```
 */
export function useConfidentialTransfer({
  contractAddress,
  abi,
  functionName = 'confidentialTransfer',
  decimals = 6,
}: UseConfidentialTransferParams) {
  const { address, isConnected } = useAccount()
  const { encryptUint64, isEncrypting } = useEncrypt()

  const isPreparingTx = ref(false)
  const transferError = ref<string | null>(null)

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const parseAmount = (amount: string | bigint): bigint => {
    if (typeof amount === 'bigint') return amount

    const [wholePart = '0', fractionalPart = ''] = amount.split('.')
    const paddedFractional = fractionalPart
      .padEnd(decimals, '0')
      .slice(0, decimals)
    const fullAmount = wholePart + paddedFractional
    return BigInt(fullAmount)
  }

  const transfer = async ({ to, amount }: TransferParams) => {
    if (!isConnected.value) {
      throw new Error('Please connect your wallet first')
    }

    if (!address.value) {
      throw new Error('No wallet address found')
    }

    if (!to || !isAddress(to)) {
      throw new Error('Please enter a valid recipient address')
    }

    const amountBigInt = parseAmount(amount)

    if (amountBigInt <= 0n) {
      throw new Error('Please enter a valid amount')
    }

    transferError.value = null
    isPreparingTx.value = true
    reset()

    try {
      // Encrypt the transfer amount
      const { data: encryptedAmount, proof } = await encryptUint64({
        value: amountBigInt,
        contractAddress,
      })

      // Call the transfer function
      writeContract({
        address: contractAddress,
        abi,
        functionName,
        args: [to, encryptedAmount, proof],
      })
    } catch (err) {
      console.error('Error preparing transfer:', err)
      transferError.value =
        err instanceof Error ? err.message : 'Failed to prepare transfer'
      isPreparingTx.value = false
      throw err
    }
  }

  // Reset preparing state when transaction starts
  watch([isPending, isSuccess, writeError, confirmError], () => {
    if (isPending.value || isSuccess.value || writeError.value || confirmError.value) {
      isPreparingTx.value = false
    }
  })

  // Set error message
  watch([writeError, confirmError], () => {
    const error = writeError.value || confirmError.value
    if (error) {
      const errorStr = error.toString()

      if (errorStr.includes('InsufficientBalance')) {
        transferError.value = 'Insufficient balance to complete this transfer'
      } else if (errorStr.includes('rejected')) {
        transferError.value = 'Transaction was rejected by user'
      } else if (errorStr.includes('insufficient funds')) {
        transferError.value = 'Insufficient funds to pay for gas fees'
      } else {
        transferError.value = 'Transaction failed. Please try again.'
      }
    }
  })

  const isLoading = computed(() =>
    isPreparingTx.value || isEncrypting.value || isPending.value || isConfirming.value
  )

  const canTransfer = computed(() =>
    isConnected.value && !isPreparingTx.value && !isEncrypting.value && !isPending.value
  )

  return {
    transfer,
    isLoading,
    isPreparingTx: computed(() => isPreparingTx.value),
    isEncrypting,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error: computed(() => transferError.value),
    reset: () => {
      transferError.value = null
      reset()
    },
    canTransfer,
  }
}
