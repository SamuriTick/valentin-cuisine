import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getMediaDisplayUrl } from '@/lib/media-url'

const BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
const PUBLIC_URL  = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')

// ─── Cloudflare R2 binding (Workers runtime) ──────────────────────────────────

function getR2Binding(): any | null { // eslint-disable-line
  try {
    const ctx = getCloudflareContext() as { env: CloudflareEnv }
    return ctx?.env?.R2 ?? null
  } catch {
    return null
  }
}

// ─── AWS SDK client (local dev fallback) ─────────────────────────────────────

function getS3Client() {
  return new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID     || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  })
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function isR2Configured(): boolean {
  try {
    if (getR2Binding()) return true
  } catch { /* */ }
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  )
}

export { getMediaDisplayUrl }

export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ key: string; url: string }> {
  const r2 = getR2Binding()

  if (r2) {
    // Native R2 binding — works in Cloudflare Workers without any credentials
    try {
      await r2.put(key, buffer, {
        httpMetadata: { contentType },
        customMetadata: metadata,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new Error(`R2 native binding put() failed: ${msg}`)
    }
    const url = PUBLIC_URL ? `${PUBLIC_URL}/${key}` : getMediaDisplayUrl(key)
    return { key, url }
  }

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 native binding not available and S3 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) are not set')
  }

  // Local dev: use AWS-SDK S3-compatible client
  const s3 = getS3Client()
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`S3/R2 SDK upload failed (account=${process.env.R2_ACCOUNT_ID}, bucket=${BUCKET_NAME}): ${msg}`)
  }

  const url = PUBLIC_URL
    ? `${PUBLIC_URL}/${key}`
    : await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }), { expiresIn: 3600 * 24 * 7 })

  return { key, url }
}

export async function deleteFromR2(key: string): Promise<void> {
  const r2 = getR2Binding()

  if (r2) {
    await r2.delete(key)
    return
  }

  const s3 = getS3Client()
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }))
}

export async function getObjectFromR2(key: string): Promise<{
  body: BodyInit
  contentType?: string
  cacheControl?: string
} | null> {
  const r2 = getR2Binding()

  if (r2) {
    const object = await r2.get(key)
    if (!object) return null

    return {
      body: object.body,
      contentType: object.httpMetadata?.contentType,
      cacheControl: object.httpMetadata?.cacheControl,
    }
  }

  const s3 = getS3Client()
  const object = await s3.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }))
  if (!object.Body) return null

  return {
    body: object.Body as BodyInit,
    contentType: object.ContentType,
    cacheControl: object.CacheControl,
  }
}

export async function getSignedUrlFromR2(key: string, expiresIn = 3600): Promise<string> {
  // Signed URLs require the S3 client even on Workers
  const s3 = getS3Client()
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }), { expiresIn })
}

export function generateR2Key(filename: string, folder = 'uploads'): string {
  const timestamp    = Date.now()
  const random       = Math.random().toString(36).substring(2, 8)
  const sanitized    = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${folder}/${timestamp}_${random}_${sanitized}`
}

export function convertToPublicUrl(url: string): string | null {
  if (!url || !PUBLIC_URL) return null
  if (url.includes('r2.cloudflarestorage.com')) {
    try {
      const urlObj = new URL(url)
      const key = urlObj.pathname.split('/').slice(2).join('/')
      if (key) return `${PUBLIC_URL}/${key}`
    } catch { /* */ }
  }
  return null
}

export function extractKeyFromUrl(url: string): string | null {
  if (!url) return null
  if (PUBLIC_URL && url.startsWith(PUBLIC_URL)) return url.replace(PUBLIC_URL + '/', '')
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/')
    if (parts.length > 2) return parts.slice(2).join('/')
  } catch { /* */ }
  return null
}
