import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'
import type { EncryptedValue, EncryptParams } from './types'

/**
 * Generic encryption function
 */
async function encryptValue(
  fheInstance: FhevmInstance,
  params: EncryptParams,
  addMethod: (input: any) => void,
): Promise<EncryptedValue> {
  const { value, contractAddress, userAddress } = params

  const input = fheInstance.createEncryptedInput(contractAddress, userAddress)
  addMethod(input)

  const encryptedInput = await input.encrypt()

  return {
    handle: encryptedInput.handles[0],
    proof: encryptedInput.inputProof,
  }
}

/**
 * Encrypt an 8-bit unsigned integer
 */
export async function encryptUint8(
  fheInstance: FhevmInstance,
  params: EncryptParams,
): Promise<EncryptedValue> {
  return encryptValue(fheInstance, params, (input) => input.add8(params.value))
}

/**
 * Encrypt a 16-bit unsigned integer
 */
export async function encryptUint16(
  fheInstance: FhevmInstance,
  params: EncryptParams,
): Promise<EncryptedValue> {
  return encryptValue(fheInstance, params, (input) => input.add16(params.value))
}

/**
 * Encrypt a 32-bit unsigned integer
 */
export async function encryptUint32(
  fheInstance: FhevmInstance,
  params: EncryptParams,
): Promise<EncryptedValue> {
  return encryptValue(fheInstance, params, (input) => input.add32(params.value))
}

/**
 * Encrypt a 64-bit unsigned integer
 */
export async function encryptUint64(
  fheInstance: FhevmInstance,
  params: EncryptParams,
): Promise<EncryptedValue> {
  return encryptValue(fheInstance, params, (input) => input.add64(params.value))
}

/**
 * Encrypt a 128-bit unsigned integer
 */
export async function encryptUint128(
  fheInstance: FhevmInstance,
  params: EncryptParams,
): Promise<EncryptedValue> {
  return encryptValue(fheInstance, params, (input) =>
    input.add128(params.value),
  )
}

/**
 * Encrypt a 256-bit unsigned integer
 */
export async function encryptUint256(
  fheInstance: FhevmInstance,
  params: EncryptParams,
): Promise<EncryptedValue> {
  return encryptValue(fheInstance, params, (input) =>
    input.add256(params.value),
  )
}
