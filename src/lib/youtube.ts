// Extracts the video ID from any common YouTube URL form
// (shorts/, watch?v=, youtu.be/, embed/) or a bare 11-character ID.
export function youtubeId(input: string | undefined | null): string | null {
  const s = (input ?? '').trim()
  if (!s) return null
  if (/^[\w-]{11}$/.test(s)) return s
  const m = s.match(/(?:youtube\.com\/(?:shorts\/|embed\/|live\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})/)
  return m?.[1] ?? null
}
