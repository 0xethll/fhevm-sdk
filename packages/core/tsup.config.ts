import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,

  // Core external dependencies
  external: [
    'viem',                         // peer dependency
    '@zama-fhe/relayer-sdk/bundle', // type import
    '@zama-fhe/relayer-sdk/web',    // dynamic import
  ],
})
