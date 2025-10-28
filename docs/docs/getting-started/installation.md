---
sidebar_position: 1
---

# Installation

Get started with FHEVM SDK by installing the appropriate packages for your framework.

## Prerequisites

Before installing FHEVM SDK, ensure you have:

- **Node.js** version 18.0 or higher
- **npm**, **yarn**, or **pnpm** package manager
- A web3 wallet (e.g., MetaMask) for browser-based applications

## Package Selection

FHEVM SDK is split into multiple packages. Choose the ones you need:

### Core Package (Required)

The `@fhevmsdk/core` package is framework-agnostic and can be used in any JavaScript/TypeScript project.

```bash
# Using npm
npm install @fhevmsdk/core

# Using yarn
yarn add @fhevmsdk/core

# Using pnpm
pnpm add @fhevmsdk/core
```

### React Package

For React applications, install both `@fhevmsdk/core` and `@fhevmsdk/react`:

```bash
# Using npm
npm install @fhevmsdk/core @fhevmsdk/react

# Using yarn
yarn add @fhevmsdk/core @fhevmsdk/react

# Using pnpm
pnpm add @fhevmsdk/core @fhevmsdk/react
```

**Peer Dependencies:**
```bash
npm install react wagmi @tanstack/react-query viem
```

### Vue Package

For Vue 3 applications, install both `@fhevmsdk/core` and `@fhevmsdk/vue`:

```bash
# Using npm
npm install @fhevmsdk/core @fhevmsdk/vue

# Using yarn
yarn add @fhevmsdk/core @fhevmsdk/vue

# Using pnpm
pnpm add @fhevmsdk/core @fhevmsdk/vue
```

**Peer Dependencies:**
```bash
npm install vue @wagmi/vue @tanstack/vue-query viem
```

## Version Compatibility

| Package | React | Vue | Viem | Wagmi |
|---------|-------|-----|------|-------|
| @fhevmsdk/core | - | - | ^2.0.0 | - |
| @fhevmsdk/react | ^19.1.0 | - | ^2.0.0 | ^2.0.0 |
| @fhevmsdk/vue | - | ^3.5.0 | ^2.0.0 | @wagmi/vue ^0.2.14 |

## Verify Installation

After installation, verify everything is working:

```typescript
import { initFHEVM } from '@fhevmsdk/core'

// Should not throw any errors
console.log('FHEVM SDK installed successfully!')
```

## Next Steps

Now that you have FHEVM SDK installed, continue with a quick start guide for your framework:

- [React Quick Start](./quick-start-react) - Build a React app with FHEVM
- [Vue Quick Start](./quick-start-vue) - Build a Vue app with FHEVM
- [Vanilla JS Quick Start](./quick-start-vanilla) - Use FHEVM without a framework

## Troubleshooting

For more help, see the [Troubleshooting](../troubleshooting) guide.
