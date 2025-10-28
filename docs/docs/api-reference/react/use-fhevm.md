---
sidebar_position: 2
---

# useFHEVM

Hook to access FHEVM client and initialization status.

## Usage

```tsx
import { useFHEVM } from '@fhevmsdk/react'

function Component() {
  const { client, isReady, error, retry } = useFHEVM()

  if (!isReady) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>FHEVM Ready!</div>
}
```

## Returns

```typescript
interface UseFHEVMReturn {
  client: FHEVMClient | null
  isReady: boolean
  error: string | null
  retry: () => void
}
```

| Property | Type | Description |
|----------|------|-------------|
| client | `FHEVMClient \| null` | FHEVM client instance (null if not ready) |
| isReady | `boolean` | Whether FHEVM is initialized and ready |
| error | `string \| null` | Error message if initialization failed |
| retry | `() => void` | Function to retry initialization |

## Examples

### Loading State

```tsx
function App() {
  const { isReady } = useFHEVM()

  if (!isReady) {
    return (
      <div className="loading">
        <Spinner />
        <p>Initializing FHEVM...</p>
      </div>
    )
  }

  return <Dashboard />
}
```

### Error Handling

```tsx
function App() {
  const { isReady, error, retry } = useFHEVM()

  if (error) {
    return (
      <div className="error">
        <h3>Initialization Failed</h3>
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )
  }

  if (!isReady) return <div>Loading...</div>

  return <Dashboard />
}
```

### Using Client Directly

```tsx
function EncryptButton() {
  const { client, isReady } = useFHEVM()
  const { address } = useAccount()

  const handleEncrypt = async () => {
    if (!isReady || !client || !address) return

    const encrypted = await client.encrypt.uint64({
      value: 1000n,
      contractAddress: '0x...',
      userAddress: address,
    })

    console.log('Encrypted:', encrypted)
  }

  return (
    <button onClick={handleEncrypt} disabled={!isReady}>
      Encrypt
    </button>
  )
}
```

## Common Patterns

### Conditional Rendering

```tsx
function Component() {
  const { isReady, error } = useFHEVM()

  if (error) return <ErrorDisplay error={error} />
  if (!isReady) return <LoadingSpinner />

  return <MainContent />
}
```


## Notes

- ✅ Must be used within `FHEVMProvider`
- ✅ Returns same instance globally (singleton)
- ✅ Automatically tracks initialization state
- ⚠️ `client` is null until `isReady` is true

## See Also

- [FHEVMProvider](./provider) - Context provider
- [useEncrypt](./use-encrypt) - Encryption hook
- [useDecrypt](./use-decrypt) - Decryption hook
