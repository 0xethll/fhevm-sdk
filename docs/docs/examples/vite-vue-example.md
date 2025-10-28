---
sidebar_position: 3
---

# Vite + Vue Example

Complete Vite + Vue application using FHEVM SDK.

📦 **[View on GitHub](https://github.com/0xethll/fhevm-sdk/tree/main/examples/fhevm-vite-vue)**

## Project Structure

```
fhevm-vite-vue/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   │   ├── ConnectWallet.vue
│   │   └── TokenBalance.vue
│   └── config/
│       └── wagmi.ts
├── package.json
└── vite.config.ts
```

## Key Files

### main.ts

```typescript
import { createApp } from 'vue'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'
import App from './App.vue'
import { config } from './config/wagmi'

const queryClient = new QueryClient()
const fhevmContext = setupFHEVM({ network: 'sepolia' })

const app = createApp(App)
app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.provide(FHEVMContextKey, fhevmContext)
app.mount('#app')
```

### TokenBalance.vue

```typescript
<script setup lang="ts">
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { tokenABI } from '../abi/token'

const { decryptedBalance, revealBalance, formatBalance } =
  useConfidentialBalance({
    contractAddress: '0x...',
    abi: tokenABI,
  })
</script>

<template>
  <div>
    <p v-if="decryptedBalance">{{ formatBalance(decryptedBalance) }} tokens</p>
    <button v-else @click="revealBalance">Reveal Balance</button>
  </div>
</template>
```

## Running the Example

### Clone the Repository

```bash
git clone https://github.com/0xethll/fhevm-sdk.git
cd fhevm-sdk/examples/fhevm-vite-vue
```

### Install and Run

```bash
pnpm install
pnpm run dev
```

Visit http://localhost:5173

## Source Code

View the complete source code on GitHub: [examples/fhevm-vite-vue](https://github.com/0xethll/fhevm-sdk/tree/main/examples/fhevm-vite-vue)
