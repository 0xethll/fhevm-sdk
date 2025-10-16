import { useState, useCallback, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useEncrypt } from './useEncrypt'
import { isAddress } from 'viem'

/**
 * Parameters for useConfidentialTransfer hook
 */
interface UseConfidentialTransferParams {
  contractAddress: `0x${string}`
  abi: any[]
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
 * Return type for useConfidentialTransfer hook
 */
interface UseConfidentialTransferReturn {
  /** Function to execute confidential transfer */
  transfer: (params: TransferParams) => Promise<void>
  /** Overall loading state (preparing, encrypting, pending, confirming) */
  isLoading: boolean
  /** Whether transaction is being prepared */
  isPreparingTx: boolean
  /** Whether amount is being encrypted */
  isEncrypting: boolean
  /** Whether transaction is pending (waiting for user confirmation) */
  isPending: boolean
  /** Whether transaction is confirming on-chain */
  isConfirming: boolean
  /** Whether transaction completed successfully */
  isSuccess: boolean
  /** Transaction hash (once submitted) */
  txHash: `0x${string}` | undefined
  /** Error message if transfer failed */
  error: string | null
  /** Reset transfer state and errors */
  reset: () => void
  /** Whether transfer can be executed (wallet connected and not busy) */
  canTransfer: boolean
}

/**
 * Hook to perform confidential token transfers
 *
 * This hook handles the complete flow of encrypting a token amount
 * and submitting a confidential transfer transaction to the blockchain.
 *
 * @param params - Configuration for the hook
 * @returns Transfer function and transaction state
 *
 * @example
 * ```tsx
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
 * const handleTransfer = async () => {
 *   await transfer({
 *     to: '0x...',
 *     amount: '10.5' // or BigInt
 *   })
 * }
 * ```
 */
export function useConfidentialTransfer({
  contractAddress,
  abi,
  functionName = 'confidentialTransfer',
  decimals = 6,
}: UseConfidentialTransferParams): UseConfidentialTransferReturn {
  const { address, isConnected } = useAccount()
  const { encryptUint64, isEncrypting } = useEncrypt()

  const [isPreparingTx, setIsPreparingTx] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)

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

  const parseAmount = useCallback(
    (amount: string | bigint): bigint => {
      if (typeof amount === 'bigint') return amount

      const [wholePart = '0', fractionalPart = ''] = amount.split('.')
      const paddedFractional = fractionalPart
        .padEnd(decimals, '0')
        .slice(0, decimals)
      const fullAmount = wholePart + paddedFractional
      return BigInt(fullAmount)
    },
    [decimals],
  )

  const transfer = useCallback(
    async ({ to, amount }: TransferParams) => {
      if (!isConnected) {
        throw new Error('Please connect your wallet first')
      }

      if (!address) {
        throw new Error('No wallet address found')
      }

      if (!to || !isAddress(to)) {
        throw new Error('Please enter a valid recipient address')
      }

      const amountBigInt = parseAmount(amount)

      if (amountBigInt <= 0n) {
        throw new Error('Please enter a valid amount')
      }

      setTransferError(null)
      setIsPreparingTx(true)
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
        setTransferError(
          err instanceof Error ? err.message : 'Failed to prepare transfer',
        )
        setIsPreparingTx(false)
        throw err
      }
    },
    [
      isConnected,
      address,
      parseAmount,
      encryptUint64,
      contractAddress,
      writeContract,
      abi,
      functionName,
      reset,
    ],
  )

  // Reset preparing state when transaction starts
  useEffect(() => {
    if (isPending || isSuccess || writeError || confirmError) {
      setIsPreparingTx(false)
    }
  }, [isPending, isSuccess, writeError, confirmError])

  // Set error message
  useEffect(() => {
    const error = writeError || confirmError
    if (error) {
      const errorStr = error.toString()

      if (errorStr.includes('InsufficientBalance')) {
        setTransferError('Insufficient balance to complete this transfer')
      } else if (errorStr.includes('rejected')) {
        setTransferError('Transaction was rejected by user')
      } else if (errorStr.includes('insufficient funds')) {
        setTransferError('Insufficient funds to pay for gas fees')
      } else {
        setTransferError('Transaction failed. Please try again.')
      }
    }
  }, [writeError, confirmError])

  return {
    transfer,
    isLoading: isPreparingTx || isEncrypting || isPending || isConfirming,
    isPreparingTx,
    isEncrypting,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error: transferError,
    reset: () => {
      setTransferError(null)
      reset()
    },
    canTransfer: isConnected && !isPreparingTx && !isEncrypting && !isPending,
  }
}
