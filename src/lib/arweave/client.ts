import Arweave from 'arweave'
import { WarpFactory } from 'warp-contracts'

export const ARWEAVE_NETWORK = process.env.ARWEAVE_NETWORK || 'testnet'

// Initialize the core Arweave client
export const arweave = Arweave.init(
    ARWEAVE_NETWORK === 'mainnet'
        ? { host: 'arweave.net', port: 443, protocol: 'https' }
        : { host: 'testnet.redstone.tools', port: 443, protocol: 'https' }
)

// Initialize the SmartWeave interpretation engine
export const warp = ARWEAVE_NETWORK === 'mainnet'
    ? WarpFactory.forMainnet()
    : WarpFactory.forTestnet()

// Contract IDs loaded from environment variables
export const contracts = {
    beoRegistry: process.env.BSP_CONTRACT_BEO_REGISTRY as string,
    ieoRegistry: process.env.BSP_CONTRACT_IEO_REGISTRY as string,
    domainRegistry: process.env.BSP_CONTRACT_DOMAIN_REGISTRY as string,
    accessControl: process.env.BSP_CONTRACT_ACCESS_CONTROL as string,
}
