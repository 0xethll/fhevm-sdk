'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react'
import type { FHEVMClient, CreateFHEVMClientOptions } from '@fhevm/core'
import { initFHEVM, createFHEVMClient } from '@fhevm/core'

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

interface FHEVMContextType {
  client: FHEVMClient | null
  isReady: boolean
  error: string | null
  retry: () => void
}

const FHEVMContext = createContext<FHEVMContextType | null>(null)

interface FHEVMProviderProps {
  children: ReactNode
  network?: 'sepolia'
  config?: CreateFHEVMClientOptions
}

export function FHEVMProvider({
  children,
  network = 'sepolia',
  config,
}: FHEVMProviderProps) {
  const [client, setClient] = useState<FHEVMClient | null>(globalFHEVMClient)
  const [isReady, setIsReady] = useState(globalIsInitialized)
  const [error, setError] = useState<string | null>(globalError)
  const isMountedRef = useRef(true)

  const clientConfig: CreateFHEVMClientOptions = config || { network }

  // Update all states when global state changes
  const updateState = useCallback(() => {
    if (!isMountedRef.current) return
    setClient(globalFHEVMClient)
    setIsReady(globalIsInitialized)
    setError(globalError)
  }, [])

  // Initialize FHEVM with singleton pattern
  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to global state changes
    stateChangeListeners.add(updateState)

    // Initialize if not already done
    if (!globalIsInitialized && !globalInitPromise && !globalError) {
      initializeFHEVMSingleton(clientConfig).catch(() => {
        // Error already handled in initializeFHEVMSingleton
      })
    } else {
      updateState()
    }

    return () => {
      isMountedRef.current = false
      stateChangeListeners.delete(updateState)
    }
  }, [updateState, clientConfig])

  const retry = useCallback(() => {
    if (!isMountedRef.current) return

    // Reset global state
    globalFHEVMClient = null
    globalIsInitialized = false
    globalInitPromise = null
    globalError = null

    setError(null)

    initializeFHEVMSingleton(clientConfig).catch(() => {
      // Error already handled
    })
  }, [clientConfig])

  const contextValue: FHEVMContextType = {
    client,
    isReady: isReady && !!client && !error,
    error,
    retry,
  }

  return (
    <FHEVMContext.Provider value={contextValue}>
      {children}
    </FHEVMContext.Provider>
  )
}

export function useFHEVMContext() {
  const context = useContext(FHEVMContext)
  if (!context) {
    throw new Error('useFHEVMContext must be used within a FHEVMProvider')
  }
  return context
}
