# How to Fork the Web Identity Interface

The `bsp-id-web` repository is engineered to be forked by any Laboratory, Clinic, or Application Operator who desires to run their own entry point to the Biological Sovereignty Protocol.

## 1. Forking the Repository
Fork this GitHub repository into your organization.

## 2. Operator Wallet setup
By default, the Ambrósio Institute relays gasless transactions (meaning we pay the Arweave gas so the user doesn't have to). If you are running your own fork, you will act as the Relayer.

1. Generate an Arweave Wallet JSON keyfile.
2. Fund it with `$AR`.
3. Set the `ARWEAVE_OPERATOR_KEY` environment variable on your hosting platform.

## 3. Styling & Theming
You do not need to touch any React Component to re-skin the application.
Simply edit `src/styles/tokens.css` and change the colors and typography to match your brand:

```css
:root {
  --color-primary: #YOUR_BRAND_COLOR;
  --font-display: "Your Custom Font", sans-serif;
}
```

## 4. Deploying
This codebase is a standard Next.js App Router project. Deploy via Coolify, Docker, or any Node.js hosting. Ensure your environment variables are mapped to either `testnet` or `mainnet` and point to the valid AO process IDs.
