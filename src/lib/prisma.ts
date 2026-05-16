import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

function getClient(): PrismaClient {
  const ctx = getCloudflareContext() as { env: CloudflareEnv }
  return new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) })
}

// Create a fresh client per property access so getCloudflareContext()
// is always called within a live request context.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    return getClient()[prop as keyof PrismaClient]
  },
})
