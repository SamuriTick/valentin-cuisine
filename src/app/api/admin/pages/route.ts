import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const pages = await prisma.page.findMany({
      where: { deletedAt: null },
      orderBy: [{ navOrder: "asc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(pages)
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const body = await req.json()
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const page = await prisma.page.create({
      data: {
        title: body.title,
        slug,
        content: body.content || "",
        showTitle: body.showTitle ?? true,
        showInNav: body.showInNav ?? false,
        navOrder: body.navOrder ?? 99,
        topLevel: body.topLevel ?? false,
        published: body.published ?? false,
      },
    })
    return NextResponse.json(page, { status: 201 })
  })
}
