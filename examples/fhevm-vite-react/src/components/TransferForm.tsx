import { useState } from 'react'
import { useConfidentialTransfer } from '@fhevmsdk/react'
import { CONFIDENTIAL_TOKEN } from '../contracts'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'

export function TransferForm() {
  const { address } = useAccount()

  const [recipient, setRecipient] = useState('')

  const [amount, setAmount] = useState('')

  const {
    transfer,
    isLoading,
    isSuccess,
    txHash,
    error,
    reset,
  } = useConfidentialTransfer({
    contractAddress: CONFIDENTIAL_TOKEN.address,
    abi: CONFIDENTIAL_TOKEN.abi,
    decimals: 6,
  })

  const handleTransfer = async () => {
    if (!isAddress(recipient)) {
      alert('Invalid recipient address')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Invalid amount')
      return
    }

    await transfer({ to: recipient, amount })
  }

  if (!address) {
    return (
      <div className="card">
        <p>Connect your wallet to transfer tokens</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>📤 Transfer Tokens</h2>

      <div className="form">
        <div className="form-group">
          <label>Recipient Address</label>

          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Amount</label>

          <input
            type="text"
            placeholder="10.5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={isLoading || !recipient || !amount}
          className="btn-primary"
        >
          {isLoading ? '⏳ Transferring...' : '🚀 Send Private Transfer'}
        </button>
      </div>

      {isSuccess && txHash && (
        <div className="success">
          ✅ Transfer successful!
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
          <button onClick={reset} className="btn-secondary">
            Send Another
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          ❌ Error: {error}
          <button onClick={reset} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}

      <p className="hint">
        🔐 The transfer amount is encrypted. No one can see how much you're
        sending!
      </p>
    </div>
  )
}