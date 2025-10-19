'use client'

import { useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import {
  useFHEVM,
  useEncrypt,
  useDecrypt,
  useConfidentialBalance,
  useConfidentialTransfer,
} from '@fhevmsdk/react'
import { Abi } from 'viem'

import { CONTRACTS } from '@/lib/contracts'

// Example contract configuration
const TOKEN_ADDRESS = CONTRACTS.CONFIDENTIAL_TOKEN.address as `0x${string}` 
const TOKEN_ABI: Abi = CONTRACTS.CONFIDENTIAL_TOKEN.abi

export default function Home() {
  const { isReady, error: fhevmError, retry } = useFHEVM()
  const { encryptUint64, isEncrypting, error: encryptError } = useEncrypt()
  const { decrypt, isDecrypting, error: decryptError } = useDecrypt()

  const {
    encryptedBalance,
    decryptedBalance,
    isVisible,
    revealBalance,
    hideBalance,
    formatBalance,
  } = useConfidentialBalance({
    contractAddress: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    decimals: 6,
  })

  const {
    transfer,
    isLoading: isTransferring,
    isSuccess: transferSuccess,
    error: transferError,
  } = useConfidentialTransfer({
    contractAddress: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    decimals: 6,
  })

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const handleTransfer = async () => {
    try {
      await transfer({
        to: recipient,
        amount,
      })
      setRecipient('')
      setAmount('')
    } catch (err) {
      console.error('Transfer failed:', err)
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>FHEVM SDK Example</h1>

      {/* Wallet Connection */}
      <div style={{ marginBottom: '2rem' }}>
        <ConnectKitButton />
      </div>

      {/* FHEVM Status */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>FHEVM Status</h2>
        {fhevmError ? (
          <div>
            <p style={{ color: 'red' }}>Error: {fhevmError}</p>
            <button onClick={retry}>Retry</button>
          </div>
        ) : isReady ? (
          <p style={{ color: 'green' }}>✓ FHEVM Ready</p>
        ) : (
          <p>Loading FHEVM...</p>
        )}
      </div>

      {/* Balance Display */}
      {isReady && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Confidential Balance</h2>
          <p>Encrypted: {encryptedBalance || 'N/A'}</p>
          {isVisible && decryptedBalance !== null ? (
            <div>
              <p>Balance: {formatBalance(decryptedBalance)}</p>
              <button onClick={hideBalance}>Hide</button>
            </div>
          ) : (
            <button onClick={revealBalance} disabled={isDecrypting}>
              {isDecrypting ? 'Decrypting...' : 'Reveal Balance'}
            </button>
          )}
          {decryptError && <p style={{ color: 'red' }}>{decryptError}</p>}
        </div>
      )}

      {/* Transfer Form */}
      {isReady && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Confidential Transfer</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Recipient address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ padding: '0.5rem' }}
            />
            <button
              onClick={handleTransfer}
              disabled={isTransferring || !recipient || !amount}
              style={{ padding: '0.5rem' }}
            >
              {isTransferring ? 'Transferring...' : 'Transfer'}
            </button>
          </div>
          {transferSuccess && (
            <p style={{ color: 'green' }}>Transfer successful!</p>
          )}
          {transferError && <p style={{ color: 'red' }}>{transferError}</p>}
        </div>
      )}

      {/* Encryption Example */}
      {isReady && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Direct Encryption Example</h2>
          <button
            onClick={async () => {
              try {
                const result = await encryptUint64({
                  value: 1000000n,
                  contractAddress: TOKEN_ADDRESS,
                })
                console.log('Encrypted:', result)
                alert('Check console for encrypted result')
              } catch (err) {
                console.error('Encryption failed:', err)
              }
            }}
            disabled={isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt 1.0 Token'}
          </button>
          {encryptError && <p style={{ color: 'red' }}>{encryptError}</p>}
        </div>
      )}
    </main> 
  )
}
