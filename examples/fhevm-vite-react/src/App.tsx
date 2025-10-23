import { useFHEVM } from '@fhevmsdk/react'
import { WalletButton } from './components/WalletButton'
import { BalanceViewer } from './components/BalanceViewer'
import { TransferForm } from './components/TransferForm'

import './App.css'

function App() {
  const { isReady, error, retry } = useFHEVM()

  return (
    <div className="app">
      <header>
        <h1>🔐 Confidential Token App (Vite + react)</h1>

        <p>Privacy-preserving tokens powered by FHEVM</p>

        <WalletButton />
      </header>

      <main>
        {error ? (
          <div className="card error">
            <p>❌ Failed to initialize FHEVM: {error}</p>

            <button onClick={retry} className="btn-primary">
              Retry
            </button>
          </div>
        ) : !isReady ? (
          <div className="card">
            <p>⏳ Loading FHEVM...</p>
          </div>
        ) : (
          <>
            <BalanceViewer />

            <TransferForm />
          </>
        )}
      </main>

      <footer>
        <p>
          Built with{' '}
          <a href="https://www.npmjs.com/package/@fhevmsdk/react" target="_blank">
            @fhevmsdk/react
          </a>{' '}
          | Powered by{' '}
          <a href="https://www.zama.ai/" target="_blank">
            Zama
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App