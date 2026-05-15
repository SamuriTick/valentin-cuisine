import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const signups = await prisma.waitingListSignup.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(signups)
  })
}
