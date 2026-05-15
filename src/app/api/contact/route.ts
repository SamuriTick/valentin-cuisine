import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

const FROM = process.env.CONTACT_FROM_EMAIL || "Valentin's Cuisine <noreply@chartedconsultants.com>"
const BANK_NAME = "MSTR Valentin Thang"
const BANK_SORT = "20-90-74"
const BANK_ACCOUNT = "33552330"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

function emailWrapper(body: string) {
  return `
    <div style="background:#F8F5EE;padding:40px 20px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E8E0D5;border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#ffffff;border-bottom:2px solid #3d7a6b;padding:24px 32px;">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:20px;color:#1a1a1a;letter-spacing:-0.3px;">Valentin&rsquo;s Cuisine</p>
          <p style="margin:4px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A7060;">Putney, London</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          ${body}
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #E8E0D5;padding:20px 32px;background:#F8F5EE;">
          <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#7A7060;text-align:center;">
            Valentin&rsquo;s Cuisine &middot; Putney, London &middot; Made with love
          </p>
        </div>

      </div>
    </div>
  `
}

// Load a template from DB by slug, returns null if not found
async function loadTemplate(slug: string): Promise<{ subject: string; body: string } | null> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key_lang: { key: `email.tpl.${slug}`, lang: 'en' } },
    })
    if (!row) return null
    const parsed = JSON.parse(row.value)
    return { subject: parsed.subject ?? '', body: parsed.body ?? '' }
  } catch {
    return null
  }
}

// Replace {{variable}} placeholders with actual values
function applyVars(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''))
}

// Hardcoded fallback bodies (inner HTML only, passed through emailWrapper)
function ownerBody(vars: Record<string, string | number>) {
  const { name, email, phone, occasion, details, jars, total } = vars
  const isKimchiOrder = typeof total === 'number' || (typeof total === 'string' && total !== '')
  return `
    <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:22px;color:#1a1a1a;">
      ${occasion || 'New message'}
    </h2>
    <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:130px;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;color:#1a1a1a;">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;"><a href="mailto:${email}" style="color:#3d7a6b;">${email}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;color:#1a1a1a;">${phone}</td></tr>` : ''}
      ${isKimchiOrder ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Jars</td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;color:#1a1a1a;">${jars}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Total</td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;font-weight:bold;color:#3d7a6b;">£${total}</td>
      </tr>` : ''}
    </table>
    ${details ? `<div style="padding:16px;background:#F8F5EE;border-left:3px solid #3d7a6b;border-radius:2px;"><p style="margin:0;font-size:14px;line-height:1.7;color:#1a1a1a;white-space:pre-wrap;">${details}</p></div>` : ''}
    <p style="margin-top:24px;font-size:12px;color:#7A7060;">Reply to this email to respond directly to ${name}.</p>
  `
}

