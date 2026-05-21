const MEDIA_PROXY_PREFIX = '/api/media/file/'

export function getMediaDisplayUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith('/')) return pathOrUrl
  return `${MEDIA_PROXY_PREFIX}${pathOrUrl.split('/').map(encodeURIComponent).join('/')}`
}
