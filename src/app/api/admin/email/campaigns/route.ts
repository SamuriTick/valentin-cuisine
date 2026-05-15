import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { sentAt: "desc" },
    })
    return NextResponse.json(campaigns)
  })
}