function customerBody(vars: Record<string, string | number>) {
  const { name, jars, total } = vars
  return `
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#3d7a6b;">Order received</p>
    <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:#1a1a1a;">Thanks, ${name}!</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#7A7060;">Your kimchi order is confirmed. Here&rsquo;s what you ordered:</p>

    <div style="background:#F8F5EE;border-radius:4px;padding:20px;margin-bottom:24px;">
      <table style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#7A7060;">Kimchi jars</td>
          <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;">${jars} jar${Number(jars) > 1 ? 's' : ''} &times; £15</td>
        </tr>
        <tr>
          <td style="padding:10px 0 0;font-size:15px;font-family:Georgia,serif;color:#1a1a1a;border-top:1px solid #E8E0D5;font-weight:bold;">Total</td>
          <td style="padding:10px 0 0;font-size:15px;font-family:Georgia,serif;color:#3d7a6b;text-align:right;border-top:1px solid #E8E0D5;font-weight:bold;">£${total}</td>
        </tr>
      </table>
    </div>

    <h3 style="margin:0 0 12px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#1a1a1a;">Pay by bank transfer</h3>
    <div style="border:1px solid #E8E0D5;border-radius:4px;overflow:hidden;margin-bottom:24px;">
      <table style="border-collapse:collapse;width:100%;">
        <tr style="border-bottom:1px solid #E8E0D5;">
          <td style="padding:12px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#7A7060;width:130px;background:#F8F5EE;">Name</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;">${BANK_NAME}</td>
        </tr>
        <tr style="border-bottom:1px solid #E8E0D5;">
          <td style="padding:12px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#7A7060;background:#F8F5EE;">Sort code</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-family:Georgia,serif;">${BANK_SORT}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#7A7060;background:#F8F5EE;">Account</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-family:Georgia,serif;">${BANK_ACCOUNT}</td>
        </tr>
      </table>
    </div>

    <div style="padding:16px;background:#F8F5EE;border-left:3px solid #3d7a6b;border-radius:2px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;line-height:1.7;color:#7A7060;">
        <strong style="color:#1a1a1a;">Delivery:</strong> I&rsquo;ll be in touch to sort out collection or delivery &mdash; we&rsquo;ll figure out the details together once payment is confirmed.
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#7A7060;line-height:1.7;">
      Any questions? Just reply to this email.<br/>
      &mdash; Valentin
    </p>
  `
}

export async function POST(req: NextRequest) {
  const { name, email, phone, occasion, details, jars, total, location, wantsToTry, optIn } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  const to = process.env.CONTACT_TO_EMAIL
  if (!to) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 })
  }

  // Persist waiting list signups to DB
  if (occasion && occasion.includes("Waiting list signup")) {
    try {
      await prisma.waitingListSignup.create({
        data: {
          name,
          email,
          location: location ?? null,
          wantsToTry: wantsToTry ?? null,
          optIn: optIn === true || (typeof occasion === 'string' && occasion.includes("opted into updates")),
        },
      })
    } catch (err) {
      console.error("[CONTACT] Failed to save waiting list signup:", err)
    }
  }

  const isKimchiOrder = typeof total === 'number'
  const vars: Record<string, string | number> = {
    name: name ?? '',
    email: email ?? '',
    phone: phone ?? '',
    occasion: occasion ?? 'New message',
    details: details ?? '',
    jars: jars ?? '',
    total: total ?? '',
  }

  try {
    const resend = getResend()

    // Load owner notification template from DB (fall back to hardcoded)
    const ownerTpl = await loadTemplate('contact-owner-notification')
    const ownerSubject = ownerTpl
      ? applyVars(ownerTpl.subject, vars)
      : (occasion ? `${occasion} from ${name}` : `New message from ${name}`)
    const ownerHtml = ownerTpl
      ? emailWrapper(applyVars(ownerTpl.body, vars))
      : emailWrapper(ownerBody(vars))

    const { data: d1, error: e1 } = await resend.emails.send({
      from: FROM,
      to,
      replyTo: email,
      subject: ownerSubject,
      html: ownerHtml,
    })

    console.log("[CONTACT] Owner email:", JSON.stringify({ data: d1, error: e1 }))

    if (e1) {
      console.error("[CONTACT] Owner email error:", e1)
      return NextResponse.json({ error: "Failed to send" }, { status: 500 })
    }

    // Customer confirmation for kimchi orders
    if (isKimchiOrder) {
      const customerTpl = await loadTemplate('kimchi-order-confirmation')
      const customerSubject = customerTpl
        ? applyVars(customerTpl.subject, vars)
        : `Your kimchi order — £${total}`
      const customerHtml = customerTpl
        ? emailWrapper(applyVars(customerTpl.body, vars))
        : emailWrapper(customerBody(vars))

      const { data: d2, error: e2 } = await resend.emails.send({
        from: FROM,
        to: email,
        replyTo: to,
        subject: customerSubject,
        html: customerHtml,
      })

      console.log("[CONTACT] Customer email:", JSON.stringify({ data: d2, error: e2 }))

      if (e2) {
        console.error("[CONTACT] Customer email error:", e2)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error("[CONTACT]", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
