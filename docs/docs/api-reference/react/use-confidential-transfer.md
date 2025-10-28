---
sidebar_position: 6
---

# useConfidentialTransfer

High-level hook for executing confidential token transfers.

## Usage

```tsx
import { useConfidentialTransfer } from '@fhevmsdk/react'

function TransferForm() {
  const { transfer, isLoading, isSuccess } = useConfidentialTransfer({
    contractAddress: '0x...',
    abi: tokenABI,
  })

  const handleTransfer = async () => {
    await transfer({
      to: '0xRecipient...',
      amount: '10.5',
    })
  }

  return <button onClick={handleTransfer} disabled={isLoading}>Transfer</button>
}
```

## Parameters

```typescript
interface Params {
  contractAddress: `0x${string}`
  abi: Abi
  functionName?: string  // default: 'confidentialTransfer'
  decimals?: number      // default: 6
}
```

## Returns

```typescript
interface Return {
  transfer: (params: TransferParams) => Promise<void>
  isLoading: boolean
  isPreparingTx: boolean
  isEncrypting: boolean
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  txHash: `0x${string}` | undefined
  error: string | null
  reset: () => void
  canTransfer: boolean
}
```

### TransferParams

```typescript
interface TransferParams {
  to: string           // Recipient address
  amount: string | bigint  // Amount as string "10.5" or bigint
}
```

## Examples

### Complete Transfer Form

```tsx
import { useConfidentialTransfer } from '@fhevmsdk/react'
import { useState } from 'react'

function TransferForm() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const {
    transfer,
    isLoading,
    isSuccess,
    txHash,
    error,
    reset,
    canTransfer,
  } = useConfidentialTransfer({
    contractAddress: '0x...',
    abi: tokenABI,
    decimals: 18,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await transfer({ to, amount })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Recipient address"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button type="submit" disabled={!canTransfer || isLoading}>
        {isLoading ? 'Processing...' : 'Transfer'}
      </button>
      {isSuccess && <p>Success! TX: {txHash}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

### With Status Tracking

```tsx
function TransferWithStatus() {
  const {
    transfer,
    isPreparingTx,
    isEncrypting,
    isPending,
    isConfirming,
    isSuccess,
  } = useConfidentialTransfer({ contractAddress: '0x...', abi: tokenABI })

  const getStatus = () => {
    if (isPreparingTx) return 'Preparing transaction...'
    if (isEncrypting) return 'Encrypting amount...'
    if (isPending) return 'Waiting for confirmation...'
    if (isConfirming) return 'Confirming on blockchain...'
    if (isSuccess) return 'Transfer complete!'
    return 'Ready'
  }

  return (
    <div>
      <p>Status: {getStatus()}</p>
      <button onClick={() => transfer({ to: '0x...', amount: '10' })}>
        Transfer
      </button>
    </div>
  )
}
```

### BigInt Amount

```tsx
const { transfer } = useConfidentialTransfer({
  contractAddress: '0x...',
  abi: tokenABI,
})

// Use bigint directly
await transfer({
  to: '0xRecipient...',
  amount: 1000000n,
})
```

### Custom Function

```tsx
const { transfer } = useConfidentialTransfer({
  contractAddress: '0x...',
  abi: tokenABI,
  functionName: 'transfer', // Custom function name
  decimals: 6,
})
```

## State Properties

| Property | Type | Description |
|----------|------|-------------|
| isLoading | boolean | Overall loading state |
| isPreparingTx | boolean | Preparing transaction |
| isEncrypting | boolean | Encrypting amount |
| isPending | boolean | Waiting for user confirmation |
| isConfirming | boolean | Confirming on blockchain |
| isSuccess | boolean | Transfer completed |
| txHash | string | Transaction hash (when submitted) |
| error | string \| null | Error message |
| canTransfer | boolean | Whether transfer can be executed |

## Error Messages

The hook provides user-friendly error messages:

- "Insufficient balance to complete this transfer"
- "Transaction was rejected by user"
- "Insufficient funds to pay for gas fees"
- "Transaction failed. Please try again."

## Notes

- ✅ Handles complete transfer flow (encrypt + submit + confirm)
- ✅ Validates recipient address
- ✅ Parses string amounts automatically
- ✅ Provides granular loading states
- ✅ User-friendly error messages
- ⚠️ Requires wallet connection
- ⚠️ Must be used within `FHEVMProvider` and `WagmiProvider`

## See Also

- [useEncrypt](./use-encrypt) - Encryption hook
- [useConfidentialBalance](./use-confidential-balance) - Balance hook
