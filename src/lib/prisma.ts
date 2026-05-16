import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { _prismaClient: PrismaClient | undefined }

function buildClient(): PrismaClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaD1 } = require('@prisma/adapter-d1')
    const { env } = getCloudflareContext() as { env: CloudflareEnv }
    return new PrismaClient({ adapter: new PrismaD1(env.DB) })
  } catch {
    // Local development (no Cloudflare Worker context)
    return new PrismaClient()
  }
}

// Lazy proxy — `getCloudflareContext()` requires a live request context,
// so we defer client construction until the first property access (always inside a handler).
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    globalForPrisma._prismaClient ??= buildClient()
    return (globalForPrisma._prismaClient as unknown as Record<string | symbol, unknown>)[prop]
  },
})
