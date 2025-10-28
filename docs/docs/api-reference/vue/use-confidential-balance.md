---
sidebar_position: 5
---

# useConfidentialBalance

High-level composable for reading and revealing confidential token balances.

## Usage

```typescript
<script setup lang="ts">
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { tokenABI } from './abi'

const { decryptedBalance, revealBalance, isRevealing } = useConfidentialBalance({
  contractAddress: '0x...',
  abi: tokenABI,
})
</script>

<template>
  <div>
    <p v-if="decryptedBalance">Balance: {{ decryptedBalance }}</p>
    <button v-else @click="revealBalance">Reveal Balance</button>
  </div>
</template>
```

## Parameters

```typescript
interface Params {
  contractAddress: `0x${string}`
  abi: Abi
  functionName?: string  // default: 'confidentialBalanceOf'
  decimals?: number      // default: 6
}
```

## Returns

```typescript
interface Return {
  encryptedBalance: Ref<`0x${string}` | undefined>
  decryptedBalance: Ref<bigint | null>
  isVisible: Ref<boolean>
  isLoading: Ref<boolean>
  isDecrypting: Ref<boolean>
  revealBalance: () => Promise<void>
  hideBalance: () => void
  formatBalance: (balance: bigint) => string
  refetch: () => Promise<unknown>
}
```

## Example

```typescript
<script setup lang="ts">
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { tokenABI } from './abi'

const {
  decryptedBalance,
  isLoading,
  isDecrypting,
  revealBalance,
  hideBalance,
  formatBalance,
} = useConfidentialBalance({
  contractAddress: '0x...',
  abi: tokenABI,
  decimals: 18,
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else>
    <h3>Your Balance</h3>
    <div v-if="decryptedBalance">
      <p>{{ formatBalance(decryptedBalance) }} tokens</p>
      <button @click="hideBalance">Hide</button>
    </div>
    <button v-else @click="revealBalance" :disabled="isDecrypting">
      {{ isDecrypting ? 'Revealing...' : 'Reveal Balance' }}
    </button>
  </div>
</template>
```

## See Also

- [useDecrypt](./use-decrypt)
- [useConfidentialTransfer](./use-confidential-transfer)
