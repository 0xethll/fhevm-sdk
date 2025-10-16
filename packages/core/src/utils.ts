/**
 * Format token amount for display
 * @param amount - Amount in smallest unit (e.g., wei)
 * @param decimals - Number of decimal places (default: 6)
 * @returns Formatted string
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 6,
): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.replace(/0+$/, '')

  return `${wholePart}.${trimmedFractional}`
}

/**
 * Parse token amount from string to bigint
 * @param amount - Amount as string (e.g., "10.5")
 * @param decimals - Number of decimal places (default: 6)
 * @returns Amount in smallest unit as bigint
 */
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
  const [wholePart = '0', fractionalPart = ''] = amount.split('.')
  const paddedFractional = fractionalPart
    .padEnd(decimals, '0')
    .slice(0, decimals)
  const fullAmount = wholePart + paddedFractional
  return BigInt(fullAmount)
}

/**
 * Convert Uint8Array to hex string
 */
export function uint8ArrayToHex(arr: Uint8Array): `0x${string}` {
  return `0x${Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}` as `0x${string}`
}

/**
 * Check if code is running in browser environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).ethereum !== 'undefined'
  )
}
