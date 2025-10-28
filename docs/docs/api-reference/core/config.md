---
sidebar_position: 4
---

# Config API

Network configuration utilities for FHEVM.

## getNetworkConfig

Get the configuration for a specific network.

```typescript
import { getNetworkConfig } from '@fhevmsdk/core'

const config = await getNetworkConfig('sepolia')
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| network | `'sepolia' \| FhevmInstanceConfig` | Network name or custom config |

### Returns

`Promise<FhevmInstanceConfig>`

```typescript
interface FhevmInstanceConfig {
  aclAddress: string      // Access Control List contract address
  gatewayUrl: string      // Decryption gateway URL
  publicKey: string       // FHE public key
  chainId: number         // Blockchain chain ID
}
```

### Examples

#### Get Sepolia Config

```typescript
import { getNetworkConfig } from '@fhevmsdk/core'

const sepoliaConfig = await getNetworkConfig('sepolia')

console.log('ACL Address:', sepoliaConfig.aclAddress)
console.log('Gateway URL:', sepoliaConfig.gatewayUrl)
console.log('Chain ID:', sepoliaConfig.chainId)
```

#### Use Custom Config

```typescript
import { getNetworkConfig } from '@fhevmsdk/core'
import type { FhevmInstanceConfig } from '@fhevmsdk/core'

const customConfig: FhevmInstanceConfig = {
  aclAddress: '0x1234...',
  gatewayUrl: 'https://my-gateway.example.com',
  publicKey: 'custom-public-key',
  chainId: 12345,
}

const config = await getNetworkConfig(customConfig)
// Returns the same customConfig
```

## Supported Networks

### Sepolia Testnet

```typescript
const config = await getNetworkConfig('sepolia')
```

Default testnet for FHEVM development.

## Type Exports

### FhevmInstanceConfig

```typescript
interface FhevmInstanceConfig {
  aclAddress: string      // ACL contract address
  gatewayUrl: string      // Gateway endpoint
  publicKey: string       // Encryption public key
  chainId: number         // Network chain ID
}
```

## Usage in Client Creation

```typescript
import { createFHEVMClient, getNetworkConfig } from '@fhevmsdk/core'

// Automatic (recommended)
const client = await createFHEVMClient({
  network: 'sepolia', // Uses built-in config
})

// Manual
const config = await getNetworkConfig('sepolia')
const client = await createFHEVMClient({
  network: config,
})

// Custom network
const customConfig = await getNetworkConfig({
  aclAddress: '0x...',
  gatewayUrl: 'https://...',
  publicKey: '...',
  chainId: 12345,
})

const client = await createFHEVMClient({
  network: customConfig,
})
```

## See Also

- [Client API](./client) - Create FHEVM client
- [Network Configuration Guide](../../guides/network-configuration) - Detailed network setup
