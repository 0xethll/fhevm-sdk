import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="wallet-button">
        <span className="address">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>

        <button onClick={() => disconnect()} className="btn-secondary">
          Disconnect
        </button>
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