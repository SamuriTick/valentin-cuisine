import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const ctx = getCloudflareContext() as { env: Record<string, unknown> }
    const bindings = ctx?.env ? Object.keys(ctx.env) : []
    const hasDB = !!ctx?.env?.DB
    return NextResponse.json({ cfContextOk: true, bindings, hasDB })
  } catch (e: unknown) {
    return NextResponse.json({ cfContextOk: false, error: String(e) }, { status: 500 })
  }
}
