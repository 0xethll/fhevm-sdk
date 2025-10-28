---
sidebar_position: 6
---

# useConfidentialTransfer

High-level composable for executing confidential token transfers.

## Usage

```typescript
<script setup lang="ts">
import { useConfidentialTransfer } from '@fhevmsdk/vue'
import { tokenABI } from './abi'

const { transfer, isLoading, isSuccess } = useConfidentialTransfer({
  contractAddress: '0x...',
  abi: tokenABI,
})

const handleTransfer = async () => {
  await transfer({
    to: '0xRecipient...',
    amount: '10.5',
  })
}
</script>

<template>
  <button @click="handleTransfer" :disabled="isLoading">Transfer</button>
</template>
```

## Parameters

```typescript
interface Params {
  contractAddress: `0x${string}`
  abi: Abi
  functionName?: string  // default: 'confidentialTransfer'
  decimals?: number      // default: 6
}
```

## Returns

```typescript
interface Return {
  transfer: (params: TransferParams) => Promise<void>
  isLoading: Ref<boolean>
  isPreparingTx: Ref<boolean>
  isEncrypting: Ref<boolean>
  isPending: Ref<boolean>
  isConfirming: Ref<boolean>
  isSuccess: Ref<boolean>
  txHash: Ref<`0x${string}` | undefined>
  error: Ref<string | null>
  reset: () => void
  canTransfer: Ref<boolean>
}
```

## Complete Example

```typescript
<script setup lang="ts">
import { useConfidentialTransfer } from '@fhevmsdk/vue'
import { ref } from 'vue'
import { tokenABI } from './abi'

const to = ref('')
const amount = ref('')

const {
  transfer,
  isLoading,
  isSuccess,
  txHash,
  error,
  reset,
  canTransfer,
} = useConfidentialTransfer({
  contractAddress: '0x...',
  abi: tokenABI,
  decimals: 18,
})

const handleSubmit = async () => {
  await transfer({ to: to.value, amount: amount.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="to" placeholder="Recipient address" />
    <input v-model="amount" placeholder="Amount" />
    <button type="submit" :disabled="!canTransfer || isLoading">
      {{ isLoading ? 'Processing...' : 'Transfer' }}
    </button>
    <p v-if="isSuccess">Success! TX: {{ txHash }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>
```

## See Also

- [useEncrypt](./use-encrypt)
- [useConfidentialBalance](./use-confidential-balance)
