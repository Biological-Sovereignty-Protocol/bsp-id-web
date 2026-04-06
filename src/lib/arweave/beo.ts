import { arweave, warp, contracts } from './client'

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function createBEO(domain: string, publicKeyHex: string, recoveryConfig: any) {
    if (isDemo) {
        await new Promise(r => setTimeout(r, 2000))
        return { txId: 'demo_' + Date.now(), status: 'ok' }
    }

    // We send this to the /api/relay proxy so the server pays the gas
    const payload = { domain, publicKey: publicKeyHex, recovery: recoveryConfig }

    // In production, the client would sign this payload here:
    // const signature = signBSPTransaction(payload, getLocalPrivateKey())

    const response = await fetch('/api/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contract: 'BEORegistry',
            function: 'createBEO',
            payload,
            signature: 'dummy_signature_for_testnet',
            publicKey: publicKeyHex
        })
    })

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to relay BEO creation')
    }

    return response.json()
}

export async function getBEO(domain: string) {
    if (isDemo) {
        return {
            domain,
            publicKey: 'demo_public_key',
            createdAt: new Date().toISOString(),
            status: 'active',
            consents: [],
            biorecords: 3,
            guardians: { total: 3, active: 0 }
        }
    }

    // Reads are free and public, no relay needed. Connect via Warp directly.
    const swContract = warp.contract(contracts.beoRegistry)
    const { cachedValue } = await swContract.readState()

    // Reverse lookup domain -> id using index
    const state: any = cachedValue.state
    if (!state.domainIndex) return null

    const id = state.domainIndex[domain]
    if (!id) return null

    return state.beos[id]
}
