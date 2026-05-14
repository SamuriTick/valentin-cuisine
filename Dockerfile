# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@11 && npm ci

COPY . .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npx prisma generate
RUN npm run build


# ---- Stage 2: Production Image ----
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
