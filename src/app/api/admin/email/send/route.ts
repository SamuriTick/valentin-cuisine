import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const body = await req.json()
    const { subject, htmlBody, recipientIds } = body as {
      subject: string
      htmlBody: string
      recipientIds?: number[]
    }

    if (!subject || !htmlBody) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
    }

    // Fetch recipients — either selected ones or all subscribers
    const where = recipientIds && recipientIds.length > 0
      ? { id: { in: recipientIds } }
      : {}

    const subscribers = await prisma.waitingListSignup.findMany({ where })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers to send to" }, { status: 400 })
    }

    const fromAddress = process.env.EMAIL_FROM ?? 'noreply@chartedconsultants.com'
    const resend = getResend()

    // Send in batches of 50 (Resend batch limit)
    const batchSize = 50
    const errors: string[] = []

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      for (const sub of batch) {
        try {
          const { error } = await resend.emails.send({
            from: fromAddress,
            to: sub.email,
            subject,
            html: htmlBody,
          })
          if (error) {
            errors.push(`${sub.email}: ${error.message}`)
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          errors.push(`${sub.email}: ${msg}`)
        }
      }
    }

    // Log the campaign regardless of partial errors
    const campaign = await prisma.emailCampaign.create({
      data: {
        subject,
        body: htmlBody,
        recipientCount: subscribers.length - errors.length,
      },
    })

    if (errors.length > 0) {
      return NextResponse.json({
        ok: true,
        campaignId: campaign.id,
        sent: subscribers.length - errors.length,
        failed: errors.length,
        errors,
      })
    }

    return NextResponse.json({ ok: true, campaignId: campaign.id, sent: subscribers.length })
  })
}
