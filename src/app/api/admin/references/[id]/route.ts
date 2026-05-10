import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    const body = await req.json()
    const ref = await prisma.reference.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        role: body.role || null,
        company: body.company || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        quote: body.quote || null,
        active: body.active ?? true,
        displayOrder: body.displayOrder ?? 0,
      },
    })
    return NextResponse.json(ref)
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    await prisma.reference.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  })
}
