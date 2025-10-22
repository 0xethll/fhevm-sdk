import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WagmiProvider, createConfig, http, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevmsdk/react'
import { injected } from 'wagmi/connectors'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <App />
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)