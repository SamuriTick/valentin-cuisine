import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

const PREFIX = 'email.tpl.'

const BANK_NAME = 'MSTR Valentin Thang'
const BANK_SORT = '20-90-74'
const BANK_ACCOUNT = '33552330'

const DEFAULTS = [
  {
    slug: 'contact-owner-notification',
    name: 'Contact form — owner notification',
    subject: '{{occasion}} from {{name}}',
    body: `<h2 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:22px;color:#1a1a1a;">{{occasion}}</h2>

<table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:130px;">Name</td>
    <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;color:#1a1a1a;">{{name}}</td>
  </tr>
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Email</td>
    <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;"><a href="mailto:{{email}}" style="color:#3d7a6b;">{{email}}</a></td>
  </tr>
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;color:#7A7060;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Phone</td>
    <td style="padding:10px 0;border-bottom:1px solid #E8E0D5;font-size:14px;color:#1a1a1a;">{{phone}}</td>
  </tr>
</table>

<div style="padding:16px;background:#F8F5EE;border-left:3px solid #3d7a6b;border-radius:2px;">
  <p style="margin:0;font-size:14px;line-height:1.7;color:#1a1a1a;white-space:pre-wrap;">{{details}}</p>
</div>

<p style="margin-top:24px;font-size:12px;color:#7A7060;">Reply to this email to respond directly to {{name}}.</p>`,
  },
  {
    slug: 'kimchi-order-confirmation',
    name: 'Kimchi order — customer confirmation',
    subject: 'Your kimchi order — £{{total}}',
    body: `<p style="margin:0 0 8px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#3d7a6b;">Order received</p>
<h2 style="margin:0 0 4px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:#1a1a1a;">Thanks, {{name}}!</h2>
<p style="margin:0 0 24px;font-size:14px;color:#7A7060;">Your kimchi order is confirmed. Here&rsquo;s what you ordered:</p>

<div style="background:#F8F5EE;border-radius:4px;padding:20px;margin-bottom:24px;">
  <table style="border-collapse:collapse;width:100%;">
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#7A7060;">Kimchi jars</td>
      <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;">{{jars}} jar(s) &times; £15</td>
    </tr>
    <tr>
      <td style="padding:10px 0 0;font-size:15px;font-family:Georgia,serif;color:#1a1a1a;border-top:1px solid #E8E0D5;font-weight:bold;">Total</td>
      <td style="padding:10px 0 0;font-size:15px;font-family:Georgia,serif;color:#3d7a6b;text-align:right;border-top:1px solid #E8E0D5;font-weight:bold;">£{{total}}</td>
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
</p>`,
  },
]

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const results = []
    for (const tpl of DEFAULTS) {
      const key = PREFIX + tpl.slug
      const row = await prisma.siteContent.upsert({
        where: { key_lang: { key, lang: 'en' } },
        update: { value: JSON.stringify({ name: tpl.name, subject: tpl.subject, body: tpl.body }) },
        create: { key, lang: 'en', value: JSON.stringify({ name: tpl.name, subject: tpl.subject, body: tpl.body }) },
      })
      results.push(row)
    }
    return NextResponse.json({ seeded: results.length })
  })
}
