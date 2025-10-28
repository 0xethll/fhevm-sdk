---
sidebar_position: 1
---

# Setup & Provider

Vue setup and context configuration for FHEVM SDK.

## setupFHEVM

Initialize FHEVM context for Vue application.

```typescript
import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'

const fhevmContext = setupFHEVM({ network: 'sepolia' })

app.provide(FHEVMContextKey, fhevmContext)
```

### Parameters

```typescript
interface Options {
  network?: 'sepolia'
}
```

### Returns

`FHEVMContext` - Context object to provide to Vue app

## Complete Setup Example

```typescript
// main.ts
import { createApp } from 'vue'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'
import { config } from './wagmi-config'
import App from './App.vue'

const queryClient = new QueryClient()
const fhevmContext = setupFHEVM({ network: 'sepolia' })

const app = createApp(App)

app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.provide(FHEVMContextKey, fhevmContext)

app.mount('#app')
```

## FHEVMContextKey

Injection key for accessing FHEVM context.

```typescript
import { inject } from 'vue'
import { FHEVMContextKey } from '@fhevmsdk/vue'

// In a component (use useFHEVM composable instead)
const fhevmContext = inject(FHEVMContextKey)
```

## FHEVMContext Type

```typescript
interface FHEVMContext {
  client: Ref<FHEVMClient | null>
  isReady: Ref<boolean>
  error: Ref<string | null>
  retry: () => void
}
```

## Notes

- ✅ Call `setupFHEVM()` once in your `main.ts`
- ✅ Provide context using `FHEVMContextKey`
- ✅ Use `useFHEVM()` composable in components
- ⚠️ Must be called before mounting app
- ⚠️ Requires `@wagmi/vue` and `@tanstack/vue-query`

## See Also

- [useFHEVM Composable](./use-fhevm) - Main composable for accessing FHEVM
- [Quick Start](../../getting-started/quick-start-vue) - Setup guide
