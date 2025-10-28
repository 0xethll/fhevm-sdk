---
sidebar_position: 3
---

# useEncrypt

Hook for encrypting values for confidential contracts.

## Usage

```tsx
import { useEncrypt } from '@fhevmsdk/react'

function Component() {
  const { encryptUint64, isEncrypting, error } = useEncrypt()

  const handleEncrypt = async () => {
    const result = await encryptUint64({
      value: 1000n,
      contractAddress: '0x...',
    })
    console.log('Encrypted:', result.data)
  }

  return <button onClick={handleEncrypt}>Encrypt</button>
}
```

## Returns

```typescript
interface UseEncryptReturn {
  encryptUint8: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint16: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint32: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint64: (params: EncryptedParams) => Promise<EncryptedUint>
  encryptUint128: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint256: (params: EncryptParams) => Promise<EncryptedUint>
  isEncrypting: boolean
  error: string | null
  canEncrypt: boolean
}
```

### Parameters

```typescript
type EncryptParams = {
  value: bigint
  contractAddress: string
  // userAddress is automatic from connected wallet
}
```

### Return Type

```typescript
type EncryptedUint = {
  data: `0x${string}`   // Ciphertext handle
  proof: `0x${string}`  // Cryptographic proof
}
```

## Examples

### Basic Encryption

```tsx
import { useEncrypt } from '@fhevmsdk/react'

function TransferForm() {
  const { encryptUint64, isEncrypting, canEncrypt } = useEncrypt()

  const handleSubmit = async () => {
    const encrypted = await encryptUint64({
      value: 1000000n,
      contractAddress: tokenAddress,
    })

    await contract.transfer(recipient, encrypted.handle, encrypted.proof)
  }

  return (
    <button onClick={handleSubmit} disabled={isEncrypting || !canEncrypt}>
      {isEncrypting ? 'Encrypting...' : 'Transfer'}
    </button>
  )
}
```

### With User Input

```tsx
import { useEncrypt } from '@fhevmsdk/react'
import { parseTokenAmount } from '@fhevmsdk/core'
import { useState } from 'react'

function DepositForm() {
  const [amount, setAmount] = useState('')
  const { encryptUint64, isEncrypting, error } = useEncrypt()

  const handleDeposit = async () => {
    const amountBigInt = parseTokenAmount(amount, 18)

    const encrypted = await encryptUint64({
      value: amountBigInt,
      contractAddress: vaultAddress,
    })

    await vaultContract.deposit(encrypted.handle, encrypted.proof)
  }

  return (
    <div>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleDeposit} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Deposit'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

### Error Handling

```tsx
function SafeEncrypt() {
  const { encryptUint64, error, canEncrypt } = useEncrypt()

  const handleEncrypt = async () => {
    if (!canEncrypt) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const result = await encryptUint64({
        value: 1000n,
        contractAddress: '0x...',
      })
      console.log('Success:', result)
    } catch (err) {
      console.error('Encryption failed:', err)
    }
  }

  return (
    <div>
      <button onClick={handleEncrypt} disabled={!canEncrypt}>
        Encrypt
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!canEncrypt && <p>Please connect wallet to encrypt</p>}
    </div>
  )
}
```

## All Encryption Methods

### encryptUint8

```tsx
const result = await encryptUint8({
  value: 42n, // 0-255
  contractAddress: '0x...',
})
```

### encryptUint16

```tsx
const result = await encryptUint16({
  value: 1000n, // 0-65535
  contractAddress: '0x...',
})
```

### encryptUint32

```tsx
const result = await encryptUint32({
  value: 1000000n, // 0-4294967295
  contractAddress: '0x...',
})
```

### encryptUint64

```tsx
const result = await encryptUint64({
  value: 1000000000n, // Large numbers
  contractAddress: '0x...',
})
```

### encryptUint128

```tsx
const result = await encryptUint128({
  value: 10000000000000000n,
  contractAddress: '0x...',
})
```

### encryptUint256

```tsx
const result = await encryptUint256({
  value: 100000000000000000000n,
  contractAddress: '0x...',
})
```

## State Properties

### isEncrypting

`boolean` - True while any encryption is in progress

```tsx
{isEncrypting && <Spinner />}
<button disabled={isEncrypting}>Encrypt</button>
```

### error

`string | null` - Error message if last encryption failed

```tsx
{error && <div className="error">{error}</div>}
```

### canEncrypt

`boolean` - True if FHEVM is ready and wallet is connected

```tsx
<button disabled={!canEncrypt}>Encrypt</button>
```

## Notes

- ✅ Automatically uses connected wallet address
- ✅ Returns hex strings ready for contract calls
- ✅ Handles loading and error states
- ⚠️ Requires wallet connection (`canEncrypt` false if no wallet)
- ⚠️ Must be used within `FHEVMProvider`

## See Also

- [Core Encrypt API](../core/encrypt) - Core encryption methods
- [useDecrypt](./use-decrypt) - Decryption hook
