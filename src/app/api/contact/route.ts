import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export const dynamic = 'force-dynamic'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

export async function POST(req: NextRequest) {
  const { name, email, phone, occasion, details } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  const to = process.env.CONTACT_TO_EMAIL
  if (!to) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 })
  }

  try {
    const resend = getResend()
    const { error } = await resend.emails.send({
      from: 'noreply@chartedconsultants.com',
      to,
      replyTo: email,
      subject: occasion ? `${occasion} from ${name}` : `New message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="font-family:Georgia,serif;color:#1a1a1a;border-bottom:2px solid #3d7a6b;padding-bottom:12px;">
            ${occasion || 'New message'}
          </h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:8px 0;color:#7A7060;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#7A7060;font-size:13px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#7A7060;font-size:13px;">Phone</td><td style="padding:8px 0;font-size:14px;">${phone}</td></tr>` : ""}
          </table>
          ${details ? `<div style="margin-top:20px;padding:16px;background:#F8F5EE;border-left:3px solid #3d7a6b;"><p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${details}</p></div>` : ""}
          <p style="margin-top:24px;font-size:12px;color:#7A7060;">Reply to this email to respond directly to ${name}.</p>
        </div>
      `,
    })

    if (error) {
      console.error("[CONTACT]", error)
      return NextResponse.json({ error: "Failed to send" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error("[CONTACT]", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
