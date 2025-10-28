---
sidebar_position: 3
---

# Next.js Integration

Guide for integrating FHEVM SDK with Next.js.

## Installation

```bash
pnpm install @fhevmsdk/core @fhevmsdk/react wagmi @tanstack/react-query viem
```

## Client-Only Components

FHEVM SDK runs in the browser. Use `'use client'` directive:

```tsx
'use client'

import { FHEVMProvider } from '@fhevmsdk/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          {children}
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## App Router

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Pages Router

```tsx
// pages/_app.tsx
import { WagmiProvider } from 'wagmi'
import { FHEVMProvider } from '@fhevmsdk/react'

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FHEVMProvider network="sepolia">
          <Component {...pageProps} />
        </FHEVMProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Notes

- ✅ Always use `'use client'` for FHEVM components
- ✅ Initialize providers at root level
- ⚠️ Don't use FHEVM in Server Components
