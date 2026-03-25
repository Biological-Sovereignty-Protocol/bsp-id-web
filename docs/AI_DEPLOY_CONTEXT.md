# Vercel Deployment & AI Context

This document exists to provide future AI agents and developers with the exact technical context on how this Next.js project is deployed to Vercel, specifically addressing the challenges of cryptography libraries in serverless environments.

## 🚨 Critical Vercel Build Constraints 🚨

The Biological Sovereignty Protocol uses `warp-contracts` to interact with the Arweave blockchain. 
`warp-contracts` relies on `classic-level`, which uses **complex native C++ Node.js bindings**.

If you attempt to build this project on Vercel using the default Node.js Serverless runtime, the `next build` command will **fail** with `ENOMEM` (Out of Memory) or timeout errors because Vercel's temporary build machines cannot compile the C++ binaries.

### The Solution: Edge Runtime & Webpack Aliasing

To deploy this securely and effortlessly to Vercel:

1. **Edge Runtime:** The `src/app/api/relay/route.ts` API route MUST export `export const runtime = 'edge'`. This strips out Node.js native dependencies and forces the V8 Edge environment.
2. **Mocked Relay on Edge:** Since `warp-contracts` uses native Node functions, it cannot be executed fully on the Edge runtime. The deployed Vercel API `/api/relay` mocks the response. For a fully decentralized gasless relay, this API should be hosted on a standard Linux VPS (like Hostinger VPS).
3. **No Turbopack:** Vercel Next.js 16.1.6 uses Turbopack by default, which fails to resolve local `@bsp/sdk` paths. The `package.json` build command MUST specify `next build --webpack`.
4. **Internal SDK Resolution (`tsconfig.json`):** Instead of using npm `file:./lib/sdk` (which causes `Module not found` in Vercel), the `@bsp/sdk` is injected directly into the Next.js compilation step via `tsconfig.json` paths:
   ```json
   "paths": {
       "@/*": ["./src/*"],
       "@bsp/sdk": ["./lib/sdk/src/index.ts"],
       "@bsp/sdk/*": ["./lib/sdk/src/*"]
   }
   ```

## Production Environment Variables

To link this project to Vercel via CLI (`npx vercel --prod`), the following environment variables were injected:

- `ARWEAVE_NETWORK` = `testnet`
- `ARWEAVE_OPERATOR_KEY` = `{"kty":"RSA","n":"..."}` (The JSON JWK for the Gas Payer Wallet)
- `BSP_REGISTRY_URL` = `https://api.biologicalsovereigntyprotocol.com`
- `NEXT_PUBLIC_EXPLORER_URL` = `https://api.biologicalsovereigntyprotocol.com`

## DNS Setup (Hostinger)
The Vercel application is permanently mapped to `id.biologicalsovereigntyprotocol.com`.
In Hostinger's DNS Zone, a `CNAME` record named `id` points exactly to `cname.vercel-dns.com`. Vercel automatically routes the traffic and provisions the SSL certificate.
