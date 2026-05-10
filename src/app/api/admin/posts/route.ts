import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(posts)
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const body = await req.json()
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content || "",
        imageUrl: body.imageUrl || null,
        category: body.category || "news",
        tags: body.tags || null,
        featured: body.featured ?? false,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
      },
    })
    return NextResponse.json(post, { status: 201 })
  })
}
