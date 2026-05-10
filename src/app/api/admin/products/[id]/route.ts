import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    const product = await prisma.product.findUnique({ where: { id: Number(params.id) } })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    const body = await req.json()
    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price || null,
        imageUrl: body.imageUrl || null,
        category: body.category || "cake",
        available: body.available ?? true,
        featured: body.featured ?? false,
        orderNote: body.orderNote || null,
        displayOrder: body.displayOrder ?? 0,
      },
    })
    return NextResponse.json(product)
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    await prisma.product.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  })
}
