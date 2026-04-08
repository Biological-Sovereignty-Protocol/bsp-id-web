![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![License](https://img.shields.io/badge/license-Apache%202.0-blue)

# bsp-id-web

> Screenshots: see `/docs/screenshots/`

`bsp-id-web` is the reference web identity interface for the Biological Sovereignty Protocol. It lets any individual register a decentralized biological identity (BEO), manage cryptographic keys in their own browser, delegate access to institutions via ConsentTokens, and configure social recovery — all without a backend holding their private keys. Operators (hospitals, clinics, research institutions) can fork this repo, apply their own brand, and deploy their own sovereign identity portal for their users.

---

## Features

- **Gasless onboarding** — users register `.bsp` domains at zero cost; the operator wallet funds Arweave gas on their behalf
- **Browser-based key generation** — Ed25519 keys are derived from a BIP39 seed phrase entirely inside the browser via TweetNaCl; the server never sees a private key
- **Shamir social recovery** — 2-of-3 threshold key splitting lets users nominate guardians who can collectively restore access without any single guardian holding the full key
- **ConsentToken UI** — users issue and revoke cryptographic tokens that authorize specific institutions to read or write their health data
- **Key export and backup** — users can download an AES-256-GCM encrypted key backup file at any time
- **Guardian management** — full UI to add, replace, and audit recovery guardians
- **i18n ready** — ships with `i18next`; default locale is configurable via env var

---

## Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + `tokens.css` custom properties |
| Cryptography | TweetNaCl (Ed25519 sign/verify), BIP39 (seed phrases), secrets.js-grempe (Shamir SSS) |
| Key storage | IndexedDB via `classic-level` — client-only, never synced to server |
| On-chain ops | AO processes on Arweave |
| Animations | Framer Motion |

For full protocol specifications, see the [`bsp-spec`](https://github.com/Biological-Sovereignty-Protocol/bsp-spec) repository.

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A deployed BSP relayer URL (or use the public testnet endpoint)
- An Arweave operator wallet with sufficient AR balance (for gasless relay)

---

## Getting Started

```bash
git clone https://github.com/Biological-Sovereignty-Protocol/bsp-id-web.git
cd bsp-id-web
npm install
cp .env.example .env.local
# edit .env.local — see the Environment Variables section below
npm run dev
```

The app starts at `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `ARWEAVE_NETWORK` | Required | Arweave network to target | `testnet` or `mainnet` |
| `ARWEAVE_OPERATOR_KEY` | Required | JSON-serialized Arweave JWK wallet used to relay transactions on behalf of users | `{"kty":"RSA","n":"..."}` |
| `BSP_REGISTRY_URL` | Required | Base URL of the BSP Registry API | `https://api.biologicalsovereigntyprotocol.com` |
| `BSP_PROCESS_BEO_REGISTRY` | Required | AO process ID for the BEO (Biological Entity Object) registry | `<process_id>` |
| `BSP_PROCESS_IEO_REGISTRY` | Required | AO process ID for the IEO (Institutional Entity Object) registry | `<process_id>` |
| `BSP_PROCESS_DOMAIN_REGISTRY` | Required | AO process ID for the `.bsp` domain registry | `<process_id>` |
| `BSP_PROCESS_ACCESS_CONTROL` | Required | AO process ID for access control (ConsentToken enforcement) | `<process_id>` |
| `ARWEAVE_BALANCE_ALERT_THRESHOLD` | Optional | Minimum AR balance before an alert fires | `1.0` |
| `ALERT_EMAIL` | Optional | Email address for low-balance alerts | `ops@yourorg.com` |
| `NEXT_PUBLIC_APP_URL` | Required | Public base URL of this deployment | `https://id.yourorg.com` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Optional | Default UI locale | `pt-BR` or `en` |
| `NEXT_PUBLIC_EXPLORER_URL` | Optional | Arweave block explorer base URL for transaction links | `https://viewblock.io/arweave/tx/` |

---

## Forking and Customizing

This repo is designed to be forked by any institution that wants to run its own identity portal.

1. Fork on GitHub.
2. Edit `src/styles/tokens.css` to apply your brand colors, typography, and radius tokens — no component changes needed.
3. Replace `/public/logo.svg` and `/public/favicon.ico` with your own assets.
4. Update `NEXT_PUBLIC_APP_URL` and the contract addresses in your `.env.local`.
5. Deploy (see below).

For a detailed walkthrough, see [`/docs/FORKING.md`](/docs/FORKING.md).

---

## Deploying

Deployed via Coolify (self-hosted on VPS). For any deployment:

```bash
npm run build
npm start
```

Use behind a reverse proxy (nginx, Caddy, Coolify, etc.).

---

## Key Security Model

- **Keys never leave the browser.** Ed25519 key pairs are generated from the user's BIP39 seed phrase using TweetNaCl, then stored in IndexedDB on the user's device. No server receives, stores, or transmits private key material.
- **Key export.** When a user requests a backup, the app encrypts their private key with AES-256-GCM (using a password they choose) and offers it as a download. The plaintext key is discarded from memory immediately after encryption.
- **Social recovery.** The seed phrase is split into 3 shares using Shamir's Secret Sharing (2-of-3 threshold). Each share goes to a different guardian chosen by the user. Any two guardians can cooperate to reconstruct the seed — no single guardian can do it alone, and the BSP protocol never holds any share.
- **Operator relay.** The operator wallet only signs Arweave gas transactions. It cannot read or modify user identity data, which is protected by the user's own Ed25519 key pair.

---

## Contributing

Pull requests are welcome. Please open an issue first for significant changes. All contributions must pass `npm run lint` and `npm run build`.

---

## License

MIT. This software belongs to the community.

*The protocol belongs to the world. Sovereignty belongs to the individual.*
