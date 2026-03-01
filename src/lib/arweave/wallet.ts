import { arweave } from './client'

/**
 * Returns the operator wallet configured in the environment.
 * In a true production fork, this handles the Gasless Relaying.
 * NOTE: Since this is a client-side Next app, for pure serverless deployment, 
 * these writes SHOULD be proxies through a Next.js API Route so the operator key
 * is never exposed to the browser.
 */
export function getOperatorWallet() {
    const keyString = process.env.ARWEAVE_OPERATOR_KEY
    if (!keyString) {
        throw new Error('ARWEAVE_OPERATOR_KEY is not configured')
    }

    try {
        return JSON.parse(keyString)
    } catch (e) {
        throw new Error('ARWEAVE_OPERATOR_KEY is invalid JSON')
    }
}

/**
 * Checks the balance of the operator wallet.
 */
export async function getOperatorBalanceAR(): Promise<number> {
    try {
        const wallet = getOperatorWallet()
        const address = await arweave.wallets.getAddress(wallet)
        const winston = await arweave.wallets.getBalance(address)
        return parseFloat(arweave.ar.winstonToAr(winston))
    } catch {
        return 0
    }
}
