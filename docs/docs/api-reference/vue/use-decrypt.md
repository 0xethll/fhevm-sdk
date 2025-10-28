---
sidebar_position: 4
---

# useDecrypt

Composable for decrypting confidential values with user authorization.

## Usage

```typescript
<script setup lang="ts">
import { useDecrypt } from '@fhevmsdk/vue'
import { ref } from 'vue'

const { decrypt, isDecrypting } = useDecrypt()
const value = ref<bigint>()

const handleDecrypt = async () => {
  value.value = await decrypt({
    ciphertextHandle: '0xabcd...',
    contractAddress: '0x...',
  })
}
</script>

<template>
  <button @click="handleDecrypt">Decrypt</button>
</template>
```

## Returns

```typescript
interface UseDecryptReturn {
  decrypt: (params: DecryptParams) => Promise<bigint>
  isDecrypting: Ref<boolean>
  error: Ref<string | null>
  canDecrypt: Ref<boolean>
}
```

## Examples

### Balance Reveal

```typescript
<script setup lang="ts">
import { useDecrypt } from '@fhevmsdk/vue'
import { ref } from 'vue'

const { decrypt, isDecrypting } = useDecrypt()
const balance = ref<bigint>()

const handleReveal = async () => {
  balance.value = await decrypt({
    ciphertextHandle: '0x...',
    contractAddress: '0x...',
  })
}
</script>

<template>
  <div>
    <p v-if="balance">Balance: {{ balance.toString() }}</p>
    <button v-else @click="handleReveal" :disabled="isDecrypting">
      {{ isDecrypting ? 'Revealing...' : 'Reveal Balance' }}
    </button>
  </div>
</template>
```

## See Also

- [useEncrypt](./use-encrypt)
