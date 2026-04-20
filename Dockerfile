# syntax=docker/dockerfile:1.7
# Multi-stage build for bsp-id-web (Next.js)
# - sdk-builder: builds @biological-sovereignty-protocol/sdk from a pinned git ref
# - app-builder: installs deps and builds Next.js using the pre-built SDK
# - runner:      minimal production image running as non-root

ARG SDK_REF=v2.1.0

FROM node:22-alpine AS sdk-builder
RUN apk add --no-cache git
ARG SDK_REF
WORKDIR /sdk
# Pin the SDK by ref (tag, branch or commit) so builds are reproducible.
RUN git clone --depth 1 --branch "${SDK_REF}" \
      https://github.com/Biological-Sovereignty-Protocol/bsp-sdk-typescript.git . \
 || git clone --depth 1 \
      https://github.com/Biological-Sovereignty-Protocol/bsp-sdk-typescript.git . \
 && npm install --no-audit --no-fund \
 && npm run build

FROM node:22-alpine AS app-builder
WORKDIR /app

# SDK needs to be available at the same path referenced by package.json (file: link)
COPY --from=sdk-builder /sdk /bsp-sdk-typescript

# Install node deps first (better layer cache)
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# -------- Production runner --------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Create a non-root user to run the Next.js server
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy built artifacts and runtime deps with correct ownership
COPY --from=sdk-builder --chown=nextjs:nodejs /sdk /bsp-sdk-typescript
COPY --from=app-builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=app-builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=app-builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=app-builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
