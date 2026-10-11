import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { withAuth } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { FROM, emailWrapper, applyVars } from "@/lib/emailLayout"

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Send one saved template to one person, filling in {{name}}, {{order}}, {{total}} etc.
export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const { slug, to, vars } = await req.json() as { slug: string; to: string; vars?: Record<string, string> }
    if (!slug || typeof to !== 'string' || !EMAIL_RE.test(to.trim())) {
      return NextResponse.json({ error: "A template and a valid email are required" }, { status: 400 })
    }

    const row = await prisma.siteContent.findUnique({ where: { key_lang: { key: `email.tpl.${slug}`, lang: 'en' } } })
    if (!row) return NextResponse.json({ error: "Template not found" }, { status: 404 })
    const tpl = JSON.parse(row.value) as { subject?: string; body?: string }

    const v = vars ?? {}
    const subject = applyVars(tpl.subject ?? '', v)
    const html = emailWrapper(applyVars(tpl.body ?? '', v))

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return NextResponse.json({ error: "Email not configured" }, { status: 500 })
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: to.trim(),
      replyTo: process.env.CONTACT_TO_EMAIL || undefined,
      subject,
      html,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await prisma.emailCampaign.create({
      data: { subject: `${subject} (to ${v.name || to})`, body: html, recipientCount: 1 },
    })
    return NextResponse.json({ ok: true })
  })
}
