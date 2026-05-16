import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const globalForPrisma = globalThis as unknown as { _prismaClient: PrismaClient | undefined }

function buildClient(): PrismaClient {
  try {
    const ctx = getCloudflareContext() as { env: CloudflareEnv }
    if (!ctx?.env?.DB) {
      console.error('[prisma] getCloudflareContext() returned no DB binding, falling back')
      return new PrismaClient()
    }
    return new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) })
  } catch (e) {
    console.error('[prisma] getCloudflareContext() threw:', e)
    return new PrismaClient()
  }
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    globalForPrisma._prismaClient ??= buildClient()
    return (globalForPrisma._prismaClient as unknown as Record<string | symbol, unknown>)[prop]
  },
})
