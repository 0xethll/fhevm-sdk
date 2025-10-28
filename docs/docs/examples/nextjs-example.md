---
sidebar_position: 1
---

# Next.js Example

Complete Next.js application using FHEVM SDK.

📦 **[View on GitHub](https://github.com/0xethll/fhevm-sdk/tree/main/examples/fhevm-nextjs)**

## Project Structure

```
fhevm-nextjs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── ConnectWallet.tsx
│   └── ConfidentialToken.tsx
├── config/
│   └── wagmi.ts
└── package.json
```

## Key Files

### providers.tsx

```tsx
'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FHEVMProvider } from '@fhevmsdk/react'
import { config } from '@/config/wagmi'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          {children}
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### ConfidentialToken.tsx

```tsx
'use client'

import { useConfidentialBalance, useConfidentialTransfer } from '@fhevmsdk/react'
import { tokenABI } from '@/abi/token'

export function ConfidentialToken() {
  const { decryptedBalance, revealBalance, isRevealing, formatBalance } =
    useConfidentialBalance({
      contractAddress: '0x...',
      abi: tokenABI,
    })

  const { transfer, isLoading, isSuccess } = useConfidentialTransfer({
    contractAddress: '0x...',
    abi: tokenABI,
  })

  return (
    <div>
      <h2>Confidential Token</h2>
      {decryptedBalance ? (
        <p>Balance: {formatBalance(decryptedBalance)}</p>
      ) : (
        <button onClick={revealBalance} disabled={isRevealing}>
          Reveal Balance
        </button>
      )}
    </div>
  )
}
```

## Running the Example

### Clone the Repository

```bash
git clone https://github.com/0xethll/fhevm-sdk.git
cd fhevm-sdk/examples/fhevm-nextjs
```

### Install and Run

```bash
pnpm install
pnpm run dev
```

Visit http://localhost:3000

## Source Code

View the complete source code on GitHub: [examples/fhevm-nextjs](https://github.com/0xethll/fhevm-sdk/tree/main/examples/fhevm-nextjs)
