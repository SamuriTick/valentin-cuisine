import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { feedbackUrl } from "@/lib/feedbackToken"

const STAGES = ["ordered", "confirmed", "ready", "collected"]
const TRASH_DAYS = 14

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    // Auto-empty trash: permanently remove orders binned more than 14 days ago
    const cutoff = new Date(Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000)
    await prisma.order.deleteMany({ where: { deletedAt: { lt: cutoff } } })

    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } })
    const answered = new Set((await prisma.feedback.findMany({ select: { orderId: true } })).map(f => f.orderId))
    const origin = new URL(req.url).origin
    return NextResponse.json(await Promise.all(orders.map(async o => ({
      ...o, feedbackUrl: await feedbackUrl(origin, o.id), hasFeedback: answered.has(o.id),
    }))))
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const { id, stage, paid, trashed } = await req.json()
    const data: { stage?: string; paid?: boolean; deletedAt?: Date | null } = {}
    if (typeof stage === "string" && STAGES.includes(stage)) data.stage = stage
    if (typeof paid === "boolean") data.paid = paid
    if (typeof trashed === "boolean") data.deletedAt = trashed ? new Date() : null
    const order = await prisma.order.update({ where: { id: Number(id) }, data })
    return NextResponse.json(order)
  })
}

// Permanent delete: ?id=123 for one binned order, ?all=1 to empty the trash
export async function DELETE(req: NextRequest) {
  return withAuth(req, async () => {
    const params = new URL(req.url).searchParams
    if (params.get("all")) {
      await prisma.order.deleteMany({ where: { deletedAt: { not: null } } })
    } else {
      await prisma.order.deleteMany({ where: { id: Number(params.get("id")), deletedAt: { not: null } } })
    }
    return NextResponse.json({ ok: true })
  })
}
