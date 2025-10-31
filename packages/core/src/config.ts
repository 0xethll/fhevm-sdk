import type { FhevmInstanceConfig } from '@zama-fhe/relayer-sdk/bundle';
import { isBrowser } from './utils';

/**
 * Get network configuration
 * Dynamically imports from the correct relayer-sdk module based on environment
 */
export async function getNetworkConfig(
  network: 'sepolia' | FhevmInstanceConfig,
): Promise<FhevmInstanceConfig> {
  if (typeof network === 'string') {
    switch (network) {
      case 'sepolia': {
        // Import from correct module based on environment
        if (isBrowser()) {
          const { SepoliaConfig } = await import('@zama-fhe/relayer-sdk/web')
          return SepoliaConfig
        } else {
          const { SepoliaConfig } = await import('@zama-fhe/relayer-sdk/node')
          return SepoliaConfig
        }
      }
      default:
        throw new Error(`Unknown network: ${network}`)
    }
  }
  return network
}
