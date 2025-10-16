import type { FhevmInstance, FhevmInstanceConfig } from '@zama-fhe/relayer-sdk/bundle'
import type { WalletClient, Account } from 'viem'

export type { FhevmInstance }

/**
 * Viem WalletClient with account
 * Used for signing EIP-712 typed data and getting user address
 */
export type ViemWalletClient = WalletClient & {
  account: Account
}

/**
 * Options for creating FHEVM client
 */
export interface CreateFHEVMClientOptions {
  network?: 'sepolia' | FhevmInstanceConfig
  provider?: any // window.ethereum or EIP-1193 provider
}

/**
 * Encrypted value with proof
 * Returned after encrypting data for confidential computation
 */
export interface EncryptedValue {
  handle: Uint8Array<ArrayBufferLike>
  proof: Uint8Array<ArrayBufferLike>
}

/**
 * Encryption input parameters
 */
export interface EncryptParams {
  value: bigint
  contractAddress: string
  userAddress: string
}

/**
 * Decryption input parameters
 * Requires viem WalletClient for EIP-712 signature
 */
export interface DecryptParams {
  ciphertextHandle: string
  contractAddress: string
  walletClient: ViemWalletClient
}

/**
 * FHEVM Client interface
 * Provides encryption and decryption capabilities for FHE operations
 */
export interface FHEVMClient {
  instance: FhevmInstance
  isReady: boolean
  encrypt: {
    uint8: (params: EncryptParams) => Promise<EncryptedValue>
    uint16: (params: EncryptParams) => Promise<EncryptedValue>
    uint32: (params: EncryptParams) => Promise<EncryptedValue>
    uint64: (params: EncryptParams) => Promise<EncryptedValue>
    uint128: (params: EncryptParams) => Promise<EncryptedValue>
    uint256: (params: EncryptParams) => Promise<EncryptedValue>
  }
  decrypt: (params: DecryptParams) => Promise<bigint>
}
