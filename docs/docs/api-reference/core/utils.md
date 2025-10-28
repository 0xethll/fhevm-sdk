---
sidebar_position: 5
---

# Utils API

Utility functions for working with token amounts and data conversion.

## formatTokenAmount

Format a bigint token amount for display.

```typescript
import { formatTokenAmount } from '@fhevmsdk/core'

const formatted = formatTokenAmount(1500000n, 6)
console.log(formatted) // "1.5"
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| amount | `bigint` | - | Amount in smallest unit |
| decimals | `number` | `6` | Number of decimal places |

### Returns

`string` - Formatted amount with trailing zeros removed

### Examples

```typescript
// With 18 decimals (like ETH)
formatTokenAmount(1500000000000000000n, 18) // "1.5"

// With 6 decimals (like USDC)
formatTokenAmount(1500000n, 6) // "1.5"

// Whole numbers
formatTokenAmount(1000000n, 6) // "1"

// Very small amounts
formatTokenAmount(1n, 18) // "0.000000000000000001"
```

## parseTokenAmount

Parse a string amount to bigint in smallest unit.

```typescript
import { parseTokenAmount } from '@fhevmsdk/core'

const amount = parseTokenAmount('1.5', 6)
console.log(amount) // 1500000n
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| amount | `string` | - | Amount as string (e.g., "10.5") |
| decimals | `number` | `6` | Number of decimal places |

### Returns

`bigint` - Amount in smallest unit

### Examples

```typescript
// With 18 decimals (like ETH)
parseTokenAmount('1.5', 18) // 1500000000000000000n

// With 6 decimals (like USDC)
parseTokenAmount('1.5', 6) // 1500000n

// Whole numbers
parseTokenAmount('10', 6) // 10000000n

// Many decimal places
parseTokenAmount('0.123456', 6) // 123456n

// Excess decimals are truncated
parseTokenAmount('1.123456789', 6) // 1123456n
```

## uint8ArrayToHex

Convert a Uint8Array to a hex string.

```typescript
import { uint8ArrayToHex } from '@fhevmsdk/core'

const hex = uint8ArrayToHex(new Uint8Array([1, 2, 3]))
console.log(hex) // "0x010203"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| arr | `Uint8Array` | The byte array to convert |

### Returns

`` `0x${string}` `` - Hex string with 0x prefix

### Examples

```typescript
const bytes = new Uint8Array([255, 128, 0])
const hex = uint8ArrayToHex(bytes)
console.log(hex) // "0xff8000"

// Convert encrypted handle
const encrypted = await client.encrypt.uint64({ ... })
const handleHex = uint8ArrayToHex(encrypted.handle)
console.log(handleHex) // "0xabcdef..."
```

## isBrowser

Check if code is running in a browser environment.

```typescript
import { isBrowser } from '@fhevmsdk/core'

if (isBrowser()) {
  console.log('Running in browser')
} else {
  console.log('Running in Node.js')
}
```

### Returns

`boolean` - `true` if in browser, `false` otherwise

### Examples

```typescript
import { isBrowser } from '@fhevmsdk/core'

// Conditional initialization
if (isBrowser()) {
  await initFHEVM()
} else {
  console.warn('FHEVM only works in browser')
}
```

## Complete Examples

### Token Transfer Form

```typescript
import { parseTokenAmount, formatTokenAmount } from '@fhevmsdk/core'

function TokenTransfer() {
  const [amount, setAmount] = useState('')

  const handleTransfer = async () => {
    // Parse user input
    const amountBigInt = parseTokenAmount(amount, 18)

    // Encrypt
    const encrypted = await client.encrypt.uint64({
      value: amountBigInt,
      contractAddress,
      userAddress,
    })

    // Send transaction
    await contract.transfer(recipientAddress, encrypted.handle, , encrypted.proof)
  }

  return (
    <input
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Amount (e.g., 1.5)"
    />
  )
}
```

### Display Balance

```typescript
import { formatTokenAmount } from '@fhevmsdk/core'

async function displayBalance() {
  const balanceBigInt = await client.decrypt({
    ciphertextHandle: encryptedBalance,
    contractAddress,
    walletClient,
  })

  const formatted = formatTokenAmount(balanceBigInt, 18)
  console.log(`Your balance: ${formatted} tokens`)
}
```

## Type Safety

All utility functions are fully typed:

```typescript
// ✅ Type-safe
const amount: bigint = parseTokenAmount('1.5', 18)
const formatted: string = formatTokenAmount(amount, 18)
const hex: `0x${string}` = uint8ArrayToHex(new Uint8Array([1, 2, 3]))

// ❌ TypeScript errors
const amount = parseTokenAmount(1.5, 18) // Error: expects string
const hex = uint8ArrayToHex([1, 2, 3]) // Error: expects Uint8Array
```

## See Also

- [Client API](./client) - FHEVM client
- [Encrypt API](./encrypt) - Encryption methods
- [Decrypt API](./decrypt) - Decryption method
