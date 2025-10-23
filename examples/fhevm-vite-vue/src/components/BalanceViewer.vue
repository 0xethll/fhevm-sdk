<script setup lang="ts">
import { useAccount } from '@wagmi/vue'
import { useConfidentialBalance } from '@fhevmsdk/vue'
import { CONFIDENTIAL_TOKEN } from '../contracts'

const { address } = useAccount()

const {
  decryptedBalance,
  isVisible,
  isDecrypting,
  revealBalance,
  hideBalance,
  formatBalance,
} = useConfidentialBalance({
  contractAddress: CONFIDENTIAL_TOKEN.address,
  abi: CONFIDENTIAL_TOKEN.abi,
  decimals: 6,
})
</script>

<template>
  <div class="card">
    <h2>💰 Your Balance</h2>

    <div v-if="!address">
      <p>Connect your wallet to view balance</p>
    </div>

    <div v-else-if="isVisible && decryptedBalance !== null">
      <p class="balance">{{ formatBalance(decryptedBalance) }} TOKENS</p>

      <button @click="hideBalance" class="btn-secondary">
        🔒 Hide Balance
      </button>
    </div>

    <div v-else>
      <p class="encrypted">🔐 Balance is encrypted on-chain</p>

      <button
        @click="revealBalance"
        :disabled="isDecrypting"
        class="btn-primary"
      >
        {{ isDecrypting ? 'Decrypting...' : '👁️ Reveal Balance' }}
      </button>
    </div>

    <p class="hint">
      ℹ️ Your balance is stored encrypted. Only you can decrypt it with your
      signature.
    </p>
  </div>
</template>
