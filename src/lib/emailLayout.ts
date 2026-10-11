// Shared layout and helpers for emails sent from the site (contact form, admin sends)

export const FROM = process.env.CONTACT_FROM_EMAIL || "Valentin's Cuisine <noreply@chartedconsultants.com>"

export function emailWrapper(body: string) {
  return `
    <div style="background:#fffef5;padding:40px 20px;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ece8df;border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#ffffff;border-bottom:2px solid #c2412d;padding:24px 32px;display:flex;align-items:baseline;gap:12px;">
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

// Replace {{variable}} placeholders with actual values
export function applyVars(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''))
}
