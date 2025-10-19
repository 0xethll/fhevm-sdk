# FHEVM Next.js Example

Example Next.js application demonstrating the usage of FHEVM SDK for building confidential dApps.

## 🚀 Features

This example demonstrates:

- ✅ FHEVM SDK integration with Next.js 15
- ✅ Wallet connection with ConnectKit
- ✅ Confidential balance reading and decryption
- ✅ Confidential token transfers
- ✅ Direct encryption/decryption examples
- ✅ Error handling and loading states
- ✅ TypeScript throughout

## 📦 Installation

```bash
# Install dependencies
pnpm install

# or with npm
npm install
```

## 🔧 Configuration

1. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

2. Add your WalletConnect Project ID:

Get one at [WalletConnect Cloud](https://cloud.walletconnect.com)

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

3. Update contract addresses in `app/page.tsx`:

```typescript
const TOKEN_ADDRESS = '0x...' // Your confidential token contract
const TOKEN_ABI = [...] // Your contract ABI
```

## 🏃 Running

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextjs/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page with FHEVM examples
│   └── providers.tsx    # Wagmi + FHEVM providers setup
├── lib/
│   └── wagmi.ts         # Wagmi configuration
├── .env.example         # Environment variables template
└── package.json
```

## 🎯 Key Components

### Providers Setup (`app/providers.tsx`)

```tsx
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { FHEVMProvider } from '@fhevmsdk/react'

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <FHEVMProvider network="sepolia">
            {children}
          </FHEVMProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Using Hooks (`app/page.tsx`)

```tsx
import {
  useFHEVM,
  useConfidentialBalance,
  useConfidentialTransfer,
} from '@fhevmsdk/react'

function Component() {
  const { isReady } = useFHEVM()
  const { revealBalance, decryptedBalance } = useConfidentialBalance({...})
  const { transfer } = useConfidentialTransfer({...})

  // Your component logic
}
```

## 📚 Learn More

### FHEVM SDK Documentation

- [@fhevmsdk/core](../../packages/core/README.md) - Core SDK API
- [@fhevmsdk/react](../../packages/react/README.md) - React hooks API

### Next.js Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Wagmi Documentation

- [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- [ConnectKit](https://docs.family.co/connectkit) - Wallet connection UI

### Zama Documentation

- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Zama Home](https://zama.ai)

## 🔐 Contract Requirements

Your confidential token contract should implement:

```solidity
// Read encrypted balance
function confidentialBalanceOf(address account)
  external view returns (uint256)

// Transfer with encrypted amount
function confidentialTransfer(
  address to,
  bytes calldata encryptedAmount,
  bytes calldata proof
) external returns (bool)
```

See [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts) for reference implementations.

## ⚠️ Notes

1. **Network**: This example uses Sepolia testnet
2. **MetaMask**: Requires MetaMask or compatible wallet
3. **Gas**: You'll need Sepolia ETH for gas fees
4. **Contract**: Update `TOKEN_ADDRESS` and `TOKEN_ABI` to match your deployed contract

## 🐛 Troubleshooting

### FHEVM not initializing

- Ensure MetaMask is installed and connected
- Check browser console for errors
- Try the "Retry" button

### Transaction failing

- Verify contract address and ABI are correct
- Ensure you have sufficient token balance
- Check gas balance (Sepolia ETH)

### Build errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check Node.js version (18+)

## 📄 License

MIT
