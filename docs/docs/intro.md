---
sidebar_position: 1
slug: /
---

# Welcome to FHEVM SDK

**FHEVM SDK** is a universal, framework-agnostic SDK for building confidential decentralized applications (dApps) using Zama's Fully Homomorphic Encryption (FHE) technology.

## Why FHEVM SDK?

Building privacy-preserving dApps shouldn't be complicated. FHEVM SDK provides a simple, intuitive API that works seamlessly with your favorite frameworks.

### Key Features

- 🎯 **Framework-Agnostic Core** - Use with any JavaScript framework or Node.js
- ⚛️ **React Hooks** - Wagmi-like API for React applications
- 💚 **Vue Composables** - First-class Vue 3 support
- 🔒 **Full Type Safety** - Written in TypeScript with complete type definitions
- 🌳 **Tree-Shakeable** - Import only what you need
- ⚡ **Production Ready** - Based on battle-tested implementations
- 🛠️ **Easy Integration** - Minimal configuration required

## What is Fully Homomorphic Encryption (FHE)?

Fully Homomorphic Encryption (FHE) allows computations to be performed on encrypted data without decrypting it first. This means you can build applications that preserve user privacy while still performing complex operations on-chain.

### Use Cases

- 🏦 **Confidential DeFi** - Private balances, transfers, and trading
- 🎮 **Private Gaming** - Hidden game state and player information
- 🗳️ **Secure Voting** - Private voting with public verification
- 💼 **Enterprise Solutions** - Confidential business logic on-chain

## Quick Example

### React

```tsx
import { FHEVMProvider, useConfidentialBalance } from '@fhevmsdk/react'

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <FHEVMProvider network="sepolia">
        <BalanceDisplay />
      </FHEVMProvider>
    </WagmiProvider>
  )
}

function BalanceDisplay() {
  const { decryptedBalance, revealBalance, isRevealing } =
    useConfidentialBalance({
      contractAddress: '0x...',
      abi: tokenABI,
    })

  return (
    <div>
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
```

### Vue

```typescript
<script setup lang="ts">
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { tokenABI } from './abi'

const { decryptedBalance, revealBalance, isRevealing } =
  useConfidentialBalance({
    contractAddress: '0x...',
    abi: tokenABI,
  })
</script>

<template>
  <div>
    <p v-if="decryptedBalance">Balance: {{ decryptedBalance }}</p>
    <button v-else @click="revealBalance" :disabled="isRevealing">
      Reveal Balance
    </button>
  </div>
</template>
```

## Get Started

Choose your framework to get started:

- [React Quick Start](./getting-started/quick-start-react) - Get started with React
- [Vue Quick Start](./getting-started/quick-start-vue) - Get started with Vue
- [Vanilla JS Quick Start](./getting-started/quick-start-vanilla) - Framework-agnostic usage

## Package Overview

This SDK is split into framework-specific packages:

| Package | Description | Version |
|---------|-------------|---------|
| [@fhevmsdk/core](./api-reference/core/client) | Framework-agnostic core library | ![npm](https://img.shields.io/npm/v/@fhevmsdk/core) |
| [@fhevmsdk/react](./api-reference/react/provider) | React hooks and components | ![npm](https://img.shields.io/npm/v/@fhevmsdk/react) |
| [@fhevmsdk/vue](./api-reference/vue/setup) | Vue 3 composables | ![npm](https://img.shields.io/npm/v/@fhevmsdk/vue) |

## Community & Support

- 📚 [Zama Documentation](https://docs.zama.ai/)
- 🔗 [FHEVM Documentation](https://docs.zama.ai/fhevm)
- 💬 [GitHub Discussions](https://github.com/0xethll/fhevm-sdk/discussions)
- 🐛 [Issue Tracker](https://github.com/0xethll/fhevm-sdk/issues)

## License

MIT © FHEVM SDK
