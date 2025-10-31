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
4. **Reads encrypted balance** - From the confidential token contract
5. **Decrypts balance** - Using EIP-712 signature (handled automatically by SDK)

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
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Create account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY)

// Initialize SDK
await initFHEVM()

// Create FHEVM client with RPC URL
const client = await createFHEVMClient({
  network: 'sepolia',
  provider: RPC_URL,
})

// Encrypt a value
const encrypted = await client.encrypt.uint64({
  value: 42000n,
  contractAddress: '0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19',
  userAddress: account.address,
})

// Read encrypted balance from contract
const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC_URL) })
const encryptedBalance = await publicClient.readContract({
  address: '0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19',
  abi: CONFIDENTIAL_TOKEN.abi,
  functionName: 'confidentialBalanceOf',
  args: [account.address],
})

// Decrypt the balance (EIP-712 signing handled automatically)
const walletClient = createWalletClient({ account, chain: sepolia, transport: http(RPC_URL) })
const decrypted = await client.decrypt({
  ciphertextHandle: encryptedBalance,
  contractAddress: '0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19',
  walletClient,
})

console.log(`Balance: ${decrypted}`)
```

## Environment Variables

- `RPC_URL` - Ethereum RPC endpoint (default: Sepolia public RPC)
- `PRIVATE_KEY` - **Required** - Your wallet private key for signing EIP-712 messages

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
