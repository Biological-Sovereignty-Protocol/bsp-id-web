# Deployment & AI Context

This document provides AI agents and developers with the technical context on how this Next.js project is deployed.

## Hosting

Deployed on **Coolify** (self-hosted VPS, Hostinger) at:
- **URL:** https://id.biologicalsovereigntyprotocol.com
- **Platform:** Coolify with Docker
- **Framework:** Next.js 16

## Build

```bash
npm run build    # next build --webpack (Turbopack disabled)
npm start        # next start
```

**Why `--webpack`?** Turbopack fails to resolve the `@biological-sovereignty-protocol/sdk` package paths. The `--webpack` flag forces the classic bundler.

## Crypto Constraints

- `tweetnacl` (Ed25519) runs in the browser — no native bindings needed
- Key generation, signing, and verification happen client-side via `CryptoUtils`
- All API calls go directly to `bsp-registry-api` (no local relay — removed)
- The registry API verifies Ed25519 signatures before relaying to Aptos

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APTOS_NETWORK` | `testnet`, `mainnet`, or `devnet` |
| `NEXT_PUBLIC_BSP_CONTRACT_ADDRESS` | BSP Move module address on Aptos |
| `NEXT_PUBLIC_BSP_REGISTRY_URL` | Registry API URL |
| `NEXT_PUBLIC_EXPLORER_URL` | `https://explorer.aptoslabs.com/txn/` |
| `NEXT_PUBLIC_CANONICAL_URL` | `https://id.biologicalsovereigntyprotocol.com` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `pt-BR` |
| `NEXT_PUBLIC_DEMO_MODE` | `true` or `false` |
