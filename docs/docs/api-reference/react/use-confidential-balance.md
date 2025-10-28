---
sidebar_position: 5
---

# useConfidentialBalance

High-level hook for reading and revealing confidential token balances.

## Usage

```tsx
import { useConfidentialBalance } from '@fhevmsdk/react'

function BalanceDisplay() {
  const { decryptedBalance, revealBalance, isRevealing } = useConfidentialBalance({
    contractAddress: '0x...',
    abi: tokenABI,
  })

  return (
    <div>
      {decryptedBalance ? (
        <p>Balance: {decryptedBalance}</p>
      ) : (
        <button onClick={revealBalance}>Reveal Balance</button>
      )}
    </div>
  )
}
```

## Parameters

```typescript
interface Params {
  contractAddress: `0x${string}`
  abi: Abi
  functionName?: string  // default: 'confidentialBalanceOf'
  decimals?: number      // default: 6
}
```

## Returns

```typescript
interface Return {
  encryptedBalance: `0x${string}` | undefined
  decryptedBalance: bigint | null
  isVisible: boolean
  isLoading: boolean
  isDecrypting: boolean
  revealBalance: () => Promise<void>
  hideBalance: () => void
  formatBalance: (balance: bigint) => string
  refetch: () => Promise<unknown>
}
```

## Examples

### Complete Balance Component

```tsx
import { useConfidentialBalance } from '@fhevmsdk/react'
import { tokenABI } from './abi'

function TokenBalance() {
  const {
    decryptedBalance,
    isLoading,
    isDecrypting,
    revealBalance,
    hideBalance,
    formatBalance,
  } = useConfidentialBalance({
    contractAddress: '0x...',
    abi: tokenABI,
    decimals: 18,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h3>Your Balance</h3>
      {decryptedBalance ? (
        <>
          <p>{formatBalance(decryptedBalance)} tokens</p>
          <button onClick={hideBalance}>Hide</button>
        </>
      ) : (
        <button onClick={revealBalance} disabled={isDecrypting}>
          {isDecrypting ? 'Revealing...' : 'Reveal Balance'}
        </button>
      )}
    </div>
  )
}
```

### With Refresh

```tsx
function BalanceWithRefresh() {
  const { decryptedBalance, revealBalance, refetch, formatBalance } =
    useConfidentialBalance({
      contractAddress: '0x...',
      abi: tokenABI,
    })

  const handleRefresh = async () => {
    await refetch()
  }

  return (
    <div>
      {decryptedBalance && <p>{formatBalance(decryptedBalance)}</p>}
      <button onClick={revealBalance}>Reveal</button>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  )
}
```

### Custom Function Name

```tsx
const { decryptedBalance, revealBalance } = useConfidentialBalance({
  contractAddress: '0x...',
  abi: tokenABI,
  functionName: 'balanceOf', // Custom contract function
  decimals: 6,
})
```

## Notes

- ✅ Automatically fetches balance from contract
- ✅ Provides formatted balance display
- ✅ Clears decrypted balance when address or encrypted balance changes
- ✅ Integrates with Wagmi for contract reading
- ⚠️ Requires wallet connection
- ⚠️ Must be used within `FHEVMProvider` and `WagmiProvider`

## See Also

- [useDecrypt](./use-decrypt) - Lower-level decryption hook
- [useConfidentialTransfer](./use-confidential-transfer) - Transfer hook
