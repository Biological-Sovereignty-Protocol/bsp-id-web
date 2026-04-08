import { NextResponse } from 'next/server'
import { warp, contracts } from '@/lib/arweave/client'
import { getOperatorWallet } from '@/lib/arweave/wallet'

/**
 * POST /api/relay
 * Gasless Proxy for BSP Transactions.
 * 
 * The client browser (which holds the user's private key) generates a signed intent and 
 * sends it here. This secure server route validates the signature and pays the Arweave 
 * gas using the ARWEAVE_OPERATOR_KEY so the user doesn't have to pay.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { function: fn, contract, payload, signature, publicKey } = body

        if (!fn || !contract || !payload || !signature || !publicKey) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Verify the Ed25519 signature against the payload
        const { CryptoUtils } = await import('@biological-sovereignty-protocol/sdk')
        const isValid = CryptoUtils.verifySignature(payload, signature, publicKey)
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid Ed25519 signature' }, { status: 401 })
        }

        // 2. Load the Operator Wallet (Gas Payer)
        const wallet = getOperatorWallet()

        // 3. Select Target Contract
        let targetContractId = ''
        if (contract === 'BEORegistry') targetContractId = contracts.beoRegistry
        if (contract === 'AccessControl') targetContractId = contracts.accessControl
        if (contract === 'IEORegistry') targetContractId = contracts.ieoRegistry

        if (!targetContractId) {
            return NextResponse.json({ error: 'Invalid or unconfigured target contract' }, { status: 400 })
        }

        // 4. Relay the write interaction to SmartWeave
        const swContract = warp.contract(targetContractId).connect(wallet)
        const result = await swContract.writeInteraction({
            function: fn,
            ...payload
        })

        return NextResponse.json({
            success: true,
            transactionId: result?.originalTxId
        })

    } catch (e: any) {
        console.error('Relay Error:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
