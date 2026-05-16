import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const globalForPrisma = globalThis as unknown as { _prismaClient: PrismaClient | undefined }

function buildClient(): PrismaClient {
  try {
    const { env } = getCloudflareContext() as { env: CloudflareEnv }
    return new PrismaClient({ adapter: new PrismaD1(env.DB) })
  } catch {
    return new PrismaClient()
  }
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    globalForPrisma._prismaClient ??= buildClient()
    return (globalForPrisma._prismaClient as unknown as Record<string | symbol, unknown>)[prop]
  },
})
