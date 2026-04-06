FROM node:22-alpine AS base

# Install git for cloning SDK dependency
RUN apk add --no-cache git

# Clone the SDK that package.json references via file:../bsp-sdk-typescript
RUN git clone --depth 1 https://github.com/Biological-Sovereignty-Protocol/bsp-sdk-typescript /bsp-sdk-typescript

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (npm resolves file:../bsp-sdk-typescript -> /bsp-sdk-typescript)
RUN npm install

# Copy app source
COPY . .

# Build Next.js
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
