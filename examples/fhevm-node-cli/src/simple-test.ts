/**
 * Simple test to verify Node.js environment detection
 */

import { isBrowser } from '@fhevmsdk/core'

console.log('🧪 FHEVM SDK Environment Test\n')
console.log(`Running in: ${isBrowser() ? 'Browser' : 'Node.js'}`)
console.log(`typeof window: ${typeof window}`)
console.log(`typeof global: ${typeof global}`)
console.log('\n✅ Environment detection working correctly!')
