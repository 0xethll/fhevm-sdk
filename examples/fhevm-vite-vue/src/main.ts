import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { WagmiPlugin, createConfig, http, fallback } from '@wagmi/vue'
import { sepolia } from 'viem/chains'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { injected } from '@wagmi/vue/connectors'
import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'

// Configure wagmi
const sepoliaRpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL

const config = createConfig({
  chains: [sepolia],
  connectors: [injected()], // MetaMask, Coinbase Wallet, etc.
  transports: {
    [sepolia.id]: fallback([
      http(sepoliaRpcUrl),
      http('https://ethereum-sepolia-rpc.publicnode.com'),
    ]),
  },
})

const queryClient = new QueryClient()

// Setup FHEVM
const fhevmContext = setupFHEVM({ network: 'sepolia' })

const app = createApp(App)

app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.provide(FHEVMContextKey, fhevmContext)

app.mount('#app')
