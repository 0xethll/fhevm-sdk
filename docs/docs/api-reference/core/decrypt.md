---
sidebar_position: 3
---

# Decrypt API

Method for decrypting confidential values with user authorization.

## client.decrypt

Decrypt an encrypted value using user's signature for authorization.

```typescript
const decrypted = await client.decrypt({
  ciphertextHandle: '0xabcd...',
  contractAddress: '0x...',
  walletClient,
})
```

### Parameters

```typescript
interface DecryptParams {
  ciphertextHandle: string
  contractAddress: string
  walletClient: ViemWalletClient
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ciphertextHandle | `string` | Yes | The ciphertext handle to decrypt (0x-prefixed hex) |
| contractAddress | `string` | Yes | Contract address that owns the encrypted data |
| walletClient | `ViemWalletClient` | Yes | Viem wallet client for signing |

### ViemWalletClient

```typescript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})
```

The wallet client must have an `account` property. It's used for:
1. Getting the user's address
2. Signing EIP-712 typed data for authorization

### Returns

`Promise<bigint>` - The decrypted value as a bigint

### Throws

- **Permission Error** - User doesn't have ACL permission to decrypt
- **Signature Error** - User rejected signature or signature invalid
- **Gateway Error** - Decryption gateway unavailable
- **Invalid Handle** - Ciphertext handle not found or invalid

### Examples

#### Basic Decryption

```typescript
import { createFHEVMClient } from '@fhevmsdk/core'
import { createWalletClient, createPublicClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'

// Setup
const client = await createFHEVMClient({ network: 'sepolia' })
const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

// Get encrypted balance from contract
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

const encryptedBalance = await publicClient.readContract({
  address: contractAddress,
  abi: tokenABI,
  functionName: 'balanceOf',
  args: [userAddress],
})

// Decrypt (prompts user to sign)
const balance = await client.decrypt({
  ciphertextHandle: encryptedBalance,
  contractAddress,
  walletClient,
})

console.log('Balance:', balance) // 1000n
```

#### With Error Handling

```typescript
try {
  const decrypted = await client.decrypt({
    ciphertextHandle: handle,
    contractAddress,
    walletClient,
  })
  console.log('Decrypted value:', decrypted)
} catch (error) {
  if (error.message.includes('permission') || error.message.includes('ACL')) {
    console.error('You do not have permission to decrypt this value')
  } else if (error.message.includes('rejected')) {
    console.error('You cancelled the decryption request')
  } else if (error.message.includes('gateway')) {
    console.error('Decryption service temporarily unavailable')
  } else {
    console.error('Decryption failed:', error)
  }
}
```


#### Display Formatted Value

```typescript
import { formatTokenAmount } from '@fhevmsdk/core'

const balance = await client.decrypt({
  ciphertextHandle: encryptedBalance,
  contractAddress,
  walletClient,
})

const formatted = formatTokenAmount(balance, 18)
console.log(`Balance: ${formatted} tokens`) // "Balance: 1.5 tokens"
```

## Decryption Process

When you call `client.decrypt()`:

1. **Generate Keypair** - Temporary keypair created for this request
2. **Create EIP-712 Message** - Typed data prepared for signing
3. **User Signs** - Wallet prompts user to sign authorization
4. **Send to Gateway** - Signed request sent to decryption gateway
5. **Verify Permission** - Gateway checks on-chain ACL
6. **Decrypt** - If authorized, gateway decrypts and returns value
7. **Return Result** - Decrypted value returned as bigint

## EIP-712 Signature

The user signs an EIP-712 typed data message:

```typescript
{
  domain: {
    name: 'Authorization token',
    version: '1',
    chainId: 11155111,
    verifyingContract: '0x...'
  },
  message: {
    publicKey: '0x...',      // Temporary public key
    contractAddresses: [...], // Authorized contracts
    timestamp: '1234567890',  // Request timestamp
    duration: '10'            // Validity period (days)
  }
}
```

This signature proves the user authorizes decryption without revealing their private key.

## Access Control

Decryption only succeeds if:

1. ✅ User has ACL permission (granted by contract)
2. ✅ User signs the decryption request
3. ✅ Gateway is available
4. ✅ Handle is valid and exists

If the contract didn't grant permission:

```solidity
// Contract must call this:
TFHE.allow(encryptedValue, userAddress);
```

## Direct Decryption Function

For advanced use cases:

```typescript
import { decryptForUser } from '@fhevmsdk/core'

const decrypted = await decryptForUser(fhevmInstance, {
  ciphertextHandle: '0x...',
  contractAddress: '0x...',
  walletClient,
})
```

:::caution
Requires manual FHEVM instance. Use client method for most cases.
:::

## Best Practices

```typescript
// ✅ Cache decrypted values
const [balance, setBalance] = useState<bigint>()

if (!balance) {
  const value = await client.decrypt({ ... })
  setBalance(value)
}

// ✅ Handle errors gracefully
try {
  const value = await client.decrypt({ ... })
} catch (error) {
  // Show user-friendly error message
}

// ❌ Don't decrypt repeatedly
// Bad: Decrypting on every render
const value = await client.decrypt({ ... }) // Prompts user each time!
```

## See Also

- [Client API](./client) - Initialize FHEVM client
- [Encrypt API](./encrypt) - Encrypt values