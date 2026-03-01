# Biological Sovereignty Protocol (BSP) - Web Identity Interface

**`bsp-id-web`** is the official reference web application for creating and managing decentralized biological identities (`BEO`). 

It is constructed entirely on the frontend with a Gasless Relay architecture. All user private keys are generated via the **Web Crypto API** (Ed25519) and securely stored in IndexedDB. Private keys *never* leave the user's browser.

## Features

- **Gasless Onboarding**: Users register their `.bsp` domains for free. The operator wallet pays the Arweave gas.
- **Client-Side Cryptography**: Deterministic Ed25519 BIP-39 seed generation inside the browser.
- **Shamir Social Recovery**: Built-in 2-of-3 threshold splitting for secure BEO recovery via Guardians securely inside the UI.
- **Consent Issuance**: UI for users to issue cryptographic `ConsentTokens` authorizing Institutions to read/write their data.
- **Fork-Friendly Design**: 100% themeable via simple CSS custom properties (`tokens.css`).

## Architecture

This project is built with:
- **Next.js 15 (App Router)**
- **Tailwind CSS v4**
- **Warp SmartWeave Contracts**
- **TweetNaCL (Ed25519)** & **Secrets.js (Shamir)** 

For full technical specifications, please visit the central [`bsp-spec`](https://github.com/Biological-Sovereignty-Protocol/bsp-spec) repository.

## Getting Started

1. Clone the repository: `git clone https://github.com/Biological-Sovereignty-Protocol/bsp-id-web.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure the operator wallet.
4. Run locally: `npm run dev`

## Documentation

- [How to Fork and Theme this Repo](/docs/FORKING.md)
- [Protocol Specifications](https://github.com/Biological-Sovereignty-Protocol/bsp-spec)

## License

This software is released under the MIT License and belongs to the community.
*The protocol belongs to the world. Sovereignty belongs to the individual.*
