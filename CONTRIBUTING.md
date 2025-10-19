# Contributing to FHEVM SDK

Thank you for your interest in contributing to FHEVM SDK! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/fhevm-sdk.git
   cd fhevm-sdk
   ```
3. **Install dependencies**
   ```bash
   pnpm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🏗️ Development Workflow

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @fhevmsdk/core build
pnpm --filter @fhevmsdk/react build
```

### Development Mode

```bash
# Run all packages in watch mode
pnpm dev

# Run specific package
pnpm --filter @fhevmsdk/core dev
```

### Type Checking

```bash
# Check types in all packages
pnpm typecheck
```

### Testing

```bash
# Run tests (when available)
pnpm test
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Provide proper type definitions
- Export types for public APIs

### Code Style

- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Follow existing code patterns

### Example

```typescript
/**
 * Encrypt a value for confidential computation
 * @param value - The value to encrypt
 * @param contractAddress - Target contract address
 * @returns Encrypted value with proof
 */
export async function encryptValue(
  value: bigint,
  contractAddress: string,
): Promise<EncryptedValue> {
  // Implementation
}
```

## 📦 Project Structure

```
fhevm-sdk/
├── packages/
│   ├── core/           # Framework-agnostic core
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── react/          # React bindings
│       ├── src/
│       ├── package.json
│       └── README.md
├── examples/
│   └── nextjs/         # Example applications
└── package.json        # Monorepo root
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the issue
2. **Steps to reproduce** - Minimal steps to reproduce the bug
3. **Expected behavior** - What you expected to happen
4. **Actual behavior** - What actually happened
5. **Environment** - Browser, Node.js version, etc.
6. **Code sample** - Minimal code example (if applicable)

## 💡 Suggesting Features

Feature suggestions are welcome! Please:

1. Check if the feature already exists or is planned
2. Describe the use case clearly
3. Explain why it would be useful
4. Provide examples if possible

## 🔀 Pull Request Process

1. **Update documentation** - Update README and inline docs as needed
2. **Follow code style** - Match existing code patterns
3. **Test your changes** - Ensure everything works
4. **Write clear commit messages** - Use conventional commits format
5. **Update CHANGELOG** - Add entry for your changes (if applicable)

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add support for uint256 encryption

fix(react): resolve memory leak in useFHEVM hook

docs(readme): update installation instructions

chore(deps): update @zama-fhe/relayer-sdk to v0.3.0
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Questions?

Feel free to open an issue for any questions or discussions!

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **Documentation** - Improvements, examples, guides
- **Bug fixes** - Fix reported issues
- **Testing** - Add unit and integration tests
- **Examples** - Additional framework examples (Vue, Svelte, etc.)
- **Performance** - Optimization improvements
- **TypeScript** - Better type definitions
- **Features** - New hooks or utilities

## 🔗 Resources

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [@zama-fhe/relayer-sdk](https://www.npmjs.com/package/@zama-fhe/relayer-sdk)

Thank you for contributing! 🎉
