import { useState, useCallback, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useDecrypt } from './useDecrypt'

/**
 * Parameters for useConfidentialBalance hook
 */
interface UseConfidentialBalanceParams {
  contractAddress: `0x${string}`
  abi: any[]
  functionName?: string
  decimals?: number
}

/**
 * Return type for useConfidentialBalance hook
 */
interface UseConfidentialBalanceReturn {
  /** Encrypted balance handle from contract (hex string) */
  encryptedBalance: `0x${string}` | undefined
  /** Decrypted balance as bigint (null until revealed) */
  decryptedBalance: bigint | null
  /** Whether the decrypted balance is currently visible */
  isVisible: boolean
  /** Whether the contract read is loading */
  isLoading: boolean
  /** Whether decryption is in progress */
  isDecrypting: boolean
  /** Function to reveal (decrypt) the balance */
  revealBalance: () => Promise<void>
  /** Function to hide the decrypted balance */
  hideBalance: () => void
  /** Format a bigint balance for display */
  formatBalance: (balance: bigint) => string
  /** Refetch the encrypted balance from contract */
  refetch: () => Promise<unknown>
}

/**
 * Hook to read and decrypt confidential token balance
 *
 * This hook fetches the encrypted balance from a confidential contract,
 * and provides functions to decrypt and display it with user authorization.
 *
 * @param params - Configuration for the hook
 * @returns Balance data and utility functions
 *
 * @example
 * ```tsx
 * const {
 *   encryptedBalance,
 *   decryptedBalance,
 *   isDecrypting,
 *   revealBalance,
 *   hideBalance
 * } = useConfidentialBalance({
 *   contractAddress: '0x...',
 *   abi: tokenABI,
 *   decimals: 6
 * })
 *
 * // Display encrypted balance (handle)
 * <div>Encrypted: {encryptedBalance}</div>
 *
 * // Reveal actual balance
 * <button onClick={revealBalance}>Show Balance</button>
 * {decryptedBalance && <div>Balance: {formatBalance(decryptedBalance)}</div>}
 * ```
 */
export function useConfidentialBalance({
  contractAddress,
  abi,
  functionName = 'confidentialBalanceOf',
  decimals = 6,
}: UseConfidentialBalanceParams): UseConfidentialBalanceReturn {
  const { address } = useAccount()
  const { decrypt, isDecrypting } = useDecrypt()

  const [decryptedBalance, setDecryptedBalance] = useState<bigint | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Read encrypted balance from contract
  const {
    data: encryptedBalance,
    refetch,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi,
    functionName,
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Clear decrypted balance when encrypted balance changes
  useEffect(() => {
    if (isVisible && encryptedBalance) {
      setDecryptedBalance(null)
      setIsVisible(false)
    }
  }, [encryptedBalance])

  // Clear balance when address changes
  useEffect(() => {
    setDecryptedBalance(null)
    setIsVisible(false)
  }, [address])

  const revealBalance = useCallback(async () => {
    if (!encryptedBalance || typeof encryptedBalance !== 'string') {
      throw new Error('No encrypted balance available')
    }

    setIsVisible(true)

    try {
      const result = await decrypt({
        ciphertextHandle: encryptedBalance,
        contractAddress,
      })
      setDecryptedBalance(result)
    } catch (err) {
      setIsVisible(false)
      throw err
    }
  }, [encryptedBalance, contractAddress, decrypt])

  const hideBalance = useCallback(() => {
    setIsVisible(false)
    setDecryptedBalance(null)
  }, [])

  const formatBalance = useCallback(
    (balance: bigint) => {
      const divisor = BigInt(10 ** decimals)
      const wholePart = balance / divisor
      const fractionalPart = balance % divisor

      if (fractionalPart === 0n) {
        return wholePart.toString()
      }

      const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
      const trimmedFractional = fractionalStr.replace(/0+$/, '')

      return `${wholePart}.${trimmedFractional}`
    },
    [decimals],
  )

  return {
    encryptedBalance: encryptedBalance as `0x${string}` | undefined,
    decryptedBalance,
    isVisible,
    isLoading,
    isDecrypting,
    revealBalance,
    hideBalance,
    formatBalance,
    refetch,
  }
}
