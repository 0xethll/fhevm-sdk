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

/**
 * Helper function to import the relayer SDK at runtime
 * Automatically selects the correct version based on environment:
 * - Browser: Uses /web (with WASM initialization)
 * - Node.js: Uses /node (native WASM bindings)
 */
async function importRelayerSDK(): Promise<any> {
  if (isBrowser()) {
    // Browser environment: use web version with WASM
    return await import('@zama-fhe/relayer-sdk/web')
  } else {
    // Node.js environment: use node version with native bindings
    return await import('@zama-fhe/relayer-sdk/node')
  }
}

/**
 * Initialize the FHEVM SDK
 * Must be called before creating any FHEVM instances
 *
 * Note: Only required in browser environments. Node.js environments
 * automatically initialize WASM modules during import.
 */
export async function initFHEVM(): Promise<void> {
  const fheSdk = await importRelayerSDK()

  // Only browser environment requires explicit initialization
  if (isBrowser()) {
    if (!fheSdk.initSDK) {
      throw new Error('initSDK function not available from FHEVM SDK')
    }
    await fheSdk.initSDK()
  }
  // Node.js: WASM modules are auto-initialized via global.TFHE/TKMS
}

/**
 * Create an FHEVM client instance
 * @param options - Configuration options
 * @returns FHEVM client
 *
 * Supports both browser and Node.js environments:
 * - Browser: Uses window.ethereum by default
 * - Node.js: Requires explicit provider (RPC URL string)
 */
export async function createFHEVMClient(
  options: CreateFHEVMClientOptions = {},
): Promise<FHEVMClient> {
  // Get provider based on environment
  let provider: any

  if (isBrowser()) {
    // Browser: default to window.ethereum
    provider = options.provider || (window as any).ethereum
    if (!provider) {
      throw new Error(
        'Ethereum provider not available. Please provide options.provider or install a wallet extension.',
      )
    }
  } else {
    // Node.js: must provide explicit provider (RPC URL or custom provider)
    provider = options.provider
    if (!provider) {
      throw new Error(
        'Node.js environment requires explicit provider. Please provide options.provider (RPC URL string or EIP-1193 provider).',
      )
    }
  }

  // Use the helper function to import the correct SDK version
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
