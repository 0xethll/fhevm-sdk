<script setup lang="ts">
import { useFHEVM } from '@fhevmsdk/vue'
import WalletButton from './components/WalletButton.vue'
import BalanceViewer from './components/BalanceViewer.vue'
import TransferForm from './components/TransferForm.vue'

const { isReady, error, retry } = useFHEVM()
</script>

<template>
  <div class="app">
    <header>
      <h1>🔐 Confidential Token App (Vite + Vue)</h1>

      <p>Privacy-preserving tokens powered by FHEVM</p>

      <WalletButton />
    </header>

    <main>
      <div v-if="error" class="card error">
        <p>❌ Failed to initialize FHEVM: {{ error }}</p>

        <button @click="retry" class="btn-primary">
          Retry
        </button>
      </div>

      <div v-else-if="!isReady" class="card">
        <p>⏳ Loading FHEVM...</p>
      </div>

      <template v-else>
        <BalanceViewer />

        <TransferForm />
      </template>
    </main>

    <footer>
      <p>
        Built with
        <a href="https://www.npmjs.com/package/@fhevmsdk/core" target="_blank">
          @fhevmsdk/core
        </a>
        | Powered by
        <a href="https://www.zama.ai/" target="_blank">
          Zama
        </a>
      </p>
    </footer>
  </div>
</template>
