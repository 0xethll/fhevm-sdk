# TypeScript 类型问题解决指南

## 问题：`window.ethereum` 类型错误

在开发 Web3 应用时，经常会遇到 TypeScript 错误：

```
Property 'ethereum' does not exist on type 'Window & typeof globalThis'.
```

## 原因

TypeScript 默认的 `Window` 接口定义中不包含 `ethereum` 属性。这是因为 `ethereum` 是由 MetaMask 等钱包扩展注入的，不是浏览器原生 API。

## 解决方案

### 方案 1：创建类型声明文件 (推荐)

在包的 `src` 目录下创建 `global.d.ts` 文件：

```typescript
// src/global.d.ts
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on: (event: string, callback: (...args: any[]) => void) => void
    removeListener: (event: string, callback: (...args: any[]) => void) => void
    isMetaMask?: boolean
    [key: string]: any
  }
}

declare global {
  interface Window {
    ethereum?: Window['ethereum']
  }
}

export {}
```

**优点：**
- 提供完整的类型定义
- IDE 有更好的自动补全
- 类型安全

**注意：**
- 文件必须有 `export {}` 或 `export` 语句才能被视为模块
- `declare global` 用于扩展全局类型
- TypeScript 会自动识别 `.d.ts` 文件

### 方案 2：使用类型断言

```typescript
// 临时解决方案
const provider = (window as any).ethereum

// 或者更精确的类型断言
interface WindowWithEthereum extends Window {
  ethereum?: any
}
const provider = (window as WindowWithEthereum).ethereum
```

**优点：**
- 快速解决问题
- 不需要额外文件

**缺点：**
- 失去类型安全
- 没有自动补全
- 不推荐在生产代码中使用

### 方案 3：安装类型包

```bash
npm install --save-dev @types/ethereum
```

**注意：** 这个包可能不是最新的或不包含所有 API。

## 本项目的实现

在本 SDK 中，我们采用了**组合方案**：

1. **创建了 `global.d.ts`** - 提供完整的类型定义
2. **使用 `(window as any).ethereum`** - 在运行时检查中使用类型断言

### 为什么这样做？

```typescript
// utils.ts
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).ethereum !== 'undefined'
  )
}
```

在 `typeof` 检查中使用 `(window as any).ethereum` 是因为：

1. **类型检查的限制**
   ```typescript
   // TypeScript 不确定 window.ethereum 是否存在
   typeof window !== 'undefined'  // ✓ window 可能存在
   typeof window.ethereum !== 'undefined'  // ✗ TypeScript 报错
   ```

2. **类型守卫的顺序**
   - 即使我们检查了 `typeof window !== 'undefined'`
   - TypeScript 仍然不确定 `window.ethereum` 是否存在
   - 因为 `ethereum` 是可选属性 (`ethereum?`)

3. **运行时安全**
   ```typescript
   // 运行时检查是安全的
   typeof (window as any).ethereum !== 'undefined'

   // 这不会抛出错误，即使 ethereum 不存在
   // typeof undefined === 'undefined'  // true
   ```

## TypeScript 配置

确保你的 `tsconfig.json` 包含：

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"],  // 包含 DOM 类型
    "skipLibCheck": true,       // 跳过类型检查库文件
    "strict": true              // 启用严格模式
  },
  "include": ["src/**/*"]       // 包含所有 src 文件（包括 .d.ts）
}
```

## 其他常见的 Web3 类型问题

### 1. `BigInt` 类型

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ES2020"],  // 支持 BigInt
    "target": "ES2020"
  }
}
```

### 2. Wagmi/Viem 类型

```bash
# 安装类型包
npm install --save-dev @wagmi/core viem
```

### 3. Ethers.js 类型

```bash
# Ethers v6 自带类型定义
npm install ethers
```

## 最佳实践

1. **优先使用类型声明文件**
   - 为项目添加 `global.d.ts`
   - 提供完整的类型定义

2. **在必要时使用类型断言**
   - 运行时检查中可以使用 `as any`
   - 但在业务逻辑中应避免

3. **保持类型定义最新**
   - 当 Web3 库更新时，更新类型定义
   - 参考官方文档

4. **提供良好的错误提示**
   ```typescript
   if (!window.ethereum) {
     throw new Error('Please install MetaMask')
   }
   ```

## 验证类型是否生效

在 VS Code 中：
1. 打开 `.ts` 文件
2. 输入 `window.`
3. 应该能看到 `ethereum` 的自动补全
4. 鼠标悬停在 `window.ethereum` 上应该显示类型信息

如果没有自动补全：
1. 重启 TypeScript 服务器：`Cmd+Shift+P` → "TypeScript: Restart TS Server"
2. 检查 `tsconfig.json` 的 `include` 配置
3. 确保 `.d.ts` 文件有 `export {}` 或 `export` 语句

## 总结

在本 SDK 中，我们通过以下方式解决了 TypeScript 类型问题：

✅ 创建了 `global.d.ts` 提供类型定义
✅ 在运行时检查中使用类型断言
✅ 保持代码的类型安全和运行时安全
✅ 提供良好的开发体验（自动补全、类型检查）

这种方法既保证了类型安全，又确保了代码在运行时的正确性。
