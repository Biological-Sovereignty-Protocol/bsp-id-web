import * as bip39 from 'bip39'

export function generateSeedPhrase(): string[] {
    // Generate a random 24-word seed phrase (256 bits of entropy)
    const mnemonic = bip39.generateMnemonic(256)
    return mnemonic.split(' ')
}

export function validateSeedPhrase(words: string[]): boolean {
    if (!words || words.length !== 24) return false
    const mnemonic = words.join(' ').trim()
    return bip39.validateMnemonic(mnemonic)
}

export async function seedPhraseToPrivateKeyBuffer(words: string[]): Promise<Uint8Array> {
    if (!validateSeedPhrase(words)) {
        throw new Error('Invalid seed phrase')
    }
    const mnemonic = words.join(' ').trim()
    const seed = await bip39.mnemonicToSeed(mnemonic)
    // Ed25519 uses the first 32 bytes of the seed to generate the keypair
    return new Uint8Array(seed.slice(0, 32))
}
