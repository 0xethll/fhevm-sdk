---
sidebar_position: 1
---

# Client API

Core functions for initializing and creating FHEVM clients.

## initFHEVM

Initialize the FHEVM SDK. Must be called once before using any other functionality.

```typescript
import { initFHEVM } from '@fhevmsdk/core'

await initFHEVM()
```

### Returns

`Promise<void>`

### Throws

- `Error` - If not running in a browser environment
- `Error` - If FHEVM SDK initialization fails

### Example

```typescript
import { initFHEVM } from '@fhevmsdk/core'

async function setup() {
  try {
    await initFHEVM()
    console.log('FHEVM initialized successfully')
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error)
  }
}
```

## createFHEVMClient

Create an FHEVM client instance for encryption and decryption operations.

```typescript
import { createFHEVMClient } from '@fhevmsdk/core'

const client = await createFHEVMClient({
  network: 'sepolia', // optional, defaults to 'sepolia'
  provider: window.ethereum, // optional, defaults to window.ethereum
})
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| options | `CreateFHEVMClientOptions` | No | `{}` | Client configuration options |

#### CreateFHEVMClientOptions

```typescript
interface CreateFHEVMClientOptions {
  network?: 'sepolia' | FhevmInstanceConfig
  provider?: any // window.ethereum or EIP-1193 provider
}
```

### Returns

`Promise<FHEVMClient>`

```typescript
interface FHEVMClient {
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
```

### Throws

- `Error` - If not running in a browser environment
- `Error` - If Ethereum provider is not available
- `Error` - If unknown network specified

### Examples

#### Basic Usage

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'

await initFHEVM()
const client = await createFHEVMClient({
  network: 'sepolia',
})

console.log('Client ready:', client.isReady)
```

#### Custom Provider

```typescript
import { createFHEVMClient } from '@fhevmsdk/core'

const client = await createFHEVMClient({
  network: 'sepolia',
  provider: customProvider, // Custom EIP-1193 provider
})
```

#### Custom Network Config

```typescript
import { createFHEVMClient } from '@fhevmsdk/core'
import type { FhevmInstanceConfig } from '@fhevmsdk/core'

const customConfig: FhevmInstanceConfig = {
  aclAddress: '0x...',
  gatewayUrl: 'https://gateway.example.com',
  publicKey: '...',
  chainId: 12345,
}

const client = await createFHEVMClient({
  network: customConfig,
})
```

## Type Exports

### FHEVMClient

```typescript
interface FHEVMClient {
  instance: FhevmInstance       // Raw FHEVM instance
  isReady: boolean               // Client initialization status
  encrypt: EncryptMethods        // Encryption methods
  decrypt: DecryptMethod         // Decryption method
}
```

### CreateFHEVMClientOptions

```typescript
interface CreateFHEVMClientOptions {
  network?: 'sepolia' | FhevmInstanceConfig
  provider?: any
}
```

### FhevmInstance

```typescript
type FhevmInstance = {
  // Internal FHEVM instance (from @zama-fhe/relayer-sdk)
}
```

## Related APIs

- [Encrypt API](./encrypt) - Encryption methods
- [Decrypt API](./decrypt) - Decryption method
- [Config API](./config) - Network configuration
- [Utils API](./utils) - Utility functions
