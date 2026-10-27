import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const rows = await prisma.feedback.findMany({ orderBy: { updatedAt: "desc" } })
    const orders = await prisma.order.findMany({
      where: { id: { in: rows.map(r => r.orderId).filter((id): id is number => id != null) } },
      select: { id: true, items: true },
    })
    const itemsById = new Map(orders.map(o => [o.id, o.items]))
    return NextResponse.json(rows.map(r => {
      let answers = {}
      try { answers = JSON.parse(r.answers) } catch { /* keep empty */ }
      return { id: r.id, orderId: r.orderId, name: r.name, answers, published: r.published, items: r.orderId ? itemsById.get(r.orderId) ?? null : null, updatedAt: r.updatedAt }
    }))
  })
}

// Show or hide a review on the public kimchi page
export async function PATCH(req: NextRequest) {
  return withAuth(req, async () => {
    const id = Number(new URL(req.url).searchParams.get("id"))
    const body = await req.json().catch(() => null) as { published?: unknown } | null
    await prisma.feedback.update({ where: { id }, data: { published: body?.published === true } })
    return NextResponse.json({ ok: true })
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async () => {
    const id = Number(new URL(req.url).searchParams.get("id"))
    await prisma.feedback.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
