// Customer emails for kimchi orders, written once and used in two places:
// the Orders admin page (opens Gmail pre-filled) and the Email templates (seed-defaults).

export const BANK = { name: 'MSTR Valentin Thang', sort: '20-90-74', account: '33552330' }
export const COLLECTION = "on the 25th at The Panda's Pantry in Putney, SW London"

// link: the order's personal feedback form link
export type EmailVars = { name: string; order: string; total: string; link?: string }

export type CustomerEmail = {
  slug: string
  name: string
  subject: string
  // Paragraphs; a paragraph that is an array is a block of lines (no blank line between)
  body: (v: EmailVars) => (string | string[])[]
}

const bankBlock = (v: EmailVars) => [
  `Name: ${BANK.name}`,
  `Sort code: ${BANK.sort}`,
  `Account number: ${BANK.account}`,
  `Amount: £${v.total}`,
  `Reference: ${v.name}`,
]

export const CUSTOMER_EMAILS: CustomerEmail[] = [
  {
    slug: 'thank-you-for-ordering',
    name: 'Thank you for ordering',
    subject: 'Thank you so much for your kimchi order!',
    body: v => [
      `Hi ${v.name},`,
      'Thank you so much for ordering my kimchi!',
      `Your order: ${v.order}`,
      "It really means a lot to me. Every order supports me more than you know, and it keeps me going as I build this little kimchi project from my kitchen.",
      "I promise to make your kimchi the best I possibly can, with care and the freshest ingredients I can find. I can't wait for you to try it.",
      'If you have any questions, just reply to this email.',
      'With gratitude,',
      'Valentin',
    ],
  },
  {
    slug: 'order-payment-request',
    name: 'Order payment request',
    subject: 'Thanks for your kimchi order! Payment details inside',
    body: v => [
      `Hi ${v.name},`,
      'Thank you so much for ordering my kimchi! I really appreciate it.',
      ["Here's a quick summary of your order:", `${v.order} for £${v.total}`],
      'To confirm your order, please pay by bank transfer using the details below:',
      bankBlock(v),
      `Once I've received your payment, your kimchi will be ready to collect ${COLLECTION}.`,
      'If you have any questions, just reply to this email.',
      'Thanks again for supporting me!',
      'Valentin',
    ],
  },
  {
    slug: 'payment-reminder',
    name: 'Payment reminder',
    subject: 'Quick reminder about your kimchi order',
    body: v => [
      `Hi ${v.name},`,
      "Just a friendly reminder that I haven't received the payment for your kimchi order yet:",
      `${v.order} for £${v.total}`,
      'You can pay by bank transfer using these details:',
      bankBlock(v),
      `Once it's in, your kimchi will be ready to collect ${COLLECTION}.`,
      "If you've already paid, please ignore this, and thank you!",
      'Valentin',
    ],
  },
  {
    slug: 'payment-thank-you',
    name: 'Thanks for your payment',
    subject: 'Payment received, thank you!',
    body: v => [
      `Hi ${v.name},`,
      "Thank you so much for your payment, I really appreciate it! Your order is now confirmed:",
      `${v.order} for £${v.total}`,
      `Your kimchi will be ready to collect ${COLLECTION}.`,
      'Thanks again for supporting me, I hope you love it!',
      'Valentin',
    ],
  },
  {
    slug: 'ready-to-collect',
    name: 'Ready to collect',
    subject: 'Your kimchi is ready to collect!',
    body: v => [
      `Hi ${v.name},`,
      'Good news: your kimchi is ready!',
      `You can collect it ${COLLECTION}.`,
      `Your order: ${v.order}`,
      "Once you get it home, keep it in the fridge. It's best within 3–4 weeks and it keeps fermenting, so open it carefully as it may fizz.",
      'See you soon!',
      'Valentin',
    ],
  },
  {
    slug: 'thanks-for-collecting',
    name: 'Thanks for collecting',
    subject: 'Thanks for collecting your kimchi!',
    body: v => [
      `Hi ${v.name},`,
      'Thanks for collecting your kimchi, I hope you enjoy it!',
      "A quick tip: keep it in the fridge and it's best within 3–4 weeks. Once it gets really sour, it's perfect for kimchi fried rice or kimchi pancakes.",
      "I'd love to hear what you think, so just reply to this email. And if you enjoyed it, please tell your friends!",
      'Thanks again for supporting me.',
      'Valentin',
    ],
  },
  {
    slug: 'ask-for-feedback',
    name: 'How was your kimchi? (feedback)',
    subject: 'How was your kimchi?',
    body: v => [
      `Hi ${v.name},`,
      "I hope you've been enjoying your kimchi! I'd love to know what you thought.",
      "I've made a short form, mostly just taps, and it takes under a minute:",
      v.link ?? '',
      "Please be honest, good or bad. I read every answer myself, and it really helps me make the next batch even better.",
      'Thank you so much for supporting me!',
      'Valentin',
    ],
  },
]

export function toPlainText(email: CustomerEmail, v: EmailVars): string {
  return email.body(v).map(p => (Array.isArray(p) ? p.join('\n') : p)).join('\n\n')
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&rsquo;')
}

// HTML version for the Email templates, with {{name}}, {{order}}, {{total}} and {{link}} placeholders
export function toTemplateHtml(email: CustomerEmail): string {
  const P = '<p style="margin:0 0 16px;font-size:14px;color:#1a1a1a;line-height:1.7;">'
  return email
    .body({ name: '{{name}}', order: '{{order}}', total: '{{total}}', link: '{{link}}' })
    .map(p => (p === '{{link}}'
      ? `<p style="margin:8px 0 24px;"><a href="{{link}}" style="display:inline-block;background:#c2412d;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 26px;border-radius:99px;">Give my feedback</a></p>`
      : Array.isArray(p) ? `${P}${p.map(esc).join('<br/>')}</p>` : `${P}${esc(p)}</p>`))
    .join('\n')
}

// Read jars and size from a saved order line: "2× 2kg (£15) · …" → { qty: 2, size: '2kg', kg: 4 }.
// Old "3 jars × £15 = £45" orders were all 2kg jars.
export function parseOrderLine(items: string): { qty: number; size: string; kg: number } | null {
  const first = (items.split(' · ')[0] ?? items).replace(/\}+\s*$/, '')
  const jars = first.match(/^(\d+) jars? × £[\d.]+ = £[\d.]+$/)
  if (jars) return { qty: Number(jars[1]), size: '2kg', kg: Number(jars[1]) * 2 }
  const m = first.match(/^(\d+)×\s*([\d.]+)\s*(kg|g)\b/i)
  if (!m) return null
  const qty = Number(m[1])
  const unit = (m[3] ?? '').toLowerCase()
  const each = unit === 'g' ? Number(m[2]) / 1000 : Number(m[2])
  return { qty, size: `${Number(m[2])}${unit}`, kg: qty * each }
}

// Turn a saved order line like "2× 2kg (£15) · Collection (Putney)" into "2 × 2kg"
export function orderSummary(items: string): string {
  const first = (items.split(' · ')[0] ?? items).replace(/\}+\s*$/, '')
  const jars = first.match(/^(\d+) jars? × £[\d.]+ = £[\d.]+$/)
  if (jars) return `${jars[1]} jar${jars[1] === '1' ? '' : 's'}`
  return first.replace(/\s*\(£[^)]*\)\s*$/, '').replace(/^(\d+)×\s*/, '$1 × ')
}
