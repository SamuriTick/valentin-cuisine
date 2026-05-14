import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, phone, occasion, details } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!to || !from) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 })
  }

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New order enquiry from ${name}`,
      html: `
        <h2 style="font-family:serif;color:#1E3A1E;">New order enquiry</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px 0;color:#7A7060;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;font-size:14px;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#7A7060;font-size:13px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#7A7060;font-size:13px;">Phone</td><td style="padding:8px 0;font-size:14px;">${phone}</td></tr>` : ""}
          ${occasion ? `<tr><td style="padding:8px 0;color:#7A7060;font-size:13px;">Occasion</td><td style="padding:8px 0;font-size:14px;">${occasion}</td></tr>` : ""}
        </table>
        ${details ? `<div style="margin-top:20px;padding:16px;background:#F8F5EE;border-left:3px solid #B8962E;"><p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${details}</p></div>` : ""}
        <p style="margin-top:24px;font-size:12px;color:#7A7060;">Reply to this email to respond directly to ${name}.</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[CONTACT]", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
