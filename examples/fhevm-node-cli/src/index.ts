/**
 * FHEVM SDK Node.js CLI Example
 *
 * This example demonstrates how to use @fhevmsdk/core in a Node.js environment
 * without a browser. It shows:
 * 1. Initializing the FHEVM SDK
 * 2. Creating an FHEVM client with RPC provider
 * 3. Encrypting values
 * 4. Generating keypairs for decryption
 */

import { initFHEVM, createFHEVMClient } from '@fhevmsdk/core'
import { createWalletClient, http, parseEther } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const RPC_URL = process.env.RPC_URL || 'https://eth-sepolia.public.blastapi.io'
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as `0x${string}`
const USER_ADDRESS = process.env.USER_ADDRESS as `0x${string}`

async function main() {
  console.log('🚀 FHEVM SDK Node.js Example\n')
  console.log('Environment: Node.js')
  console.log(`RPC URL: ${RPC_URL}`)
  console.log(`Contract: ${CONTRACT_ADDRESS}`)
  console.log(`User: ${USER_ADDRESS}\n`)

  try {
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
    const valueToEncrypt = 1000000n
    console.log(`   Value: ${valueToEncrypt}`)

    const encrypted = await client.encrypt.uint64({
      value: valueToEncrypt,
      contractAddress: CONTRACT_ADDRESS,
      userAddress: USER_ADDRESS,
    })

    console.log('✅ Value encrypted successfully')
    console.log(`   Encrypted data: ${encrypted.data.slice(0, 50)}...`)
    console.log(`   Encrypted data length: ${encrypted.data.length}\n`)

    // Step 4: Generate keypair for user decryption
    console.log('🔑 Step 4: Generating keypair for decryption...')
    const keypair = client.instance.generateKeypair()
    console.log('✅ Keypair generated')
    console.log(`   Public key: ${keypair.publicKey.slice(0, 50)}...`)
    console.log(`   Private key: ${keypair.privateKey.slice(0, 50)}...\n`)

    // Step 5: Create EIP-712 signature structure
    console.log('📝 Step 5: Creating EIP-712 signature structure...')
    const eip712 = client.instance.createEIP712(
      keypair.publicKey,
      [CONTRACT_ADDRESS],
      Math.floor(Date.now() / 1000), // startTimestamp
      30, // durationDays
    )
    console.log('✅ EIP-712 structure created')
    console.log(`   Domain: ${JSON.stringify(eip712.domain, null, 2)}`)
    console.log(`   Primary type: ${eip712.primaryType}\n`)

    // Step 6: Get public key from instance
    console.log('🔓 Step 6: Getting network public key...')
    const publicKeyInfo = client.instance.getPublicKey()
    if (publicKeyInfo) {
      console.log('✅ Public key retrieved')
      console.log(`   Key ID: ${publicKeyInfo.publicKeyId}`)
      console.log(`   Key size: ${publicKeyInfo.publicKey.length} bytes\n`)
    } else {
      console.log('⚠️  No public key available\n')
    }

    console.log('✨ All operations completed successfully!')
    console.log('\n📌 Next steps:')
    console.log('   - Set PRIVATE_KEY in .env to enable transaction signing')
    console.log('   - Use client.decrypt() to decrypt values from contracts')
    console.log('   - Integrate with your confidential smart contracts')

  } catch (error) {
    console.error('❌ Error:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  }
}

// Run the example
main()
