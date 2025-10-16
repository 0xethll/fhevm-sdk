# @fhevm/core

Framework-agnostic core SDK for FHEVM (Fully Homomorphic Encryption Virtual Machine).

## 📦 Installation

```bash
npm install @fhevm/core viem
```

## 🚀 Quick Start

```typescript
import { initFHEVM, createFHEVMClient } from '@fhevm/core'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

// 1. Initialize SDK (call once)
await initFHEVM()

// 2. Create client
const client = await createFHEVMClient({
  network: 'sepolia', // or custom NetworkConfig
})

// 3. Encrypt values
const encrypted = await client.encrypt.uint64({
  value: 1000000n,
  contractAddress: '0x...',
  userAddress: '0x...',
})

// 4. Use in contract call
await contract.transfer(recipient, encrypted.handle, encrypted.proof)

// 5. Decrypt values (requires viem WalletClient with user signature)
const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const decrypted = await client.decrypt({
  ciphertextHandle: '0x...',
  contractAddress: '0x...',
  walletClient, // viem WalletClient (not ethers Signer)
})
```

## 📚 API Reference

### `initFHEVM()`

Initialize the FHEVM SDK. Must be called once before creating any clients.

```typescript
await initFHEVM()
```

**Note:** Only works in browser environments.

### `createFHEVMClient(options)`

Create an FHEVM client instance.

```typescript
const client = await createFHEVMClient({
  network: 'sepolia', // or custom NetworkConfig
  provider: window.ethereum, // optional, defaults to window.ethereum
})
```

#### Options

- `network`: `'sepolia' | NetworkConfig` - Network to connect to
- `provider`: `any` - Ethereum provider (default: `window.ethereum`)

#### Returns

`FHEVMClient` with the following properties:

- `instance`: Raw FhevmInstance from @zama-fhe/relayer-sdk
- `isReady`: boolean
- `encrypt`: Object with encryption methods
- `decrypt`: Decryption method

### Encryption Methods

All encryption methods accept `EncryptParams`:

```typescript
interface EncryptParams {
  value: bigint          // Value to encrypt
  contractAddress: string // Target contract address
  userAddress: string    // User's wallet address
}
```

All methods return `EncryptedValue`:

```typescript
interface EncryptedValue {
  handle: Uint8Array  // Encrypted data handle
  proof: Uint8Array   // Proof of encryption
}
```

#### Available Methods

- `client.encrypt.uint8(params)` - Encrypt 8-bit unsigned integer
- `client.encrypt.uint16(params)` - Encrypt 16-bit unsigned integer
- `client.encrypt.uint32(params)` - Encrypt 32-bit unsigned integer
- `client.encrypt.uint64(params)` - Encrypt 64-bit unsigned integer
- `client.encrypt.uint128(params)` - Encrypt 128-bit unsigned integer
- `client.encrypt.uint256(params)` - Encrypt 256-bit unsigned integer

### Decryption Method

```typescript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const decrypted = await client.decrypt({
  ciphertextHandle: '0x...', // Encrypted handle from contract
  contractAddress: '0x...',   // Contract address
  walletClient,               // viem WalletClient for EIP-712 signature
})
```

Returns `bigint` - The decrypted value

**Note:** The wallet client must have an `account` property. When using wagmi, use `useWalletClient()` hook which provides the correct type.

### Utility Functions

#### `formatTokenAmount(amount, decimals)`

Format a bigint token amount for display.

```typescript
import { formatTokenAmount } from '@fhevm/core'

formatTokenAmount(1000000n, 6) // "1.0"
formatTokenAmount(1500000n, 6) // "1.5"
```

#### `parseTokenAmount(amount, decimals)`

Parse a string amount to bigint.

```typescript
import { parseTokenAmount } from '@fhevm/core'

parseTokenAmount("1.5", 6) // 1500000n
```

#### `uint8ArrayToHex(arr)`

Convert Uint8Array to hex string.

```typescript
import { uint8ArrayToHex } from '@fhevm/core'

uint8ArrayToHex(new Uint8Array([1, 2, 3])) // "0x010203"
```

#### `isBrowser()`

Check if code is running in browser environment.

```typescript
import { isBrowser } from '@fhevm/core'

if (isBrowser()) {
  // Browser-specific code
}
```

## 🔧 Network Configuration

### Built-in Networks

- `sepolia` - Sepolia testnet (default)

### Custom Network

```typescript
import { createFHEVMClient, NetworkConfig } from '@fhevm/core'

const customNetwork: NetworkConfig = {
  network: 'custom',
  aclAddress: '0x...',
  gatewayURL: 'https://...',
  kmsVerifierAddress: '0x...',
  relayerURL: 'https://...',
}

const client = await createFHEVMClient({
  network: customNetwork,
})
```

## 📝 Type Definitions

```typescript
import type {
  FHEVMClient,
  EncryptParams,
  EncryptedValue,
  DecryptParams,
  NetworkConfig,
  FhevmInstance,
} from '@fhevm/core'
```

## ⚠️ Important Notes

1. **Browser Only**: This SDK only works in browser environments (requires `window.ethereum`)
2. **Initialize Once**: Call `initFHEVM()` only once before using the SDK
3. **User Signatures**: Decryption requires user signature via EIP-712
4. **Viem v2**: Requires viem v2+ for WalletClient compatibility
5. **Wallet Client**: The wallet client must have an `account` property for signing

## 🔗 Related Packages

- [@fhevm/react](../react) - React hooks and components (uses wagmi + viem)
- [@zama-fhe/relayer-sdk](https://www.npmjs.com/package/@zama-fhe/relayer-sdk) - Underlying FHE SDK
- [viem](https://viem.sh) - TypeScript Interface for Ethereum

## 📄 License

MIT
