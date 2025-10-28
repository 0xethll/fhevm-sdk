---
sidebar_position: 1
---

# FHEVMProvider

React context provider for FHEVM SDK initialization and state management.

## FHEVMProvider

Wrap your application with `FHEVMProvider` to initialize FHEVM and make it available to all child components.

```tsx
import { FHEVMProvider } from '@fhevmsdk/react'

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <YourApp />
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Child components |
| network | `'sepolia'` | `'sepolia'` | Network to connect to |
| config | `CreateFHEVMClientOptions` | - | Custom FHEVM config (overrides network) |

### Examples

#### Basic Usage

```tsx
import { FHEVMProvider } from '@fhevmsdk/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './wagmi-config'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <Dashboard />
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

#### Custom Config

```tsx
import { FHEVMProvider } from '@fhevmsdk/react'

const customConfig = {
  network: {
    aclAddress: '0x...',
    gatewayUrl: 'https://custom-gateway.example.com',
    publicKey: '...',
    chainId: 12345,
  },
}

function App() {
  return (
    <FHEVMProvider config={customConfig}>
      <YourApp />
    </FHEVMProvider>
  )
}
```

## useFHEVMContext

Low-level hook to access FHEVM context. **Use [`useFHEVM`](./use-fhevm) instead for most cases.**

```tsx
import { useFHEVMContext } from '@fhevmsdk/react'

function Component() {
  const { client, isReady, error, retry } = useFHEVMContext()
  // ...
}
```

### Returns

```typescript
interface FHEVMContextType {
  client: FHEVMClient | null
  isReady: boolean
  error: string | null
  retry: () => void
}
```

### Throws

`Error` - If used outside of `FHEVMProvider`

## Complete Example

```tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider, useFHEVM } from '@fhevmsdk/react'
import { config } from './wagmi-config'

const queryClient = new QueryClient()

function Dashboard() {
  const { isReady, error, retry } = useFHEVM()

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )
  }

  if (!isReady) {
    return <div>Initializing FHEVM...</div>
  }

  return <div>FHEVM Ready!</div>
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <Dashboard />
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Notes

- ✅ Initializes FHEVM once globally (singleton pattern)
- ✅ Handles loading and error states automatically
- ✅ Provides retry mechanism for failed initialization
- ✅ Must be wrapped by Wagmi and QueryClient providers
- ⚠️ Requires `window.ethereum` (MetaMask or compatible wallet)

## See Also

- [useFHEVM Hook](./use-fhevm) - Main hook for accessing FHEVM
- [Quick Start](../../getting-started/quick-start-react) - Setup guide
