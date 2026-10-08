import { youtubeId } from '@/lib/youtube'

// Vertical (9:16) YouTube Short embed. Renders nothing for an invalid/empty URL.
export function KimchiShort({ url, title = 'Kimchi video', className = 'mx-auto w-full max-w-[340px] rounded-xl border border-brand-border' }: { url: string; title?: string; className?: string }) {
  const id = youtubeId(url)
  if (!id) return null
  return (
    <div className={`aspect-[9/16] overflow-hidden bg-black ${className}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`}
        title={title}
        className="w-full h-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
