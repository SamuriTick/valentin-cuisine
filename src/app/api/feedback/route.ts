import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { FROM, emailWrapper } from "@/lib/emailLayout"
import { cleanAnswers, OVERALL_OPTIONS } from "@/lib/feedbackQuestions"
import { orderIdFromToken } from "@/lib/feedbackToken"

export const dynamic = 'force-dynamic'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Public: save a feedback form. With a valid order link (?o=…) it's tied to that order and
// sending again updates it; without one, a name is required.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { token?: unknown; name?: unknown; answers?: unknown } | null
  const answers = cleanAnswers(body?.answers)
  if (!answers) return NextResponse.json({ error: "Please tell me how it was overall." }, { status: 400 })

  const orderId = await orderIdFromToken(body?.token)
  const order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null
  const name = order?.name ?? (typeof body?.name === 'string' ? body.name.trim().slice(0, 100) : '')
  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 })

  const json = JSON.stringify(answers)
  if (order) {
    await prisma.feedback.upsert({
      where: { orderId: order.id },
      create: { orderId: order.id, name, answers: json },
      update: { answers: json },
    })
  } else {
    await prisma.feedback.create({ data: { name, answers: json } })
  }

  // Let Valentin know; never fail the form over it
  try {
    const apiKey = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL
    if (apiKey && to) {
      const score = OVERALL_OPTIONS.indexOf(answers.overall as string) + 1
      const comments = (['change', 'ideas', 'review'] as const).filter(k => answers[k])
        .map(k => `<p style="margin:0 0 12px;font-size:14px;color:#1a1a1a;line-height:1.6;">“${esc(String(answers[k]))}”</p>`).join('')
      await new Resend(apiKey).emails.send({
        from: FROM, to,
        subject: `New kimchi feedback from ${name}: ${answers.overall}`,
        html: emailWrapper(`
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c2412d;">Feedback</p>
          <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:24px;color:#1a1a1a;">${esc(name)} rated it ${score}/5 (${esc(String(answers.overall))})</h2>
          ${comments}
          <p style="margin:16px 0 0;font-size:13px;color:#7A7060;">See every answer on the Feedback page in the admin.</p>`),
      })
    }
  } catch (err) {
    console.error("[FEEDBACK] Notification email failed:", err)
  }

  return NextResponse.json({ ok: true })
}
