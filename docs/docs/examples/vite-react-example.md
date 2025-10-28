---
sidebar_position: 2
---

# Vite + React Example

Complete Vite + React application using FHEVM SDK.

📦 **[View on GitHub](https://github.com/0xethll/fhevm-sdk/tree/main/examples/fhevm-vite-react)**

## Project Structure

```
fhevm-vite-react/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ConnectWallet.tsx
│   │   └── TokenBalance.tsx
│   └── config/
│       └── wagmi.ts
├── package.json
└── vite.config.ts
```

## Key Files

### main.tsx

```tsx
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevmsdk/react'
import App from './App'
import { config } from './config/wagmi'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <FHEVMProvider network="sepolia">
        <App />
      </FHEVMProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
```

### TokenBalance.tsx

```tsx
import { useConfidentialBalance } from '@fhevmsdk/react'
import { tokenABI } from '../abi/token'

export function TokenBalance() {
  const { decryptedBalance, revealBalance, formatBalance } =
    useConfidentialBalance({
      contractAddress: '0x...',
      abi: tokenABI,
    })

  return (
    <div>
      {decryptedBalance ? (
        <p>{formatBalance(decryptedBalance)} tokens</p>
      ) : (
        <button onClick={revealBalance}>Reveal Balance</button>
      )}
    </div>
  )
}
```

## Running the Example

### Clone the Repository

```bash
git clone https://github.com/0xethll/fhevm-sdk.git
cd fhevm-sdk/examples/fhevm-vite-react
```

### Install and Run

```bash
pnpm install
pnpm run dev
```

Visit http://localhost:5173

## Source Code

View the complete source code on GitHub: [examples/fhevm-vite-react](https://github.com/0xethll/fhevm-sdk/tree/main/examples/fhevm-vite-react)
