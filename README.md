# FHEVM SDK

A universal, framework-agnostic SDK for building confidential dApps with Zama's Fully Homomorphic Encryption (FHE) technology.

## 🚀 Features

- **Framework-Agnostic Core** - Use with any JavaScript framework or Node.js
- **React Hooks** - Wagmi-like API for React applications
- **TypeScript First** - Full type safety and autocomplete
- **Easy Integration** - Simple setup with minimal configuration
- **Tree-Shakeable** - Import only what you need
- **Production Ready** - Based on battle-tested implementations

## 📦 Packages

This monorepo contains the following packages:

- **[@fhevm/core](./packages/core)** - Framework-agnostic core SDK
- **[@fhevm/react](./packages/react)** - React hooks and components

## 🏁 Quick Start

### Installation

```bash
# Using pnpm (recommended for monorepo)
pnpm add @fhevm/core @fhevm/react

# Using npm
npm install @fhevm/core @fhevm/react

# Using yarn
yarn add @fhevm/core @fhevm/react
```

### Basic Usage (React)

```tsx
import { FHEVMProvider, useFHEVM, useConfidentialTransfer } from '@fhevm/react'
import { WagmiProvider } from 'wagmi'

// Wrap your app
function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <FHEVMProvider network="sepolia">
        <YourApp />
      </FHEVMProvider>
    </WagmiProvider>
  )
}

// Use in components
function TransferComponent() {
  const { isReady } = useFHEVM()
  const { transfer, isLoading } = useConfidentialTransfer({
    contractAddress: '0x...',
    abi: yourABI,
  })

  const handleTransfer = async () => {
    await transfer({
      to: '0x...',
      amount: '10.0',
    })
  }

  if (!isReady) return <div>Loading FHEVM...</div>

  return (
    <button onClick={handleTransfer} disabled={isLoading}>
      Transfer
    </button>
  )
}
```

### Basic Usage (Core - Framework Agnostic)

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevm/core'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

// Initialize once
await initFHEVM()

// Create client
const client = await createFHEVMClient({
  network: 'sepolia',
})

// Encrypt
const encrypted = await client.encrypt.uint64({
  value: 1000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// Decrypt (requires viem WalletClient)
const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const decrypted = await client.decrypt({
  ciphertextHandle: '0x...',
  contractAddress: '0x...',
  walletClient, // viem WalletClient (uses native EIP-712 signing)
})
```

## 📖 Documentation

### Core Package

See [@fhevm/core documentation](./packages/core/README.md) for:
- API Reference
- Configuration options
- Advanced usage

### React Package

See [@fhevm/react documentation](./packages/react/README.md) for:
- Available hooks
- Provider configuration
- Examples

## 🎯 Examples

Check out the [examples](./examples) directory for complete implementations:

- **[Next.js Example](./examples/nextjs)** - Full-featured Next.js app

## 🏗️ Development

This is a pnpm workspace monorepo.

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all packages in dev mode
pnpm dev

# Run type checking
pnpm typecheck
```

### Project Structure

```
fhevm-sdk/
├── packages/
│   ├── core/          # Framework-agnostic core
│   └── react/         # React bindings
├── examples/
│   └── nextjs/        # Next.js example
└── package.json       # Monorepo root
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

Built on top of:
- [@zama-fhe/relayer-sdk](https://www.npmjs.com/package/@zama-fhe/relayer-sdk)
- [Zama's FHE technology](https://zama.ai)

## 🔗 Links

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
