---
sidebar_position: 3
---

# useEncrypt

Composable for encrypting values for confidential contracts.

## Usage

```typescript
<script setup lang="ts">
import { useEncrypt } from '@fhevmsdk/vue'

const { encryptUint64, isEncrypting, canEncrypt } = useEncrypt()

const handleEncrypt = async () => {
  const result = await encryptUint64({
    value: 1000n,
    contractAddress: '0x...',
  })
  console.log('Encrypted:', result.data)
}
</script>

<template>
  <button @click="handleEncrypt">Encrypt</button>
</template>
```

## Returns

```typescript
interface UseEncryptReturn {
  encryptUint8: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint16: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint32: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint64: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint128: (params: EncryptParams) => Promise<EncryptedUint>
  encryptUint256: (params: EncryptParams) => Promise<EncryptedUint>
  isEncrypting: Ref<boolean>
  error: Ref<string | null>
  canEncrypt: Ref<boolean>
}
```

## Examples

### Basic Encryption

```typescript
<script setup lang="ts">
import { useEncrypt } from '@fhevmsdk/vue'
import { ref } from 'vue'

const { encryptUint64, isEncrypting } = useEncrypt()
const encrypted = ref()

const handleSubmit = async () => {
  encrypted.value = await encryptUint64({
    value: 1000000n,
    contractAddress: '0x...',
  })
}
</script>

<template>
  <button @click="handleSubmit" :disabled="isEncrypting">
    {{ isEncrypting ? 'Encrypting...' : 'Transfer' }}
  </button>
</template>
```

### With User Input

```typescript
<script setup lang="ts">
import { useEncrypt } from '@fhevmsdk/vue'
import { parseTokenAmount } from '@fhevmsdk/core'
import { ref } from 'vue'

const { encryptUint64, isEncrypting, error } = useEncrypt()
const amount = ref('')

const handleDeposit = async () => {
  const amountBigInt = parseTokenAmount(amount.value, 18)
  const encrypted = await encryptUint64({
    value: amountBigInt,
    contractAddress: '0x...',
  })
  // Use encrypted.handle and encrypted.proof
}
</script>

<template>
  <input v-model="amount" placeholder="Amount" />
  <button @click="handleDeposit" :disabled="isEncrypting">
    {{ isEncrypting ? 'Encrypting...' : 'Deposit' }}
  </button>
  <p v-if="error" class="error">{{ error }}</p>
</template>
```

## All Encryption Methods

- `encryptUint8(params)` - 0 to 255
- `encryptUint16(params)` - 0 to 65,535
- `encryptUint32(params)` - 0 to 4,294,967,295
- `encryptUint64(params)` - Large numbers
- `encryptUint128(params)` - Very large numbers
- `encryptUint256(params)` - Maximum precision

## See Also

- [useDecrypt](./use-decrypt)
