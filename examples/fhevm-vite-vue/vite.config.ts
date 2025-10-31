import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      // To add only specific polyfills, add them here
      // If no option is passed, all polyfills are included
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
  ],

  optimizeDeps: {
    exclude: ['@zama-fhe/relayer-sdk'],
  },
})
