import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

const STAGES = ["ordered", "confirmed", "ready", "collected"]

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(orders)
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const { id, stage, paid } = await req.json()
    const data: { stage?: string; paid?: boolean } = {}
    if (typeof stage === "string" && STAGES.includes(stage)) data.stage = stage
    if (typeof paid === "boolean") data.paid = paid
    const order = await prisma.order.update({ where: { id: Number(id) }, data })
    return NextResponse.json(order)
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async () => {
    const id = Number(new URL(req.url).searchParams.get("id"))
    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
