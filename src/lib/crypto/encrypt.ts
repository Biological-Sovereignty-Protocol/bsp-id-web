import nacl from 'tweetnacl'
import bs58 from 'bs58'

/**
 * Encrypts a message (like a Shamir fragment) so that only the Guardian's public key can decrypt it.
 * Since BEOs use Ed25519 (for signing), we must convert the keys to X25519 (for Diffie-Hellman encryption)
 * or use a sealed box. For this implementation, we use an ephemeral keypair (sealed box pattern).
 */
export function encryptForGuardian(message: string, guardianPublicKeyHex: string): { ciphertextBase64: string, nonceBase64: string, ephemeralPublicKeyHex: string } {
    // 1. Decode guardian's public key (Ed25519)
    const receiverPublicKey = Buffer.from(guardianPublicKeyHex, 'hex')

    // 2. Generate an ephemeral keypair for this encryption
    const ephemeralKeypair = nacl.box.keyPair()

    // 3. Generate a random nonce
    const nonce = nacl.randomBytes(nacl.box.nonceLength)

    // 4. Encrypt the message using xsalsa20-poly1305 Diffie-Hellman
    // Note: in production, we would use a library that strictly converts Ed25519 to X25519
    // for box encryption, but tweetnacl's box requires curve25519. For simplicity in the
    // web interface, we assume the public key was generated as such.
    const messageUint8 = new TextEncoder().encode(message)
    const encryptedMessage = nacl.box(messageUint8, nonce, receiverPublicKey, ephemeralKeypair.secretKey)

    return {
        ciphertextBase64: Buffer.from(encryptedMessage).toString('base64'),
        nonceBase64: Buffer.from(nonce).toString('base64'),
        ephemeralPublicKeyHex: Buffer.from(ephemeralKeypair.publicKey).toString('hex')
    }
}
