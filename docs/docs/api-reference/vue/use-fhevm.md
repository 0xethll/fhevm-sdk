---
sidebar_position: 2
---

# useFHEVM

Composable to access FHEVM client and initialization status.

## Usage

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { client, isReady, error, retry } = useFHEVM()
</script>

<template>
  <div v-if="!isReady">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>FHEVM Ready!</div>
</template>
```

## Returns

```typescript
interface UseFHEVMReturn {
  client: Ref<FHEVMClient | null>
  isReady: Ref<boolean>
  error: Ref<string | null>
  retry: () => void
}
```

## Examples

### Loading State

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { isReady } = useFHEVM()
</script>

<template>
  <div v-if="!isReady" class="loading">
    <Spinner />
    <p>Initializing FHEVM...</p>
  </div>
  <Dashboard v-else />
</template>
```

### Error Handling

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { isReady, error, retry } = useFHEVM()
</script>

<template>
  <div v-if="error" class="error">
    <h3>Initialization Failed</h3>
    <p>{{ error }}</p>
    <button @click="retry">Retry</button>
  </div>
  <div v-else-if="!isReady">Loading...</div>
  <Dashboard v-else />
</template>
```

### Using Client Directly

```typescript
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'
import { useAccount } from '@wagmi/vue'
import { ref } from 'vue'

const { client, isReady } = useFHEVM()
const { address } = useAccount()
const encrypted = ref()

const handleEncrypt = async () => {
  if (!isReady.value || !client.value || !address.value) return

  encrypted.value = await client.value.encrypt.uint64({
    value: 1000n,
    contractAddress: '0x...',
    userAddress: address.value,
  })
}
</script>

<template>
  <button @click="handleEncrypt" :disabled="!isReady">Encrypt</button>
</template>
```

## Common Patterns

### Guard Component

```typescript
<!-- FHEVMGuard.vue -->
<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'

const { isReady, error, retry } = useFHEVM()
</script>

<template>
  <div v-if="error">
    <p>FHEVM Error: {{ error }}</p>
    <button @click="retry">Retry</button>
  </div>
  <div v-else-if="!isReady">Loading FHEVM...</div>
  <slot v-else />
</template>

<!-- Usage -->
<FHEVMGuard>
  <YourApp />
</FHEVMGuard>
```

## Notes

- ✅ Reactive refs automatically update
- ✅ Must be used after `setupFHEVM()` in main.ts
- ✅ `client` is null until `isReady` is true
- ⚠️ Always check `isReady.value` before using `client.value`

## See Also

- [Setup & Provider](./setup) - Initialize FHEVM
- [useEncrypt](./use-encrypt) - Encryption composable
- [useDecrypt](./use-decrypt) - Decryption composable
