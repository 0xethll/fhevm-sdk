---
sidebar_position: 2
---

# React Quick Start

Build your first confidential dApp with React and FHEVM SDK in under 10 minutes.

## Installation

First, install the required packages:

```bash
pnpm install @fhevmsdk/core @fhevmsdk/react wagmi @tanstack/react-query viem
```

## Setup Wagmi

FHEVM SDK for React integrates seamlessly with Wagmi. First, configure your Wagmi client:

```typescript
// config/wagmi.ts
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
})
```

## Wrap Your App with Providers

Wrap your application with both `WagmiProvider` and `FHEVMProvider`:

```tsx
// App.tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevmsdk/react'
import { config } from './config/wagmi'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <YourApp />
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

## Use FHEVM Hooks

Now you can use FHEVM hooks in your components:

### Check FHEVM Status

```tsx
import { useFHEVM } from '@fhevmsdk/react'

function StatusDisplay() {
  const { isReady, isLoading, error } = useFHEVM()

  if (isLoading) return <div>Initializing FHEVM...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!isReady) return <div>FHEVM not ready</div>

  return <div>✅ FHEVM is ready!</div>
}
```

### Encrypt Data

```tsx
import { useEncrypt } from '@fhevmsdk/react'
import { useState } from 'react'

function EncryptExample() {
  const { encrypt } = useEncrypt()
  const [amount, setAmount] = useState('')
  const [encrypted, setEncrypted] = useState<string>()

  const handleEncrypt = async () => {
    const result = await encrypt.uint64({
      value: BigInt(amount),
      contractAddress: '0x...',
      userAddress: '0x...',
    })
    setEncrypted(result.data)
  }

  return (
    <div>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      {encrypted && <p>Encrypted: {encrypted}</p>}
    </div>
  )
}
```

### View Confidential Balance

```tsx
import { useConfidentialBalance } from '@fhevmsdk/react'
import { tokenABI } from './abi'

function BalanceDisplay() {
  const { decryptedBalance, revealBalance, isRevealing } =
    useConfidentialBalance({
      contractAddress: '0x1234567890123456789012345678901234567890',
      abi: tokenABI,
    })

  return (
    <div>
      {decryptedBalance ? (
        <p>Balance: {decryptedBalance}</p>
      ) : (
        <button onClick={revealBalance} disabled={isRevealing}>
          {isRevealing ? 'Revealing...' : 'Reveal Balance'}
        </button>
      )}
    </div>
  )
}
```

### Transfer Confidential Tokens

```tsx
import { useConfidentialTransfer } from '@fhevmsdk/react'
import { useState } from 'react'
import { tokenABI } from './abi'

function TransferForm() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const { transfer, isLoading, isSuccess, error } = useConfidentialTransfer({
    contractAddress: '0x1234567890123456789012345678901234567890',
    abi: tokenABI,
  })

  const handleTransfer = async () => {
    await transfer({
      to,
      amount,
    })
  }

  return (
    <div>
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
      <button onClick={handleTransfer} disabled={isLoading}>
        {isLoading ? 'Transferring...' : 'Transfer'}
      </button>
      {isSuccess && <p>✅ Transfer successful!</p>}
      {error && <p>❌ Error: {error.message}</p>}
    </div>
  )
}
```

## Complete Example

Here's a complete working example:

```tsx
import { WagmiProvider, useAccount, useConnect } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider, useFHEVM, useConfidentialBalance } from '@fhevmsdk/react'
import { config } from './config/wagmi'
import { tokenABI } from './abi'

const queryClient = new QueryClient()

function ConnectWallet() {
  const { connectors, connect } = useConnect()
  const { address } = useAccount()

  if (address) return <div>Connected: {address}</div>

  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  )
}

function ConfidentialToken() {
  const { isReady } = useFHEVM()
  const { decryptedBalance, revealBalance, isRevealing } =
    useConfidentialBalance({
      contractAddress: '0x...',
      abi: tokenABI,
    })

  if (!isReady) return <div>Loading FHEVM...</div>

  return (
    <div>
      <h2>Confidential Token</h2>
      {decryptedBalance ? (
        <p>Balance: {decryptedBalance}</p>
      ) : (
        <button onClick={revealBalance} disabled={isRevealing}>
          Reveal Balance
        </button>
      )}
    </div>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <div className="app">
            <h1>My Confidential dApp</h1>
            <ConnectWallet />
            <ConfidentialToken />
          </div>
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

## Next Steps

- **API Reference**: Explore all [React hooks](../api-reference/react/provider)
- **Examples**: See complete [example projects](../examples/nextjs-example)
- **TypeScript**: Learn about [type safety](../guides/best-practices#typescript)

## Common Patterns

### Error Handling

```tsx
function SafeComponent() {
  const { error } = useFHEVM()

  if (error) {
    return (
      <div className="error">
        <h3>FHEVM Error</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return <YourComponent />
}
```

### Loading States

```tsx
function LoadingExample() {
  const { isReady, isLoading } = useFHEVM()
  const { isRevealing } = useConfidentialBalance({ ... })

  if (isLoading) return <Spinner />
  if (!isReady) return <div>Please wait...</div>

  return <div>{/* Your content */}</div>
}
```

## Troubleshooting

See the [Troubleshooting Guide](../troubleshooting) for common issues and solutions.
