---
sidebar_position: 2
---

# Encrypt API

Methods for encrypting values using Fully Homomorphic Encryption.

## Overview

All encryption methods follow the same pattern and are accessed via the client's `encrypt` property:

```typescript
const client = await createFHEVMClient({ network: 'sepolia' })

const encrypted = await client.encrypt.uint64({
  value: 1000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

## Common Parameters

All encryption methods accept the same parameters:

```typescript
interface EncryptParams {
  value: bigint
  contractAddress: string
  userAddress: string
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | `bigint` | Yes | The plaintext value to encrypt |
| contractAddress | `string` | Yes | Target contract address (0x-prefixed) |
| userAddress | `string` | Yes | User's Ethereum address (0x-prefixed) |

## Return Value

All encryption methods return:

```typescript
interface EncryptedValue {
  handle: Uint8Array
  proof: Uint8Array
}
```

| Property | Type | Description |
|----------|------|-------------|
| handle | `Uint8Array` | Ciphertext handle for the encrypted value |
| proof | `Uint8Array` | Cryptographic proof for verification |

## Encryption Methods

### client.encrypt.uint8

Encrypt an 8-bit unsigned integer (0 to 255).

```typescript
const encrypted = await client.encrypt.uint8({
  value: 42n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

**Use cases**: Boolean flags, small counters, enum values

### client.encrypt.uint16

Encrypt a 16-bit unsigned integer (0 to 65,535).

```typescript
const encrypted = await client.encrypt.uint16({
  value: 1000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

**Use cases**: Medium counters, item quantities, port numbers

### client.encrypt.uint32

Encrypt a 32-bit unsigned integer (0 to 4,294,967,295).

```typescript
const encrypted = await client.encrypt.uint32({
  value: 1000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

**Use cases**: Large counters, timestamps, prices in cents

### client.encrypt.uint64

Encrypt a 64-bit unsigned integer (0 to 18,446,744,073,709,551,615).

```typescript
const encrypted = await client.encrypt.uint64({
  value: 1000000000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

**Use cases**: Token balances, high-precision financial values

### client.encrypt.uint128

Encrypt a 128-bit unsigned integer.

```typescript
const encrypted = await client.encrypt.uint128({
  value: 1000000000000000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

**Use cases**: Very large token amounts, cross-chain values

### client.encrypt.uint256

Encrypt a 256-bit unsigned integer.

```typescript
const encrypted = await client.encrypt.uint256({
  value: 1000000000000000000000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

**Use cases**: Maximum precision, large cryptographic values

## Examples

### Token Transfer

```typescript
import { parseTokenAmount } from '@fhevmsdk/core'

const amount = parseTokenAmount('10.5', 18) // 10500000000000000000n

const encrypted = await client.encrypt.uint64({
  value: amount,
  contractAddress: tokenAddress,
  userAddress,
})

// Send to contract
await walletClient.writeContract({
  address: tokenAddress,
  abi: tokenABI,
  functionName: 'transfer',
  args: [recipientAddress, encrypted.handle, encrypted.proof],
})
```

### Batch Encryption

```typescript
const [amt1, amt2, amt3] = await Promise.all([
  client.encrypt.uint64({ value: 100n, contractAddress, userAddress }),
  client.encrypt.uint64({ value: 200n, contractAddress, userAddress }),
  client.encrypt.uint64({ value: 300n, contractAddress, userAddress }),
])
```

## Direct Encryption Functions

For advanced use cases, you can import encryption functions directly:

```typescript
import { encryptUint64 } from '@fhevmsdk/core'

const encrypted = await encryptUint64(fhevmInstance, {
  value: 1000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

Available functions:
- `encryptUint8`
- `encryptUint16`
- `encryptUint32`
- `encryptUint64`
- `encryptUint128`
- `encryptUint256`

:::caution
Direct functions require manual FHEVM instance management. Use client methods for most use cases.
:::


## Best Practices

```typescript
// ✅ Use the smallest type that fits your needs
await client.encrypt.uint8({ value: 1n, ... }) // For boolean

// ✅ Batch parallel operations
const results = await Promise.all([...])

// ❌ Avoid oversized types
await client.encrypt.uint256({ value: 1n, ... }) // Wasteful for small values
```

## See Also

- [Client API](./client) - Initialize FHEVM client
- [Decrypt API](./decrypt) - Decrypt encrypted values
