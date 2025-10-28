---
sidebar_position: 6
---

# Error Handling

Best practices for handling errors in FHEVM applications.

## Common Errors

### FHEVM Not Ready

```tsx
const { isReady, error } = useFHEVM()

if (error) {
  return <div>FHEVM Error: {error}</div>
}
```

### Wallet Not Connected

```tsx
const { canEncrypt } = useEncrypt()

if (!canEncrypt) {
  return <div>Please connect your wallet</div>
}
```

### Permission Denied

```tsx
try {
  await decrypt({ ciphertextHandle, contractAddress })
} catch (error) {
  if (error.message.includes('permission')) {
    alert('You do not have permission to decrypt this value')
  }
}
```

### User Rejected Signature

```tsx
try {
  await decrypt({ ... })
} catch (error) {
  if (error.message.includes('rejected')) {
    console.log('User cancelled the request')
  }
}
```

## Best Practices

1. ✅ Always check `isReady` before using FHEVM
2. ✅ Provide clear error messages to users
3. ✅ Handle permission errors gracefully
4. ✅ Allow users to retry after errors
5. ✅ Log errors for debugging
