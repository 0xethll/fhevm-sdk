import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect, useState } from 'react'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [actualChainId, setActualChainId] = useState<number | null>(null)

  // Get actual chainId from wallet
  useEffect(() => {
    const getChainId = async () => {
      if (isConnected && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          setActualChainId(parseInt(chainId, 16))
        } catch (error) {
          console.error('Failed to get chainId:', error)
        }
      }
    }

    getChainId()

    // Listen for chain changes
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        setActualChainId(parseInt(chainId, 16))
      }
      window.ethereum.on('chainChanged', handleChainChanged)
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [isConnected])

  // Auto-switch to Sepolia when connected to wrong network
  useEffect(() => {
    if (isConnected && actualChainId && actualChainId !== sepolia.id) {
      switchChain({ chainId: sepolia.id })
    }
  }, [isConnected, actualChainId, switchChain])

  const isWrongNetwork = isConnected && actualChainId && actualChainId !== sepolia.id

  if (isConnected && address) {
    return (
      <div className="wallet-button">
        {isWrongNetwork && (
          <span className="warning">⚠️ Wrong Network</span>
        )}
        <span className="address">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>

        {isWrongNetwork ? (
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="btn-primary"
          >
            Switch to Sepolia
          </button>
        ) : (
          <button onClick={() => disconnect()} className="btn-secondary">
            Disconnect
          </button>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="btn-primary"
    >
      Connect Wallet
    </button>
  )
}