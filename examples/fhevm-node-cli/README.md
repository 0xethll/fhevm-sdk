# FHEVM SDK Node.js CLI Example

A minimal Node.js CLI example demonstrating how to use `@fhevmsdk/core` in a **non-browser environment**.

## Features

- ✅ Works in Node.js (no browser required)
- ✅ Uses RPC provider instead of `window.ethereum`
- ✅ Demonstrates encryption with FHEVM
- ✅ Shows keypair generation for decryption
- ✅ TypeScript support

## Prerequisites

- Node.js >= 22 (required by `@zama-fhe/relayer-sdk`)
- pnpm (for workspace management)

## Setup

1. **Install dependencies** (from monorepo root):

```bash
pnpm install
```

2. **Build the core package**:

```bash
cd packages/core
pnpm build
```

3. **Configure environment**:

```bash
cd examples/fhevm-node-cli
cp .env.example .env
# Edit .env with your values
```

## Usage

Run the example:

```bash
pnpm start
```

Or with watch mode:

```bash
pnpm dev
```

## What it does

1. **Initializes FHEVM SDK** - Loads WASM modules for Node.js
2. **Creates FHEVM client** - Using RPC URL instead of browser provider
3. **Encrypts a value** - Demonstrates uint64 encryption
4. **Generates keypair** - For user decryption operations
5. **Creates EIP-712 structure** - For signing decryption requests

## Key Differences from Browser

| Feature | Browser | Node.js |
|---------|---------|---------|
| Provider | `window.ethereum` | RPC URL string |
| WASM Loading | Auto with `initSDK()` | Auto via `global.TFHE` |
| Signing | MetaMask | Private key via viem |
| Module | `@zama-fhe/relayer-sdk/web` | `@zama-fhe/relayer-sdk/node` |

## Code Example

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'

// Initialize (optional in Node.js, but recommended)
await initFHEVM()

// Create client with RPC URL
const client = await createFHEVMClient({
  network: 'sepolia',
  provider: 'https://eth-sepolia.public.blastapi.io', // RPC URL
})

// Encrypt values
const encrypted = await client.encrypt.uint64({
  value: 1000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// Generate keypair for decryption
const keypair = client.instance.generateKeypair()
```

## Environment Variables

- `RPC_URL` - Ethereum RPC endpoint (default: Sepolia public RPC)
- `CONTRACT_ADDRESS` - Your FHEVM contract address
- `USER_ADDRESS` - User wallet address
- `PRIVATE_KEY` (optional) - For signing transactions

## Troubleshooting

### "Cannot find module"

Make sure you've built the core package:

```bash
cd ../../packages/core && pnpm build
```

### "Node.js version required"

The `@zama-fhe/relayer-sdk` requires Node.js >= 22:

```bash
node --version  # Should be v22.0.0 or higher
```

## Next Steps

- Integrate with your confidential smart contracts
- Add transaction signing with private key
- Implement decryption workflows
- Build a CLI tool for contract interactions

## License

MIT
