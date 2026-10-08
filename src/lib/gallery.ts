import type { ContentMap } from './siteContent'

// The gallery photo list is stored as JSON under this SiteContent key.
// When the key is absent, the gallery falls back to the oldest media-library images.
export const GALLERY_KEY = 'gallery.photos'
export const GALLERY_FALLBACK_LIMIT = 12

export interface GalleryPhoto {
  url: string
  alt?: string
  crop?: { x: number; y: number; zoom: number }
}

interface MediaLike { filePath: string; altText?: string | null }

/**
 * Resolve the gallery photos from the content map. `media` must be image items
 * ordered oldest first; it is only used when no explicit selection has been saved.
 */
export function resolveGalleryPhotos(map: ContentMap, media: MediaLike[]): GalleryPhoto[] {
  const raw = map[GALLERY_KEY]
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter((p): p is GalleryPhoto => typeof p?.url === 'string' && p.url.length > 0)
      }
    } catch {
      // fall through to the legacy behaviour
    }
  }
  return media.slice(0, GALLERY_FALLBACK_LIMIT).map((item, i) => ({
    url: map[`gallery.photo.${i}`] ?? item.filePath,
    alt: item.altText ?? '',
    crop: parseCrop(map[`gallery.photo.${i}.crop`]),
  }))
}

function parseCrop(value?: string): GalleryPhoto['crop'] {
  if (!value) return undefined
  const [x = 50, y = 50, zoom = 1] = value.split(' ').map(Number)
  return { x, y, zoom }
}
