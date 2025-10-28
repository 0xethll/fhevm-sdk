---
sidebar_position: 7
---

# Best Practices

Recommended patterns and practices for FHEVM SDK.

## Performance

### Use Smallest Type

```typescript
// ✅ Good
await encryptUint8({ value: 1n, ... }) // For boolean

// ❌ Bad
await encryptUint256({ value: 1n, ... }) // Wasteful
```

### Batch Operations

```typescript
// ✅ Good
const results = await Promise.all([
  encrypt.uint64({ value: 100n, ... }),
  encrypt.uint64({ value: 200n, ... }),
])

// ❌ Bad
const r1 = await encrypt.uint64({ value: 100n, ... })
const r2 = await encrypt.uint64({ value: 200n, ... })
```

## Security

### Don't Auto-Decrypt

```typescript
// ✅ Good: User must click
<button onClick={revealBalance}>Reveal</button>

// ❌ Bad: Automatic decryption
useEffect(() => {
  decrypt({ ... }) // Privacy violation!
}, [])
```

### Clear Sensitive Data

```typescript
// ✅ Good: Clear after use
const balance = await decrypt({ ... })
displayBalance(balance)
// balance goes out of scope

// ❌ Bad: Store globally
window.userBalance = await decrypt({ ... })
```

## UX

### Loading States

```tsx
{isEncrypting && <Spinner />}
<button disabled={isEncrypting}>
  {isEncrypting ? 'Encrypting...' : 'Submit'}
</button>
```

### Error Feedback

```tsx
{error && (
  <div className="error">
    {error}
    <button onClick={retry}>Retry</button>
  </div>
)}
```

## TypeScript

```typescript
// ✅ Use bigint for values
const amount: bigint = 1000n

// ❌ Don't use number
const amount: number = 1000 // Type error
```

