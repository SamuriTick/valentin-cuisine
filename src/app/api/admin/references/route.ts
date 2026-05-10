import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const refs = await prisma.reference.findMany({ orderBy: [{ displayOrder: "asc" }, { id: "asc" }] })
    return NextResponse.json(refs)
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const body = await req.json()
    const ref = await prisma.reference.create({
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
    return NextResponse.json(ref, { status: 201 })
  })
}
