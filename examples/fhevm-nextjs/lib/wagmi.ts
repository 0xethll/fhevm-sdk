import { http, createConfig, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: fallback([
        http(sepoliaRpcUrl),
        http('https://ethereum-sepolia-rpc.publicnode.com'),
      ]),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'FHEVM SDK Example',
    appDescription: 'Example application using FHEVM SDK',
    appUrl: 'https://zama.ai',
  }),
)
