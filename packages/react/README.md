# @fhevm/react

React hooks and components for FHEVM SDK with a wagmi-like API.

## 📦 Installation

```bash
npm install @fhevm/react @fhevm/core wagmi viem ethers
```

## 🚀 Quick Start

### 1. Setup Providers

```tsx
import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevm/react'

const wagmiConfig = createConfig({ /* your config */ })
const queryClient = new QueryClient()

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

### 2. Use Hooks in Components

```tsx
import {
  useFHEVM,
  useConfidentialBalance,
  useConfidentialTransfer,
} from '@fhevm/react'

function TokenTransfer() {
  const { isReady } = useFHEVM()

  const { decryptedBalance, revealBalance, formatBalance } =
    useConfidentialBalance({
      contractAddress: '0x...',
      abi: tokenABI,
    })

  const { transfer, isLoading } = useConfidentialTransfer({
    contractAddress: '0x...',
    abi: tokenABI,
  })

  if (!isReady) return <div>Loading FHEVM...</div>

  return (
    <div>
      <button onClick={revealBalance}>Show Balance</button>
      {decryptedBalance && <p>{formatBalance(decryptedBalance)}</p>}

      <button onClick={() => transfer({ to: '0x...', amount: '10' })}>
        Transfer
      </button>
    </div>
  )
}
```

## 📚 Hooks API

### `useFHEVM()`

Main hook to access FHEVM client and status.

```tsx
const { client, isReady, error, retry } = useFHEVM()
```

**Returns:**
- `client`: FHEVMClient | null
- `isReady`: boolean - Whether FHEVM is initialized
- `error`: string | null - Initialization error
- `retry`: () => void - Retry initialization

### `useEncrypt()`

Hook for encrypting values.

```tsx
const {
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptUint128,
  encryptUint256,
  isEncrypting,
  error,
  canEncrypt,
} = useEncrypt()

// Usage
const encrypted = await encryptUint64({
  value: 1000000n,
  contractAddress: '0x...',
})
// Returns: { data: '0x...', proof: '0x...' }
```

**Parameters:**
- `value`: bigint - Value to encrypt
- `contractAddress`: string - Target contract address

**Returns:**
- `data`: `0x${string}` - Encrypted handle
- `proof`: `0x${string}` - Encryption proof

### `useDecrypt()`

Hook for decrypting values.

```tsx
const { decrypt, isDecrypting, error, canDecrypt } = useDecrypt()

// Usage
const decrypted = await decrypt({
  ciphertextHandle: '0x...',
  contractAddress: '0x...',
})
// Returns: bigint
```

### `useConfidentialBalance(params)`

Hook to read and decrypt confidential token balances.

```tsx
const {
  encryptedBalance,
  decryptedBalance,
  isVisible,
  isLoading,
  isDecrypting,
  revealBalance,
  hideBalance,
  formatBalance,
  refetch,
} = useConfidentialBalance({
  contractAddress: '0x...',
  abi: tokenABI,
  functionName: 'confidentialBalanceOf', // optional
  decimals: 6, // optional
})
```

**Parameters:**
- `contractAddress`: Address of the token contract
- `abi`: Contract ABI
- `functionName`: Function name (default: 'confidentialBalanceOf')
- `decimals`: Token decimals (default: 6)

**Returns:**
- `encryptedBalance`: Encrypted balance handle
- `decryptedBalance`: Decrypted balance (null until revealed)
- `isVisible`: Whether balance is currently revealed
- `revealBalance()`: Decrypt and show balance
- `hideBalance()`: Hide decrypted balance
- `formatBalance(bigint)`: Format balance for display

### `useConfidentialTransfer(params)`

Hook to perform confidential token transfers.

```tsx
const {
  transfer,
  isLoading,
  isPreparingTx,
  isEncrypting,
  isPending,
  isConfirming,
  isSuccess,
  txHash,
  error,
  reset,
  canTransfer,
} = useConfidentialTransfer({
  contractAddress: '0x...',
  abi: tokenABI,
  functionName: 'confidentialTransfer', // optional
  decimals: 6, // optional
})

// Usage
await transfer({
  to: '0x...',
  amount: '10.5', // or bigint
})
```

**Parameters:**
- `contractAddress`: Address of the token contract
- `abi`: Contract ABI
- `functionName`: Function name (default: 'confidentialTransfer')
- `decimals`: Token decimals (default: 6)

**Transfer Parameters:**
- `to`: Recipient address
- `amount`: Amount as string or bigint

**Returns:**
- `transfer(params)`: Execute transfer
- `isLoading`: Overall loading state
- `isPreparingTx`: Preparing transaction
- `isEncrypting`: Encrypting amount
- `isPending`: Transaction pending
- `isConfirming`: Waiting for confirmation
- `isSuccess`: Transaction successful
- `txHash`: Transaction hash
- `error`: Error message
- `reset()`: Reset state
- `canTransfer`: Whether transfer can be executed

## 🎯 Complete Example

```tsx
import { useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import {
  useFHEVM,
  useConfidentialBalance,
  useConfidentialTransfer,
} from '@fhevm/react'

const TOKEN_ADDRESS = '0x...'
const TOKEN_ABI = [/* ... */]

function TokenDApp() {
  const { isReady, error, retry } = useFHEVM()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const {
    decryptedBalance,
    isVisible,
    revealBalance,
    hideBalance,
    formatBalance,
  } = useConfidentialBalance({
    contractAddress: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    decimals: 6,
  })

  const {
    transfer,
    isLoading,
    isSuccess,
    error: transferError,
  } = useConfidentialTransfer({
    contractAddress: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    decimals: 6,
  })

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )
  }

  if (!isReady) {
    return <div>Loading FHEVM...</div>
  }

  return (
    <div>
      <h1>Confidential Token</h1>

      <ConnectKitButton />

      <div>
        <h2>Balance</h2>
        {isVisible && decryptedBalance ? (
          <>
            <p>{formatBalance(decryptedBalance)}</p>
            <button onClick={hideBalance}>Hide</button>
          </>
        ) : (
          <button onClick={revealBalance}>Reveal</button>
        )}
      </div>

      <div>
        <h2>Transfer</h2>
        <input
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={() => transfer({ to: recipient, amount })}
          disabled={isLoading}
        >
          {isLoading ? 'Transferring...' : 'Transfer'}
        </button>
        {isSuccess && <p>Transfer successful!</p>}
        {transferError && <p>Error: {transferError}</p>}
      </div>
    </div>
  )
}
```

## 🔧 Provider Configuration

```tsx
<FHEVMProvider
  network="sepolia"  // or custom NetworkConfig
  config={{          // optional custom config
    network: customNetworkConfig,
    provider: customProvider,
  }}
>
  {children}
</FHEVMProvider>
```

## 📝 TypeScript

All hooks are fully typed. Import types from `@fhevm/core`:

```typescript
import type {
  FHEVMClient,
  EncryptedValue,
  NetworkConfig,
} from '@fhevm/react'
```

## ⚠️ Important Notes

1. **Wagmi Required**: This package requires wagmi to be configured
2. **React 18+**: Requires React 18 or higher
3. **Provider Order**: FHEVMProvider must be inside WagmiProvider
4. **Single Instance**: FHEVM uses a singleton pattern to prevent multiple initializations

## 🔗 Related Packages

- [@fhevm/core](../core) - Core SDK
- [wagmi](https://wagmi.sh) - React hooks for Ethereum

## 📄 License

MIT
