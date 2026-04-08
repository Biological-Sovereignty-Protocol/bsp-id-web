import { apiPost, apiGet } from '../api'

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function createBEO(domain: string, publicKeyHex: string, recoveryConfig: any, signature: string, nonce: string, timestamp: string) {
    if (isDemo) {
        await new Promise(r => setTimeout(r, 2000))
        return { transactionId: 'demo_' + Date.now(), success: true }
    }

    return apiPost('/api/relayer/beo', {
        domain,
        publicKey: publicKeyHex,
        recovery: recoveryConfig,
        signature,
        nonce,
        timestamp,
    })
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

    const result = await apiGet(`/api/beos/domain/${encodeURIComponent(domain)}`)
    return result.beo
}
