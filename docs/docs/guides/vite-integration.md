---
sidebar_position: 4
---

# Vite Integration

Guide for integrating FHEVM SDK with Vite.

## Installation

```bash
pnpm install @fhevmsdk/core @fhevmsdk/react wagmi @tanstack/react-query viem
# or for Vue
pnpm install @fhevmsdk/core @fhevmsdk/vue @wagmi/vue @tanstack/vue-query viem
```

## React + Vite

```tsx
// main.tsx
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevmsdk/react'
import App from './App'
import { config } from './wagmi-config'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <FHEVMProvider network="sepolia">
        <App />
      </FHEVMProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
```

## Vue + Vite

```typescript
// main.ts
import { createApp } from 'vue'
import { WagmiPlugin } from '@wagmi/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'
import App from './App.vue'

const fhevmContext = setupFHEVM({ network: 'sepolia' })
const app = createApp(App)

app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.provide(FHEVMContextKey, fhevmContext)
app.mount('#app')
```

## Vite Config

No special configuration needed. Standard Vite config works:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```
