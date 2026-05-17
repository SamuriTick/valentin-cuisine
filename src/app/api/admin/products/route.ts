import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const products = await prisma.product.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] })
    return NextResponse.json(products)
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const body = await req.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price || null,
        weights: body.weights ? JSON.stringify(body.weights) : null,
        discount: body.discount ? JSON.stringify(body.discount) : null,
        pageUrl: body.pageUrl || null,
        imageUrl: body.imageUrl || null,
        category: body.category || "cake",
        available: body.available ?? true,
        featured: body.featured ?? false,
        orderNote: body.orderNote || null,
        displayOrder: body.displayOrder ?? 0,
      },
    })
    return NextResponse.json(product, { status: 201 })
  })
}
