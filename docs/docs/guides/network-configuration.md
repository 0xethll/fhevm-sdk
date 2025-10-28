---
sidebar_position: 5
---

# Network Configuration

Configure FHEVM SDK for different networks.

## Supported Networks

### Sepolia Testnet (Default)

```typescript
// React
<FHEVMProvider network="sepolia">

// Vue
setupFHEVM({ network: 'sepolia' })

// Core
const client = await createFHEVMClient({ network: 'sepolia' })
```

## Custom Network

For custom or private networks:

```typescript
import type { FhevmInstanceConfig } from '@fhevmsdk/core'

const customConfig: FhevmInstanceConfig = {
  aclAddress: '0x...',
  gatewayUrl: 'https://gateway.example.com',
  publicKey: '...',
  chainId: 12345,
}

// React
<FHEVMProvider config={{ network: customConfig }}>

// Vue
setupFHEVM({ network: customConfig })

// Core
const client = await createFHEVMClient({ network: customConfig })
```

## Get Network Config

```typescript
import { getNetworkConfig } from '@fhevmsdk/core'

const config = await getNetworkConfig('sepolia')
console.log('Gateway:', config.gatewayUrl)
console.log('ACL:', config.aclAddress)
```
