import secrets from 'secrets.js-grempe'

/**
 * Splits a private key (hex string) into N shares where T are required to reconstruct it.
 * Uses Shamir's Secret Sharing over a finite field.
 * Default for BSP is 2-of-3 (threshold=2, shares=3).
 */
export function splitShamirSecret(secretHex: string, threshold: number = 2, totalShares: number = 3): string[] {
    if (threshold > totalShares) throw new Error('Threshold cannot be greater than total shares')
    if (totalShares < 2) throw new Error('At least 2 shares are required')

    // secrets.js expects a hex string without a 0x prefix
    return secrets.share(secretHex, totalShares, threshold)
}

/**
 * Reconstructs the original secret from a minimum number of fragments (>= threshold).
 */
export function combineShamirFragments(fragments: string[]): string {
    if (!fragments || fragments.length < 2) {
        throw new Error('At least 2 fragments are required to reconstruct the secret.')
    }

    try {
        const secret = secrets.combine(fragments)
        return secret
    } catch (error) {
        throw new Error('Failed to reconstruct secret. Invalid or mismatched fragments.')
    }
}
