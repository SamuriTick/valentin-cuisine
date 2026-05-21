const MEDIA_PROXY_PREFIX = '/api/media/file/'

function keyToProxyUrl(key: string): string {
  return `${MEDIA_PROXY_PREFIX}${key.split('/').map(encodeURIComponent).join('/')}`
}

function extractR2Key(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('r2.cloudflarestorage.com')) return null

    const parts = parsed.pathname.split('/').filter(Boolean)
    const uploadsIndex = parts.indexOf('uploads')
    if (uploadsIndex >= 0) return parts.slice(uploadsIndex).join('/')
    if (parts.length > 1) return parts.slice(1).join('/')
  } catch {
    return null
  }

  return null
}

export function getMediaDisplayUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl
  const r2Key = extractR2Key(pathOrUrl)
  if (r2Key) return keyToProxyUrl(r2Key)
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith('/')) return pathOrUrl
  return keyToProxyUrl(pathOrUrl)
}
