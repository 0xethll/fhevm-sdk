/**
 * FHEVM SDK Node.js CLI Example
 *
 * This example demonstrates how to use @fhevmsdk/core in a Node.js environment
 * without a browser. It shows:
 * 1. Initializing the FHEVM SDK
 * 2. Creating an FHEVM client with RPC provider
 * 3. Encrypting values
 * 4. Reading encrypted balances from contract
 * 5. Decrypting values with EIP-712 signature
 */

import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'
import { createWalletClient, createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const RPC_URL = process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}` | undefined

// Confidential Token Contract (from examples/fhevm-vite-react)
const CONFIDENTIAL_TOKEN = {
  address: '0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19' as const,
  abi: [
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'confidentialBalanceOf',
      outputs: [{ internalType: 'euint64', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
}

async function main() {
  console.log('🚀 FHEVM SDK Node.js Example\n')
  console.log('Environment: Node.js')
  console.log(`RPC URL: ${RPC_URL}`)

  // Check required environment variables
  if (!PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY not set in .env file')
    console.log('   Please add your private key to .env:')
    console.log('   PRIVATE_KEY=0x...')
    process.exit(1)
  }

  try {
    // Create wallet from private key
    const account = privateKeyToAccount(PRIVATE_KEY)
    console.log(`User Address: ${account.address}\n`)

    // Step 1: Initialize FHEVM SDK
    console.log('📦 Step 1: Initializing FHEVM SDK...')
    await initFHEVM()
    console.log('✅ FHEVM SDK initialized\n')

    // Step 2: Create FHEVM client with RPC provider
    console.log('🔧 Step 2: Creating FHEVM client...')
    const client = await createFHEVMClient({
      network: 'sepolia',
      provider: RPC_URL, // Node.js: use RPC URL string
    })
    console.log('✅ FHEVM client created')
    console.log(`   Client ready: ${client.isReady}\n`)

    // Step 3: Encrypt a value
    console.log('🔐 Step 3: Encrypting a uint64 value...')
    const valueToEncrypt = 42000n
    console.log(`   Value to encrypt: ${valueToEncrypt}`)
    console.log(`   Contract: ${CONFIDENTIAL_TOKEN.address}`)

    const { handle, proof } = await client.encrypt.uint64({
      value: valueToEncrypt,
      contractAddress: CONFIDENTIAL_TOKEN.address,
      userAddress: account.address,
    })

    console.log('✅ Value encrypted successfully')
    console.log(`   Encrypted handle: ${handle}`)
    console.log(`   Proof length: ${proof.length} bytes\n`)

    // Step 4: Read encrypted balance from contract
    console.log('📖 Step 4: Reading encrypted balance from contract...')
    console.log(`   Contract: ${CONFIDENTIAL_TOKEN.address}`)
    console.log(`   Reading confidentialBalanceOf(${account.address})...`)

    // Create public client for reading
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(RPC_URL),
    })

    const encryptedBalance = await publicClient.readContract({
      address: CONFIDENTIAL_TOKEN.address,
      abi: CONFIDENTIAL_TOKEN.abi,
      functionName: 'confidentialBalanceOf',
      args: [account.address],
    })

    console.log('✅ Encrypted balance retrieved')
    console.log(`   Ciphertext handle: ${encryptedBalance}\n`)

    // Step 5: Decrypt the balance
    console.log('🔓 Step 5: Decrypting balance...')
    console.log('   Creating wallet client for signing...')

    // Create wallet client for signing
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(RPC_URL),
    })

    console.log('   📝 Generating keypair and signing EIP-712 message...')

    let decryptedBalance
    if (encryptedBalance != '0x0000000000000000000000000000000000000000000000000000000000000000') {
      decryptedBalance = await client.decrypt({
        ciphertextHandle: encryptedBalance,
        contractAddress: CONFIDENTIAL_TOKEN.address,
        walletClient,
      })
    } else {
      decryptedBalance = 0n
    }

    console.log('✅ Decryption successful!')
    console.log(`   Decrypted balance: ${decryptedBalance}`)

    // Get decimals for proper formatting
    const decimals = await publicClient.readContract({
      address: CONFIDENTIAL_TOKEN.address,
      abi: CONFIDENTIAL_TOKEN.abi,
      functionName: 'decimals',
    })

    const formattedBalance = Number(decryptedBalance) / 10 ** Number(decimals)
    console.log(`   Formatted balance: ${formattedBalance} tokens\n`)

    // Step 6: Get network public key info
    console.log('🔓 Step 6: Getting network public key info...')
    const publicKeyInfo = client.instance.getPublicKey()
    if (publicKeyInfo) {
      console.log('✅ Public key retrieved')
      console.log(`   Key ID: ${publicKeyInfo.publicKeyId}`)
      console.log(`   Key size: ${publicKeyInfo.publicKey.length} bytes\n`)
    } else {
      console.log('⚠️  No public key available\n')
    }

    console.log('✨ All operations completed successfully!')
    console.log('\n📌 Summary:')
    console.log('   ✅ SDK initialized')
    console.log('   ✅ Client created')
    console.log('   ✅ Value encrypted')
    console.log('   ✅ Encrypted balance read from contract')
    console.log('   ✅ Balance decrypted successfully')
    console.log(`   💰 Your balance: ${formattedBalance} tokens`)

  } catch (error) {
    console.error('\n❌ Error:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      if (error.stack) {
        console.error('   Stack:', error.stack)
      }
    }
    process.exit(1)
  }
}

// Run the example
main()
