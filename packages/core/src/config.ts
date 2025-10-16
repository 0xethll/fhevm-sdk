import { SepoliaConfig, FhevmInstanceConfig } from '@zama-fhe/relayer-sdk/bundle';


/**
 * Get network configuration
 */
export function getNetworkConfig(
  network: 'sepolia' | FhevmInstanceConfig,
): FhevmInstanceConfig {
  if (typeof network === 'string') {
    switch (network) {
      case 'sepolia':
        return SepoliaConfig
      default:
        throw new Error(`Unknown network: ${network}`)
    }
  }
  return network
}
