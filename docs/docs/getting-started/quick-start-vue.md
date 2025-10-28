---
sidebar_position: 3
---

# Vue Quick Start

Build your first confidential dApp with Vue 3 and FHEVM SDK in under 10 minutes.

## Installation

First, install the required packages:

```bash
pnpm install @fhevmsdk/core @fhevmsdk/vue vue @wagmi/vue @tanstack/vue-query viem
```

## Setup Wagmi for Vue

Configure Wagmi for Vue in your application:

```typescript
// config/wagmi.ts
import { http, createConfig } from '@wagmi/vue'
import { sepolia } from '@wagmi/vue/chains'
import { injected } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
})
```

## Setup FHEVM in Your App

In your `main.ts`, set up the FHEVM context:

```typescript
// main.ts
import { createApp } from 'vue'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'
import { config } from './config/wagmi'
import App from './App.vue'

const queryClient = new QueryClient()

// Initialize FHEVM
const fhevmContext = setupFHEVM({ network: 'sepolia' })

const app = createApp(App)

app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.provide(FHEVMContextKey, fhevmContext)

app.mount('#app')
```

## Use FHEVM Composables

Now you can use FHEVM composables in your components:

### Check FHEVM Status

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { isReady, isLoading, error } = useFHEVM()
</script>

<template>
  <div>
    <div v-if="isLoading">Initializing FHEVM...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="!isReady">FHEVM not ready</div>
    <div v-else>✅ FHEVM is ready!</div>
  </div>
</template>
```

### Encrypt Data

```typescript
<script setup lang="ts">
import { ref } from 'vue'
import { useEncrypt } from '@fhevmsdk/vue'

const amount = ref('')
const encrypted = ref<string>()
const { encrypt } = useEncrypt()

const handleEncrypt = async () => {
  const result = await encrypt.uint64({
    value: BigInt(amount.value),
    contractAddress: '0x...',
    userAddress: '0x...',
  })
  encrypted.value = result.data
}
</script>

<template>
  <div>
    <input v-model="amount" placeholder="Amount" />
    <button @click="handleEncrypt">Encrypt</button>
    <p v-if="encrypted">Encrypted: {{ encrypted }}</p>
  </div>
</template>
```

### View Confidential Balance

```typescript
<script setup lang="ts">
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { tokenABI } from './abi'

const { decryptedBalance, revealBalance, isRevealing } = useConfidentialBalance({
  contractAddress: '0x1234567890123456789012345678901234567890',
  abi: tokenABI,
})
</script>

<template>
  <div>
    <p v-if="decryptedBalance">Balance: {{ decryptedBalance }}</p>
    <button v-else @click="revealBalance" :disabled="isRevealing">
      {{ isRevealing ? 'Revealing...' : 'Reveal Balance' }}
    </button>
  </div>
</template>
```

### Transfer Confidential Tokens

```typescript
<script setup lang="ts">
import { ref } from 'vue'
import { useConfidentialTransfer } from '@fhevmsdk/vue'
import { tokenABI } from './abi'

const to = ref('')
const amount = ref('')

const { transfer, isLoading, isSuccess, error } = useConfidentialTransfer({
  contractAddress: '0x1234567890123456789012345678901234567890',
  abi: tokenABI,
})

const handleTransfer = async () => {
  await transfer({
    to: to.value,
    amount: amount.value,
  })
}
</script>

<template>
  <div>
    <input v-model="to" placeholder="Recipient address" />
    <input v-model="amount" placeholder="Amount" />
    <button @click="handleTransfer" :disabled="isLoading">
      {{ isLoading ? 'Transferring...' : 'Transfer' }}
    </button>
    <p v-if="isSuccess">✅ Transfer successful!</p>
    <p v-if="error">❌ Error: {{ error.message }}</p>
  </div>
</template>
```

## Complete Example

Here's a complete working example:

### App.vue

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'
import { useAccount, useConnect } from '@wagmi/vue'
import ConnectWallet from './components/ConnectWallet.vue'
import ConfidentialToken from './components/ConfidentialToken.vue'

const { isReady } = useFHEVM()
const { address } = useAccount()
</script>

<template>
  <div class="app">
    <h1>My Confidential dApp</h1>
    <ConnectWallet />
    <div v-if="address && isReady">
      <ConfidentialToken />
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
```

### ConnectWallet.vue

```typescript
<script setup lang="ts">
import { useAccount, useConnect, useDisconnect } from '@wagmi/vue'

const { connectors, connect } = useConnect()
const { disconnect } = useDisconnect()
const { address } = useAccount()
</script>

<template>
  <div>
    <button v-if="!address" @click="connect({ connector: connectors[0] })">
      Connect Wallet
    </button>
    <div v-else>
      <p>Connected: {{ address }}</p>
      <button @click="disconnect()">Disconnect</button>
    </div>
  </div>
</template>
```

### ConfidentialToken.vue

```typescript
<script setup lang="ts">
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { tokenABI } from '../abi'

const { decryptedBalance, revealBalance, isRevealing } = useConfidentialBalance({
  contractAddress: '0x...',
  abi: tokenABI,
})
</script>

<template>
  <div>
    <h2>Confidential Token</h2>
    <div v-if="decryptedBalance">
      <p>Balance: {{ decryptedBalance }}</p>
    </div>
    <button v-else @click="revealBalance" :disabled="isRevealing">
      {{ isRevealing ? 'Revealing...' : 'Reveal Balance' }}
    </button>
  </div>
</template>
```

## TypeScript Support

For optimal TypeScript support, update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

And configure Vite for proper resolution in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## Next Steps

- **Learn More**: Check out the [Vite Integration Guide](../guides/vite-integration) for advanced patterns
- **API Reference**: Explore all [Vue composables](../api-reference/vue/setup)
- **Examples**: See a complete [Vite + Vue example](../examples/vite-vue-example)
- **Composition API**: Learn about [composable patterns](../guides/best-practices#composition-patterns)

## Common Patterns

### Error Handling

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { error } = useFHEVM()

const retry = () => {
  window.location.reload()
}
</script>

<template>
  <div v-if="error" class="error">
    <h3>FHEVM Error</h3>
    <p>{{ error.message }}</p>
    <button @click="retry">Retry</button>
  </div>
  <slot v-else />
</template>
```

### Loading States

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { isReady, isLoading } = useFHEVM()
</script>

<template>
  <div>
    <div v-if="isLoading" class="spinner">Loading...</div>
    <div v-else-if="!isReady">Please wait...</div>
    <slot v-else />
  </div>
</template>
```

### Reactive State

```typescript
<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useConfidentialBalance } from '@fhevmsdk/vue'

const { decryptedBalance } = useConfidentialBalance({ ... })

// Computed property based on decrypted balance
const formattedBalance = computed(() => {
  if (!decryptedBalance.value) return 'Hidden'
  return `${decryptedBalance.value} tokens`
})

// Watch for changes
watchEffect(() => {
  if (decryptedBalance.value) {
    console.log('Balance updated:', decryptedBalance.value)
  }
})
</script>

<template>
  <div>{{ formattedBalance }}</div>
</template>
```

## Troubleshooting

See the [Troubleshooting Guide](../troubleshooting) for common issues and solutions.
