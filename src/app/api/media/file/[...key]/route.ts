import { NextRequest, NextResponse } from 'next/server'
import { getObjectFromR2 } from '@/lib/r2-storage'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params
    const key = keyParts.join('/')

    if (!key || key.includes('..')) {
      return NextResponse.json({ error: 'Invalid media key' }, { status: 400 })
    }

    const object = await getObjectFromR2(key)
    if (!object) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
    }

    return new NextResponse(object.body, {
      headers: {
        'Content-Type': object.contentType || 'application/octet-stream',
        'Cache-Control': object.cacheControl || 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[MEDIA FILE API] Error serving media file:', error)
    return NextResponse.json({ error: 'Failed to serve media file' }, { status: 500 })
  }
}
