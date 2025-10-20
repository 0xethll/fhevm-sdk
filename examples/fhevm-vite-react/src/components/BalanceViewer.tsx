import { useConfidentialBalance } from '@fhevmsdk/react'
import { CONFIDENTIAL_TOKEN } from '../contracts'
import { useAccount } from 'wagmi'

export function BalanceViewer() {
  const { address } = useAccount()

  const {
    decryptedBalance,
    isVisible,
    isDecrypting,
    revealBalance,
    hideBalance,
    formatBalance,
  } = useConfidentialBalance({
    contractAddress: CONFIDENTIAL_TOKEN.address,
    abi: CONFIDENTIAL_TOKEN.abi,
    decimals: 6,
  })

  if (!address) {
    return (
      <div className="card">
        <p>Connect your wallet to view balance</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>💰 Your Balance</h2>

      {isVisible && decryptedBalance !== null ? (
        <div>
          <p className="balance">{formatBalance(decryptedBalance)} TOKENS</p>

          <button onClick={hideBalance} className="btn-secondary">
            🔒 Hide Balance
          </button>
        </div>
      ) : (
        <div>
          <p className="encrypted">🔐 Balance is encrypted on-chain</p>

          <button
            onClick={revealBalance}
            disabled={isDecrypting}
            className="btn-primary"
          >
            {isDecrypting ? 'Decrypting...' : '👁️ Reveal Balance'}
          </button>
        </div>
      )}

      <p className="hint">
        ℹ️ Your balance is stored encrypted. Only you can decrypt it with your
        signature.
      </p>
    </div>
  )
}