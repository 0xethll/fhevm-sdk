# Getting Started with FHEVM SDK

This guide will help you get the FHEVM SDK up and running.

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+ (recommended) or npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (for testing)

## 🚀 Quick Start (For Users)

### 1. Install the packages

```bash
npm install @fhevm/core @fhevm/react wagmi viem ethers
```

### 2. Setup your React app

```tsx
// app/providers.tsx
import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevm/react'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'

const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  // ... other wagmi config
})

const queryClient = new QueryClient()

export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          {children}
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 3. Use in your components

```tsx
import {
  useFHEVM,
  useConfidentialBalance,
  useConfidentialTransfer,
} from '@fhevm/react'

function MyComponent() {
  const { isReady } = useFHEVM()

  const { revealBalance, decryptedBalance } = useConfidentialBalance({
    contractAddress: '0x...',
    abi: yourABI,
  })

  const { transfer, isLoading } = useConfidentialTransfer({
    contractAddress: '0x...',
    abi: yourABI,
  })

  if (!isReady) return <div>Loading FHEVM...</div>

  return (
    <div>
      <button onClick={revealBalance}>Show Balance</button>
      <button onClick={() => transfer({ to: '0x...', amount: '10' })}>
        Transfer
      </button>
    </div>
  )
}
```

## 🏗️ Development Setup (For Contributors)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fhevm-sdk.git
cd fhevm-sdk
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Build all packages

```bash
pnpm build
```

### 4. Run in development mode

```bash
pnpm dev
```

### 5. Run the Next.js example

```bash
cd examples/nextjs
cp .env.example .env.local
# Edit .env.local with your WalletConnect Project ID
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Package Overview

### @fhevm/core

Framework-agnostic core SDK for encryption and decryption.

**Use when:**
- Building with vanilla JavaScript
- Building with non-React frameworks (Vue, Svelte, etc.)
- Need direct control over FHE operations

**Example:**
```typescript
import { initFHEVM, createFHEVMClient } from '@fhevm/core'

await initFHEVM()
const client = await createFHEVMClient({ network: 'sepolia' })

const encrypted = await client.encrypt.uint64({
  value: 1000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

### @fhevm/react

React hooks and components with wagmi-like API.

**Use when:**
- Building React applications
- Want familiar wagmi-style hooks
- Need state management handled for you

**Example:**
```tsx
import { useFHEVM, useEncrypt } from '@fhevm/react'

const { isReady } = useFHEVM()
const { encryptUint64 } = useEncrypt()

const encrypted = await encryptUint64({
  value: 1000000n,
  contractAddress: '0x...',
})
```

## 🎯 Common Use Cases

### Reading Confidential Balance

```tsx
const { decryptedBalance, revealBalance, formatBalance } =
  useConfidentialBalance({
    contractAddress: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
  })

// Show balance
<button onClick={revealBalance}>Reveal Balance</button>
{decryptedBalance && <span>{formatBalance(decryptedBalance)}</span>}
```

### Transferring Confidential Tokens

```tsx
const { transfer, isLoading, isSuccess } = useConfidentialTransfer({
  contractAddress: TOKEN_ADDRESS,
  abi: TOKEN_ABI,
})

await transfer({
  to: recipientAddress,
  amount: '10.5', // or BigInt
})
```

### Custom Encryption

```tsx
const { encryptUint64 } = useEncrypt()

const encrypted = await encryptUint64({
  value: parseTokenAmount('10.5', 6),
  contractAddress: TOKEN_ADDRESS,
})

// Use encrypted.data and encrypted.proof in contract call
await contract.write.customFunction([encrypted.data, encrypted.proof])
```

### Custom Decryption

```tsx
const { decrypt } = useDecrypt()

const decrypted = await decrypt({
  ciphertextHandle: '0x...', // from contract
  contractAddress: TOKEN_ADDRESS,
})
```

## 📚 Next Steps

1. **Read the documentation**
   - [@fhevm/core README](./packages/core/README.md)
   - [@fhevm/react README](./packages/react/README.md)

2. **Explore examples**
   - [Next.js Example](./examples/nextjs/README.md)

3. **Deploy a contract**
   - Use [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
   - Check [Zama FHEVM docs](https://docs.zama.ai/fhevm)

4. **Join the community**
   - [Zama Discord](https://discord.com/invite/zama)
   - [GitHub Discussions](https://github.com/your-org/fhevm-sdk/discussions)

## 🐛 Troubleshooting

### "FHEVM SDK can only be initialized in the browser"

- Make sure you're not calling FHEVM functions during SSR
- Use `'use client'` directive in Next.js components
- Check that `window.ethereum` is available

### "Ethereum provider not available"

- Install MetaMask or compatible wallet
- Ensure wallet is unlocked
- Check that you're connected to the correct network

### Build errors in monorepo

```bash
# Clean and rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### Transaction failures

- Check contract address and ABI are correct
- Ensure sufficient balance (both tokens and gas)
- Verify you're on the correct network (Sepolia)
- Check browser console for detailed errors

## 💡 Tips

1. **Always initialize FHEVM** - Call `initFHEVM()` or use `FHEVMProvider` before any operations
2. **Handle loading states** - FHEVM initialization takes time, show loading UI
3. **Catch errors** - Encryption/decryption can fail, always handle errors
4. **Cache decrypted values** - Decryption requires user signature, cache results when possible
5. **Test on Sepolia first** - Always test on testnet before mainnet deployment

## 🔗 Useful Links

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Home](https://zama.ai)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
- [Wagmi Documentation](https://wagmi.sh)

## 🎉 You're Ready!

Start building confidential dApps with FHEVM SDK. Happy coding! 🚀
