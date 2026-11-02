FROM node:24-alpine AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BACKEND_API_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_NODE_ENV=production
ARG NEXT_PUBLIC_LOGOUT_SECRET_KEY
ARG BACKEND_API_URL
ARG API_URL

ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV
ENV NEXT_PUBLIC_LOGOUT_SECRET_KEY=$NEXT_PUBLIC_LOGOUT_SECRET_KEY
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV API_URL=$API_URL
ENV NODE_ENV=production

RUN LOGOUT_SECRET_KEY=docker-build-placeholder npm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
