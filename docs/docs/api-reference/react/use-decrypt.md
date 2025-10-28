---
sidebar_position: 4
---

# useDecrypt

Hook for decrypting confidential values with user authorization.

## Usage

```tsx
import { useDecrypt } from '@fhevmsdk/react'

function Component() {
  const { decrypt, isDecrypting, canDecrypt } = useDecrypt()

  const handleDecrypt = async () => {
    const value = await decrypt({
      ciphertextHandle: '0xabcd...',
      contractAddress: '0x...',
    })
    console.log('Decrypted:', value)
  }

  return <button onClick={handleDecrypt}>Decrypt</button>
}
```

## Returns

```typescript
interface UseDecryptReturn {
  decrypt: (params: DecryptParams) => Promise<bigint>
  isDecrypting: boolean
  error: string | null
  canDecrypt: boolean
}
```

### Parameters

```typescript
interface DecryptParams {
  ciphertextHandle: string
  contractAddress: string
  // walletClient is automatic from Wagmi
}
```

## Examples

### Basic Decryption

```tsx
import { useDecrypt } from '@fhevmsdk/react'
import { useReadContract } from 'wagmi'

function BalanceDisplay() {
  const { decrypt, isDecrypting } = useDecrypt()
  const [balance, setBalance] = useState<bigint>()

  const { data: encryptedBalance } = useReadContract({
    address: tokenAddress,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const handleReveal = async () => {
    const decrypted = await decrypt({
      ciphertextHandle: encryptedBalance as string,
      contractAddress: tokenAddress,
    })
    setBalance(decrypted)
  }

  return (
    <div>
      {balance ? (
        <p>Balance: {balance.toString()}</p>
      ) : (
        <button onClick={handleReveal} disabled={isDecrypting}>
          {isDecrypting ? 'Revealing...' : 'Reveal Balance'}
        </button>
      )}
    </div>
  )
}
```

### With Formatted Display

```tsx
import { useDecrypt } from '@fhevmsdk/react'
import { formatTokenAmount } from '@fhevmsdk/core'

function FormattedBalance({ handle, contract }: Props) {
  const { decrypt } = useDecrypt()
  const [balance, setBalance] = useState<string>()

  const handleReveal = async () => {
    const value = await decrypt({
      ciphertextHandle: handle,
      contractAddress: contract,
    })
    const formatted = formatTokenAmount(value, 18)
    setBalance(formatted)
  }

  return (
    <div>
      {balance ? `${balance} tokens` : <button onClick={handleReveal}>Reveal</button>}
    </div>
  )
}
```

### Error Handling

```tsx
import { useDecrypt } from '@fhevmsdk/react'

function SafeDecrypt() {
  const { decrypt, error, canDecrypt } = useDecrypt()

  const handleDecrypt = async () => {
    if (!canDecrypt) {
      alert('Please connect your wallet')
      return
    }

    try {
      const value = await decrypt({ ciphertextHandle: '0x...', contractAddress: '0x...' })
      console.log('Success:', value)
    } catch (err) {
      if (err.message.includes('permission')) {
        alert('You do not have permission to decrypt this value')
      } else if (err.message.includes('rejected')) {
        alert('You cancelled the request')
      } else {
        console.error('Decryption failed:', err)
      }
    }
  }

  return (
    <div>
      <button onClick={handleDecrypt} disabled={!canDecrypt}>Decrypt</button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

## State Properties

### isDecrypting

`boolean` - True while decryption is in progress

```tsx
{isDecrypting && <Spinner />}
<button disabled={isDecrypting}>Decrypt</button>
```

### error

`string | null` - Error message if last decryption failed

```tsx
{error && <div className="error">{error}</div>}
```

### canDecrypt

`boolean` - True if FHEVM ready, wallet connected, and wallet client available

```tsx
<button disabled={!canDecrypt}>Decrypt</button>
{!canDecrypt && <p>Please connect wallet to decrypt</p>}
```

## Notes

- ✅ Automatically uses connected wallet for signing
- ✅ Prompts user to sign EIP-712 message
- ✅ Handles permission verification via ACL
- ⚠️ Requires ACL permission (granted by contract)
- ⚠️ User must approve each decryption request
- ⚠️ Must be used within `FHEVMProvider`

## See Also

- [Core Decrypt API](../core/decrypt) - Core decryption method
- [useEncrypt](./use-encrypt) - Encryption hook
- [useConfidentialBalance](./use-confidential-balance) - Higher-level balance hook
