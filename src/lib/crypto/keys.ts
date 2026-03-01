import { CryptoUtils } from '@bsp/sdk'
import { generateSeedPhrase, seedPhraseToPrivateKeyBuffer } from './bip39'
import bs58 from 'bs58'
import nacl from 'tweetnacl'

export interface BSPKeyPair {
    publicKeyHex: string
    privateKeyHex: string
    seedPhrase: string[]
}

/**
 * Generates a completely new Ed25519 keypair for a new BEO inside the browser.
 * The Private Key NEVER leaves the device.
 */
export async function generateBSPKeyPair(): Promise<BSPKeyPair> {
    const seedPhrase = generateSeedPhrase()
    const seed = await seedPhraseToPrivateKeyBuffer(seedPhrase)

    // Generate ed25519 keypair from the determinist seed
    const keyPair = nacl.sign.keyPair.fromSeed(seed)

    return {
        publicKeyHex: Buffer.from(keyPair.publicKey).toString('hex'),
        privateKeyHex: Buffer.from(keyPair.secretKey).toString('hex'),
        seedPhrase
    }
}

/**
 * Reconstructs a BSPKeyPair from a 24-word seed phrase
 */
export async function recoverBSPKeyPair(seedPhrase: string[]): Promise<BSPKeyPair> {
    const seed = await seedPhraseToPrivateKeyBuffer(seedPhrase)
    const keyPair = nacl.sign.keyPair.fromSeed(seed)

    return {
        publicKeyHex: Buffer.from(keyPair.publicKey).toString('hex'),
        privateKeyHex: Buffer.from(keyPair.secretKey).toString('hex'),
        seedPhrase
    }
}

/**
 * Signs a BSP intent payload securely before sending it to the Relayer API.
 */
export function signBSPTransaction(payload: any, privateKeyHex: string): string {
    // Uses the deterministic sorting algorithm from the local sdk
    return CryptoUtils.signPayload(payload, privateKeyHex)
}

/**
 * Verifies if a signature is valid against a public key.
 */
export function verifyBSPSignature(payload: any, signature: string, publicKeyHex: string): boolean {
    return CryptoUtils.verifySignature(payload, signature, publicKeyHex)
}
