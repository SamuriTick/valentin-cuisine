// On Cloudflare Workers, stateful per-process rate limiting is not viable
// (each request may land on a different isolate). Network-level rate limiting
// is handled by Cloudflare WAF rules. This module provides compatible stubs so
// call sites don't need to change; `checkLimit` always allows.

export const uploadRateLimiter = {
  checkLimit(_identifier: string): { allowed: true; remaining: number; resetTime: number } {
    return { allowed: true, remaining: 10, resetTime: Date.now() + 3_600_000 }
  },
}

export function getClientIp(request: Request): string {
  const headers = request.headers
  const cf = headers.get('cf-connecting-ip')
  if (cf) return cf
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return headers.get('x-real-ip') ?? 'unknown'
}
