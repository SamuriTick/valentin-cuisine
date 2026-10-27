// Signed per-order feedback links (/feedback?o=12.abc…), so a link only works for the order it was made for.
// Server-only: signs with NEXTAUTH_SECRET.

async function sign(id: number): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set')
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`feedback:${id}`)))
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 22)
}

export async function feedbackToken(orderId: number): Promise<string> {
  return `${orderId}.${await sign(orderId)}`
}

export async function orderIdFromToken(token: unknown): Promise<number | null> {
  if (typeof token !== 'string') return null
  const m = token.match(/^(\d+)\.([\w-]{22})$/)
  if (!m) return null
  const id = Number(m[1])
  return (await sign(id)) === m[2] ? id : null
}

export async function feedbackUrl(origin: string, orderId: number): Promise<string> {
  return `${origin}/feedback?o=${await feedbackToken(orderId)}`
}
