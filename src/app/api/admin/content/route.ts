import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const content = await prisma.siteContent.findMany({ orderBy: [{ key: "asc" }, { lang: "asc" }] })
    return NextResponse.json(content)
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const body = await req.json() // [{ key, lang, value }]
    const updates = await Promise.all(
      body.map((item: { key: string; lang: string; value: string }) =>
        prisma.siteContent.upsert({
          where: { key_lang: { key: item.key, lang: item.lang } },
          update: { value: item.value },
          create: { key: item.key, lang: item.lang, value: item.value },
        })
      )
    )
    return NextResponse.json(updates)
  })
}
