import { ref, readonly, inject, type InjectionKey, type Ref, type DeepReadonly } from 'vue'
import type { FHEVMClient, CreateFHEVMClientOptions } from '@fhevmsdk/core'
import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'

// Global singleton to prevent multiple initializations
let globalFHEVMClient: FHEVMClient | null = null
let globalIsInitialized = false
let globalInitPromise: Promise<FHEVMClient> | null = null
let globalError: string | null = null

// Subscribers for state changes
type StateChangeListener = () => void
const stateChangeListeners = new Set<StateChangeListener>()

const notifyStateChange = () => {
  stateChangeListeners.forEach((listener) => listener())
}

/**
 * Initialize FHEVM singleton instance
 */
const initializeFHEVMSingleton = async (
  options: CreateFHEVMClientOptions,
): Promise<FHEVMClient> => {
  // Return existing instance if already initialized
  if (globalFHEVMClient && globalIsInitialized) {
    return globalFHEVMClient
  }

  // Return existing promise if initialization is in progress
  if (globalInitPromise) {
    return globalInitPromise
  }

  // Start new initialization
  globalInitPromise = (async () => {
    try {
      console.log('[FHEVMProvider] Starting initialization...')
      globalError = null

      // Check if ethereum provider is available
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error(
          'Ethereum provider not available. Please install MetaMask.',
        )
      }
      console.log('[FHEVMProvider] Ethereum provider available')

      // Initialize SDK
      console.log('[FHEVMProvider] Calling initFHEVM...')
      await initFHEVM()
      console.log('[FHEVMProvider] initFHEVM completed')

      // Create instance
      console.log('[FHEVMProvider] Creating FHEVM client...')
      const client = await createFHEVMClient(options)
      console.log('[FHEVMProvider] Client created:', client)

      globalFHEVMClient = client
      globalIsInitialized = true
      notifyStateChange()

      console.log('[FHEVMProvider] Initialization complete!')
      return client
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize FHEVM'
      globalError = errorMessage
      globalInitPromise = null
      console.error('[FHEVMProvider] Initialization error:', err)
      notifyStateChange()
      throw err
    }
  })()

  return globalInitPromise
}

export interface FHEVMContext {
  client: DeepReadonly<Ref<FHEVMClient | null>>
  isReady: DeepReadonly<Ref<boolean>>
  error: DeepReadonly<Ref<string | null>>
  retry: () => void
}

export const FHEVMContextKey: InjectionKey<FHEVMContext> = Symbol('fhevm-context')

/**
 * Initialize FHEVM provider (call this in your app setup)
 *
 * @example
 * ```ts
 * // In main.ts
 * import { createApp } from 'vue'
 * import { setupFHEVM, FHEVMContextKey } from '@fhevmsdk/vue'
 *
 * const fhevmContext = setupFHEVM({ network: 'sepolia' })
 * const app = createApp(App)
 * app.provide(FHEVMContextKey, fhevmContext)
 * ```
 */
export function setupFHEVM(options: CreateFHEVMClientOptions) {
  const client = ref<FHEVMClient | null>(globalFHEVMClient)
  const isReady = ref(globalIsInitialized)
  const error = ref<string | null>(globalError)

  const updateState = () => {
    client.value = globalFHEVMClient
    isReady.value = globalIsInitialized
    error.value = globalError
  }

  const retry = () => {
    // Reset global state
    globalFHEVMClient = null
    globalIsInitialized = false
    globalInitPromise = null
    globalError = null

    error.value = null

    initializeFHEVMSingleton(options).catch(() => {
      // Error already handled
    })
  }

  // Subscribe to global state changes
  stateChangeListeners.add(updateState)

  // Initialize if not already done
  if (!globalIsInitialized && !globalInitPromise && !globalError) {
    initializeFHEVMSingleton(options).catch(() => {
      // Error already handled in initializeFHEVMSingleton
    })
  }

  return {
    client: readonly(client),
    isReady: readonly(isReady),
    error: readonly(error),
    retry,
  }
}

/**
 * Use FHEVM client in components
 *
 * @example
 * ```ts
 * import { useFHEVM } from '@fhevmsdk/vue'
 *
 * const { client, isReady, error, retry } = useFHEVM()
 * ```
 */
export function useFHEVM() {
  const context = inject(FHEVMContextKey)

  if (!context) {
    throw new Error('useFHEVM must be used within a component with FHEVM context provided')
  }

  return context
}
