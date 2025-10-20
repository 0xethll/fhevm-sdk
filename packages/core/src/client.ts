import type {
  FhevmInstance,
  CreateFHEVMClientOptions,
  FHEVMClient,
  EncryptParams,
  EncryptedValue,
  DecryptParams,
} from './types'
import { getNetworkConfig } from './config'
import {
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptUint128,
  encryptUint256,
} from './encrypt'
import { decryptForUser } from './decrypt'
import { isBrowser } from './utils'

// Import types from bundle (type-only import)
import type * as RelayerSDKTypes from '@zama-fhe/relayer-sdk/bundle'

/**
 * Helper function to import the relayer SDK at runtime
 * Uses /web version - bundlers should handle CJS/ESM conversion
 */
async function importRelayerSDK(): Promise<typeof RelayerSDKTypes> {
  // Use the /web export which is officially supported
  // Modern bundlers (Vite/Next.js) with shamefully-hoist=true
  // will properly handle the keccak CJS dependency
  const module = await import('@zama-fhe/relayer-sdk/web')
  return module as typeof RelayerSDKTypes
}

/**
 * Initialize the FHEVM SDK
 * Must be called before creating any FHEVM instances
 */
export async function initFHEVM(): Promise<void> {
  if (!isBrowser()) {
    throw new Error('FHEVM SDK can only be initialized in the browser')
  }

  // Use the helper function to import the full bundle
  const fheSdk = await importRelayerSDK()

  if (!fheSdk.initSDK) {
    throw new Error('initSDK function not available from FHEVM SDK')
  }

  await fheSdk.initSDK()
}

/**
 * Create an FHEVM client instance
 * @param options - Configuration options
 * @returns FHEVM client
 */
export async function createFHEVMClient(
  options: CreateFHEVMClientOptions = {},
): Promise<FHEVMClient> {
  if (!isBrowser()) {
    throw new Error('FHEVM client can only be created in the browser')
  }

  // Get provider (default to window.ethereum)
  const provider = options.provider || (window as any).ethereum
  if (!provider) {
    throw new Error('Ethereum provider not available')
  }

  // Use the helper function to import the full bundle
  const fheSdk = await importRelayerSDK()

  if (!fheSdk.createInstance) {
    throw new Error('createInstance function not available from FHEVM SDK')
  }

  // Get network config
  const networkConfig = await getNetworkConfig(options.network || 'sepolia')

  // Create instance
  const config = {
    ...networkConfig,
    network: provider,
  }

  const instance: FhevmInstance = await fheSdk.createInstance(config)

  // Return client with convenient API
  return {
    instance,
    isReady: true,
    encrypt: {
      uint8: (params: EncryptParams) => encryptUint8(instance, params),
      uint16: (params: EncryptParams) => encryptUint16(instance, params),
      uint32: (params: EncryptParams) => encryptUint32(instance, params),
      uint64: (params: EncryptParams) => encryptUint64(instance, params),
      uint128: (params: EncryptParams) => encryptUint128(instance, params),
      uint256: (params: EncryptParams) => encryptUint256(instance, params),
    },
    decrypt: (params: DecryptParams) => decryptForUser(instance, params),
  }
}
