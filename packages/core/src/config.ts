import type { FhevmInstanceConfig } from '@zama-fhe/relayer-sdk/bundle';

/**
 * Get network configuration
 */
export async function getNetworkConfig(
  network: 'sepolia' | FhevmInstanceConfig,
): Promise<FhevmInstanceConfig> {
  if (typeof network === 'string') {
    switch (network) {
      case 'sepolia': {
        const { SepoliaConfig } = await import('@zama-fhe/relayer-sdk/web')
        return SepoliaConfig
      }
      default:
        throw new Error(`Unknown network: ${network}`)
    }
  }
  return network
}
