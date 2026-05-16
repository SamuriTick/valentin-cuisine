import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return withAuth(req, async () => {
    const page = await prisma.page.findUnique({ where: { id: Number(id) } })
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(page)
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return withAuth(req, async () => {
    const body = await req.json()
    const page = await prisma.page.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content || "",
        showTitle: body.showTitle ?? true,
        showInNav: body.showInNav ?? false,
        navOrder: body.navOrder ?? 99,
        topLevel: body.topLevel ?? false,
        published: body.published ?? false,
      },
    })
    return NextResponse.json(page)
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return withAuth(req, async () => {
    await prisma.page.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  })
}
