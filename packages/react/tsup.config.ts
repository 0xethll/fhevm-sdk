import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,

  // External dependencies (not bundled)
  external: [
    '@fhevm/core',  // Our core package
    'react',        // React library
    'wagmi',        // Web3 React hooks
    'viem',         // Ethereum library (replaced ethers)
  ],
})
