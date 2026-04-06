FROM node:22-alpine AS base

# Install git for cloning SDK dependency
RUN apk add --no-cache git

# Clone and build the SDK
RUN git clone --depth 1 https://github.com/Biological-Sovereignty-Protocol/bsp-sdk-typescript /bsp-sdk-typescript \
    && cd /bsp-sdk-typescript \
    && npm install \
    && npm run build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build Next.js
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app and SDK
COPY --from=base /bsp-sdk-typescript /bsp-sdk-typescript
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
