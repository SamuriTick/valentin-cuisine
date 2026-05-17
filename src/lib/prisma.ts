import { PrismaClient as LocalPrismaClient } from '@prisma/client'
import { PrismaClient as WasmPrismaClient } from '@prisma/client/wasm'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Reuse the local SQLite client across requests to avoid connection churn.
let _localClient: LocalPrismaClient | undefined

function getClient(): LocalPrismaClient | WasmPrismaClient {
  if (process.env.DATABASE_URL) {
    if (!_localClient) _localClient = new LocalPrismaClient()
    return _localClient
  }
  const ctx = getCloudflareContext() as { env: CloudflareEnv }
  return new WasmPrismaClient({ adapter: new PrismaD1(ctx.env.DB) })
}

// Create a fresh client per property access so getCloudflareContext()
// is always called within a live request context on Workers.
export const prisma = new Proxy({} as LocalPrismaClient, {
  get(_, prop: string | symbol) {
    return getClient()[prop as keyof LocalPrismaClient]
  },
})
