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
    <div style="background:#fffef5;padding:40px 20px;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ece8df;border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#ffffff;border-bottom:2px solid #b03060;padding:24px 32px;display:flex;align-items:baseline;gap:12px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:21px;color:#1a1a1a;letter-spacing:-0.3px;">Valentin&rsquo;s Cuisine</p>
          <p style="margin:0 0 0 10px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#8a8070;">Putney, London</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          ${body}
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #ece8df;padding:18px 32px;background:#fffef5;">
          <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a8070;text-align:center;">
            Valentin&rsquo;s Cuisine &middot; Putney, London
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
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b03060;">${isKimchiOrder ? 'Kimchi order' : 'New message'}</p>
    <h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:24px;color:#1a1a1a;letter-spacing:-0.3px;">
      ${occasion || 'New message'}
    </h2>
    <div style="width:32px;height:1px;background:#ece8df;margin-bottom:24px;"></div>
    <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;color:#8a8070;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;width:110px;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;font-size:14px;color:#1a1a1a;">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;color:#8a8070;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;font-size:14px;"><a href="mailto:${email}" style="color:#b03060;text-decoration:none;">${email}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #ece8df;color:#8a8070;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #ece8df;font-size:14px;color:#1a1a1a;">${phone}</td></tr>` : ''}
      ${isKimchiOrder ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;color:#8a8070;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Jars</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;font-size:14px;color:#1a1a1a;">${jars}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;color:#8a8070;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Total</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece8df;font-size:14px;font-weight:bold;color:#b03060;">£${total}</td>
      </tr>` : ''}
    </table>
    ${details ? `<div style="padding:16px 18px;background:#fffef5;border:1px solid #ece8df;border-left:3px solid #b03060;border-radius:2px;"><p style="margin:0;font-size:14px;line-height:1.75;color:#1a1a1a;white-space:pre-wrap;">${details}</p></div>` : ''}
    <p style="margin-top:24px;font-size:12px;color:#8a8070;line-height:1.6;">Reply to this email to respond directly to ${name}.</p>
  `
}

function customerBody(vars: Record<string, string | number>) {
  const { name, jars, total } = vars
  return `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b03060;">Order confirmed</p>
    <h2 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;color:#1a1a1a;letter-spacing:-0.3px;">Thanks, ${name}.</h2>
    <p style="margin:0 0 28px;font-size:14px;color:#8a8070;line-height:1.65;">Your kimchi order is in. Here&rsquo;s a summary:</p>

    <div style="background:#fffef5;border:1px solid #ece8df;border-radius:4px;padding:20px;margin-bottom:28px;">
      <table style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#8a8070;">Hand-made kimchi</td>
          <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;">${jars} jar${Number(jars) > 1 ? 's' : ''} &times; £15</td>
        </tr>
        <tr>
          <td style="padding:12px 0 0;font-size:15px;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;border-top:1px solid #ece8df;">Total</td>
          <td style="padding:12px 0 0;font-size:15px;font-family:Georgia,'Times New Roman',serif;color:#b03060;text-align:right;border-top:1px solid #ece8df;font-weight:bold;">£${total}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;">Pay by bank transfer</p>
    <div style="border:1px solid #ece8df;border-radius:4px;overflow:hidden;margin-bottom:28px;">
      <table style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="padding:12px 16px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8070;width:110px;background:#fffef5;border-bottom:1px solid #ece8df;">Name</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #ece8df;">${BANK_NAME}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8070;background:#fffef5;border-bottom:1px solid #ece8df;">Sort code</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-family:Georgia,'Times New Roman',serif;border-bottom:1px solid #ece8df;">${BANK_SORT}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8070;background:#fffef5;">Account</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-family:Georgia,'Times New Roman',serif;">${BANK_ACCOUNT}</td>
        </tr>
      </table>
    </div>

    <div style="padding:16px 18px;background:#fdf2f6;border:1px solid #ece8df;border-left:3px solid #b03060;border-radius:2px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;line-height:1.75;color:#8a8070;">
        <strong style="color:#1a1a1a;">Next steps:</strong> Once I see your payment I&rsquo;ll get in touch to sort out collection or delivery &mdash; we&rsquo;ll figure out the details together.
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#8a8070;line-height:1.75;">
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
