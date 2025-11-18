import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'
import type { DecryptParams } from './types'

/**
 * Decrypt a ciphertext handle for the user
 * Requires user signature for authorization via EIP-712
 *
 * @param fheInstance - FHEVM instance for cryptographic operations
 * @param params - Decryption parameters including wallet client and contract address
 * @returns Decrypted value as bigint
 *
 * @example
 * ```typescript
 * const decrypted = await decryptForUser(fheInstance, {
 *   ciphertextHandle: '0x...',
 *   contractAddress: '0x...',
 *   walletClient: viemWalletClient,
 * })
 * ```
 */
export async function decryptForUser(
  fheInstance: FhevmInstance,
  params: DecryptParams,
): Promise<bigint> {
  const { ciphertextHandle, contractAddress, walletClient } = params

  // Get user address synchronously from viem wallet client
  const userAddress = walletClient.account.address

  // Generate keypair for decryption
  const keypair = fheInstance.generateKeypair()

  // Prepare handle-contract pairs for batch decryption
  const handleContractPairs = [
    {
      handle: ciphertextHandle,
      contractAddress: contractAddress,
    },
  ]

  // Set up time parameters (10 days validity period for the signature)
  const startTimeStamp = Math.floor(Date.now() / 1000).toString()
  const durationDays = '10'
  const contractAddresses = [contractAddress]

  // Create EIP-712 typed data for signing
  const eip712 = fheInstance.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays,
  )

  // Request user signature using viem's signTypedData
  // Note: viem requires explicit primaryType and account parameters
  // Cast domain to match viem's strict hex string types
  const signature = await walletClient.signTypedData({
    domain: {
      name: eip712.domain.name,
      version: eip712.domain.version,
      chainId: eip712.domain.chainId,
      verifyingContract: eip712.domain.verifyingContract as `0x${string}`,
    },
    types: eip712.types,
    primaryType: 'UserDecryptRequestVerification',
    message: eip712.message,
    account: walletClient.account,
  })

  // Perform decryption using the signed authorization
  const result = await fheInstance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace('0x', ''), // Remove 0x prefix for FHEVM
    contractAddresses,
    userAddress,
    startTimeStamp,
    durationDays,
  )

  return BigInt(ciphertextHandle)
}
