import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth-middleware'
import { uploadRateLimiter, getClientIp } from '@/lib/rate-limiter'
import { uploadToR2, isR2Configured, generateR2Key, deleteFromR2, getMediaDisplayUrl } from '@/lib/r2-storage'

export const dynamic = 'force-dynamic'

function validateFileSignature(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 12))

  switch (mimeType) {
    case 'image/jpeg':
      return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
    case 'image/png':
      return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
    case 'image/gif':
      return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 &&
             bytes[3] === 0x38 && (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61
    case 'image/webp':
      return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
             bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    default:
      return false
  }
}

// GET /api/media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get('fileType')
    const limit = searchParams.get('limit')

    const mediaItems = await prisma.mediaItem.findMany({
      where: fileType ? { fileType } : undefined,
      orderBy: { uploadedAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(mediaItems.map(item => ({
      ...item,
      filePath: getMediaDisplayUrl(item.filePath || item.filename),
    })))
  } catch (error) {
    console.error('Error fetching media items:', error)
    return NextResponse.json({ error: 'Failed to fetch media items' }, { status: 500 })
  }
}

// POST /api/media
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitResult = uploadRateLimiter.checkLimit(clientIp)

    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime)
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.', resetTime: resetDate.toISOString(), remaining: 0 },
        { status: 429, headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetDate.toISOString(),
        }}
      )
    }

    const isAuthed = await checkAuth(request)
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to upload files.' }, { status: 401 })
    }

    if (!isR2Configured()) {
      return NextResponse.json({ error: 'Storage not configured. R2 binding missing and no S3 env vars set.' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string || ''
    const caption = formData.get('caption') as string || ''
    const tags = formData.get('tags') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, PDF' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()

    if (file.type !== 'application/pdf' && !validateFileSignature(bytes, file.type)) {
      return NextResponse.json({ error: 'File content does not match declared file type' }, { status: 400 })
    }

    const storageKey = generateR2Key(file.name, 'uploads')
    let fileUrl: string

    try {
      const { url } = await uploadToR2(storageKey, Buffer.from(bytes), file.type, {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        altText: altText || '',
        caption: caption || '',
      })
      fileUrl = url
    } catch (r2Error) {
      console.error('[MEDIA API] R2 upload failed:', r2Error)
      const msg = r2Error instanceof Error ? r2Error.message : String(r2Error)
      return NextResponse.json({ error: 'Failed to upload file to cloud storage', detail: msg }, { status: 500 })
    }

    try {
      const mediaItem = await prisma.mediaItem.create({
        data: {
          filename: storageKey,
          originalName: file.name,
          filePath: fileUrl,
          fileType: file.type.startsWith('image/') ? 'image' : 'pdf',
          fileSize: file.size,
          altText: altText || null,
          caption: caption || null,
          tags: tags || null,
        },
      })

      const response = NextResponse.json(mediaItem, { status: 201 })
      response.headers.set('X-RateLimit-Limit', '10')
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
      return response
    } catch (dbError) {
      // DB failed — clean up the R2 file
      try { await deleteFromR2(storageKey) } catch { /* best effort */ }
      throw dbError
    }
  } catch (error) {
    console.error('[MEDIA API] Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// DELETE /api/media
export async function DELETE(request: NextRequest) {
  try {
    const isAuthed = await checkAuth(request)
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Media item ID is required' }, { status: 400 })
    }

    const mediaItem = await prisma.mediaItem.findUnique({ where: { id: parseInt(id) } })
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 })
    }

    if (isR2Configured()) {
      try {
        await deleteFromR2(mediaItem.filename)
      } catch (error) {
        console.error('[MEDIA API] Failed to delete from R2:', error)
      }
    }

    await prisma.mediaItem.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[MEDIA API] Error deleting media item:', error)
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 })
  }
}
