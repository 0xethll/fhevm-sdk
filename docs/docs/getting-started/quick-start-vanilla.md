---
sidebar_position: 4
---

# Vanilla JS Quick Start

Use FHEVM SDK in any JavaScript/TypeScript project without a framework.

## Installation

Install the core package:

```bash
pnpm install @fhevmsdk/core viem
```

## Basic Usage

### Initialize FHEVM

Before using any FHE functionality, initialize the FHEVM instance:

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'

// Initialize FHEVM (call this once when your app starts)
await initFHEVM()

// Create a client
const client = await createFHEVMClient({
  network: 'sepolia', // or 'mainnet'
})

console.log('FHEVM client ready!')
```

### Encrypt Data

Encrypt values before sending them to smart contracts:

```typescript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

// Get wallet client from MetaMask or other provider
const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const [userAddress] = await walletClient.getAddresses()

// Encrypt a uint64 value
const encrypted = await client.encrypt.uint64({
  value: 1000000n,
  contractAddress: '0x1234567890123456789012345678901234567890',
  userAddress,
})

```

### Decrypt Data

Decrypt confidential values (requires user signature):

```typescript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const decrypted = await client.decrypt({
  ciphertextHandle: '0xabcdef...', // Handle from contract
  contractAddress: '0x1234567890123456789012345678901234567890',
  walletClient, // Uses EIP-712 signing
})

console.log('Decrypted value:', decrypted)
```

### All Encryption Types

FHEVM supports multiple integer types:

```typescript
// uint8 (0 to 255)
const encrypted8 = await client.encrypt.uint8({
  value: 42n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// uint16 (0 to 65,535)
const encrypted16 = await client.encrypt.uint16({
  value: 1000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// uint32 (0 to 4,294,967,295)
const encrypted32 = await client.encrypt.uint32({
  value: 1000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// uint64 (0 to 18,446,744,073,709,551,615)
const encrypted64 = await client.encrypt.uint64({
  value: 1000000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// uint128
const encrypted128 = await client.encrypt.uint128({
  value: 1000000000000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// uint256
const encrypted256 = await client.encrypt.uint256({
  value: 1000000000000000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})
```

## Complete Example

Here's a complete example of a confidential token transfer:

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'
import { createWalletClient, createPublicClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'

// Contract ABI (simplified)
const tokenABI = [
  {
    name: 'confidentialTransfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'encryptedAmount', type: 'bytes32' },
      { name: 'inputProof', type: 'bytes' },
    ],
    outputs: [],
  },
] as const

async function transferConfidentialTokens() {
  // 1. Initialize FHEVM
  await initFHEVM()
  const fhevmClient = await createFHEVMClient({ network: 'sepolia' })

  // 2. Setup wallet
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  })

  const [userAddress] = await walletClient.getAddresses()

  // 3. Encrypt the amount
  const contractAddress = '0x1234567890123456789012345678901234567890'
  const encrypted = await fhevmClient.encrypt.uint64({
    value: 1000000n, // Amount to transfer
    contractAddress,
    userAddress,
  })

  // 4. Send transaction
  const hash = await walletClient.writeContract({
    address: contractAddress,
    abi: tokenABI,
    functionName: 'confidentialTransfer',
    args: [
      '0x9876543210987654321098765432109876543210', // recipient
      encrypted.handle, 
      encrypted.proof
    ],
    account: userAddress,
  })

  console.log('Transaction sent:', hash)

  // 5. Wait for confirmation
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  console.log('Transaction confirmed:', receipt)
}

// Run the transfer
transferConfidentialTokens().catch(console.error)
```

## Utility Functions

The core package includes helpful utility functions:

```typescript
import {
  formatTokenAmount,
  parseTokenAmount,
  uint8ArrayToHex,
} from '@fhevmsdk/core'

// Format token amounts for display
const formatted = formatTokenAmount(1000000n, 18) // "0.000001"

// Parse user input to BigInt
const amount = parseTokenAmount('1.5', 18) // 1500000000000000000n

// Convert Uint8Array to hex string
const hex = uint8ArrayToHex(new Uint8Array([1, 2, 3])) // "0x010203"
```

## Network Configuration

Get configuration for different networks:

```typescript
import { getNetworkConfig } from '@fhevmsdk/core'

// Get Sepolia config
const sepoliaConfig = getNetworkConfig('sepolia')
console.log('ACL Address:', sepoliaConfig.aclAddress)
console.log('Gateway URL:', sepoliaConfig.gatewayUrl)

// Get mainnet config
const mainnetConfig = getNetworkConfig('mainnet')
```

## Using with HTML

You can use FHEVM SDK in a simple HTML page:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>FHEVM Demo</title>
  </head>
  <body>
    <h1>Confidential Transfer</h1>
    <button id="transfer">Transfer Tokens</button>

    <script type="module">
      import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'

      document.getElementById('transfer').addEventListener('click', async () => {
        try {
          await initFHEVM()
          const client = await createFHEVMClient({ network: 'sepolia' })

          // Your transfer logic here
          console.log('FHEVM client ready!')
        } catch (error) {
          console.error('Error:', error)
        }
      })
    </script>
  </body>
</html>
```

## Error Handling

Always handle errors when working with encryption:

```typescript
try {
  await initFHEVM()
  const client = await createFHEVMClient({ network: 'sepolia' })

  const encrypted = await client.encrypt.uint64({
    value: 1000n,
    contractAddress: '0x...',
    userAddress: '0x...',
  })
} catch (error) {
  if (error instanceof Error) {
    console.error('Encryption failed:', error.message)

    // Handle specific error types
    if (error.message.includes('network')) {
      console.error('Network configuration error')
    } else if (error.message.includes('wallet')) {
      console.error('Wallet connection error')
    }
  }
}
```

## Next Steps

- **API Reference**: Explore the complete [Core API](../api-reference/core/client)
- **Framework Integration**: See how to use with [React](./quick-start-react) or [Vue](./quick-start-vue)
- **Advanced Usage**: Learn about [network configuration](../guides/network-configuration)
- **Best Practices**: Follow our [best practices guide](../guides/best-practices)

## TypeScript

For TypeScript projects, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Node.js Usage

FHEVM SDK can also be used in Node.js environments:

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// Use a private key instead of browser wallet
const account = privateKeyToAccount('0x...')

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
})

await initFHEVM()
const client = await createFHEVMClient({ network: 'sepolia' })

// Use as normal
const encrypted = await client.encrypt.uint64({
  value: 1000n,
  contractAddress: '0x...',
  userAddress: account.address,
})
```

## Troubleshooting

See the [Troubleshooting Guide](../troubleshooting) for common issues and solutions.
