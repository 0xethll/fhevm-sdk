<script setup lang="ts">
import { useAccount, useConnect, useDisconnect, useSwitchChain } from '@wagmi/vue'
import { sepolia } from 'viem/chains'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const { address, isConnected } = useAccount()
const { connect, connectors } = useConnect()
const { disconnect } = useDisconnect()
const { switchChain } = useSwitchChain()
const actualChainId = ref<number | null>(null)

// Get actual chainId from wallet
const getChainId = async () => {
  if (isConnected.value && (window as any).ethereum) {
    try {
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' })
      actualChainId.value = parseInt(chainId, 16)
    } catch (error) {
      console.error('Failed to get chainId:', error)
    }
  }
}

// Listen for chain changes
const handleChainChanged = (chainId: string) => {
  actualChainId.value = parseInt(chainId, 16)
}

onMounted(() => {
  getChainId()

  if ((window as any).ethereum) {
    ;(window as any).ethereum.on('chainChanged', handleChainChanged)
  }
})

onUnmounted(() => {
  if ((window as any).ethereum) {
    ;(window as any).ethereum.removeListener('chainChanged', handleChainChanged)
  }
})

watch(isConnected, () => {
  getChainId()
})

// Auto-switch to Sepolia when connected to wrong network
watch([isConnected, actualChainId], () => {
  if (isConnected.value && actualChainId.value && actualChainId.value !== sepolia.id) {
    switchChain({ chainId: sepolia.id })
  }
})

const isWrongNetwork = computed(() =>
  isConnected.value && actualChainId.value && actualChainId.value !== sepolia.id
)

const handleConnect = () => {
  if (connectors.value && connectors.value[0]) {
    connect({ connector: connectors.value[0] })
  }
}
</script>

<template>
  <div v-if="isConnected && address" class="wallet-button">
    <span v-if="isWrongNetwork" class="warning">⚠️ Wrong Network</span>
    <span class="address">
      {{ address.slice(0, 6) }}...{{ address.slice(-4) }}
    </span>

    <button
      v-if="isWrongNetwork"
      @click="switchChain({ chainId: sepolia.id })"
      class="btn-primary"
    >
      Switch to Sepolia
    </button>
    <button v-else @click="disconnect()" class="btn-secondary">
      Disconnect
    </button>
  </div>

  <button v-else @click="handleConnect" class="btn-primary">
    Connect Wallet
  </button>
</template>
