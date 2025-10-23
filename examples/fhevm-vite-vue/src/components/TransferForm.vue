<script setup lang="ts">
import { ref } from 'vue'
import { useAccount } from '@wagmi/vue'
import { useConfidentialTransfer } from '@fhevmsdk/vue'
import { CONFIDENTIAL_TOKEN } from '../contracts'
import { isAddress } from 'viem'

const { address } = useAccount()

const recipient = ref('')
const amount = ref('')

const {
  transfer,
  isLoading,
  isSuccess,
  txHash,
  error,
  reset,
} = useConfidentialTransfer({
  contractAddress: CONFIDENTIAL_TOKEN.address,
  abi: CONFIDENTIAL_TOKEN.abi,
  decimals: 6,
})

const handleTransfer = async () => {
  if (!isAddress(recipient.value)) {
    alert('Invalid recipient address')
    return
  }

  if (!amount.value || parseFloat(amount.value) <= 0) {
    alert('Invalid amount')
    return
  }

  await transfer({ to: recipient.value, amount: amount.value })
}
</script>

<template>
  <div class="card">
    <h2>📤 Transfer Tokens</h2>

    <div v-if="!address">
      <p>Connect your wallet to transfer tokens</p>
    </div>

    <div v-else class="form">
      <div class="form-group">
        <label>Recipient Address</label>

        <input
          type="text"
          placeholder="0x..."
          v-model="recipient"
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label>Amount</label>

        <input
          type="text"
          placeholder="10.5"
          v-model="amount"
          :disabled="isLoading"
        />
      </div>

      <button
        @click="handleTransfer"
        :disabled="isLoading || !recipient || !amount"
        class="btn-primary"
      >
        {{ isLoading ? '⏳ Transferring...' : '🚀 Send Private Transfer' }}
      </button>

      <div v-if="isSuccess && txHash" class="success">
        ✅ Transfer successful!
        <a
          :href="`https://sepolia.etherscan.io/tx/${txHash}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Etherscan
        </a>
        <button @click="reset" class="btn-secondary">
          Send Another
        </button>
      </div>

      <div v-if="error" class="error">
        ❌ Error: {{ error }}
        <button @click="reset" class="btn-secondary">
          Try Again
        </button>
      </div>

      <p class="hint">
        🔐 The transfer amount is encrypted. No one can see how much you're
        sending!
      </p>
    </div>
  </div>
</template>
