import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    const post = await prisma.post.findUnique({ where: { id: Number(params.id) } })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(post)
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    const body = await req.json()
    const wasPublished = body.published && !body._wasPreviouslyPublished
    const post = await prisma.post.update({
      where: { id: Number(params.id) },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content || "",
        imageUrl: body.imageUrl || null,
        category: body.category || "news",
        tags: body.tags || null,
        featured: body.featured ?? false,
        published: body.published ?? false,
        publishedAt: wasPublished ? new Date() : body.publishedAt,
      },
    })
    return NextResponse.json(post)
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    await prisma.post.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  })
}
