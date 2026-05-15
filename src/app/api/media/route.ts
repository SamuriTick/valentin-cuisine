import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, rename, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth-middleware'
import { uploadRateLimiter, getClientIp } from '@/lib/rate-limiter'
import { uploadToR2, isR2Configured, generateR2Key, deleteFromR2 } from '@/lib/r2-storage'

export const dynamic = 'force-dynamic'

// Configure route segment for file uploads  
export const maxDuration = 60 // Maximum function duration: 60 seconds for large uploads
export const runtime = 'nodejs' // Use Node.js runtime (not Edge Runtime)

// Validate file magic numbers (file signatures) for security
function validateFileSignature(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 8))
  
  switch (mimeType) {
    case 'image/jpeg':
      return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
    case 'image/png':
      return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
    case 'image/gif':
      return (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && 
              bytes[3] === 0x38 && (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61)
    case 'image/webp':
      return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
             bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    default:
      return false
  }
}

// GET /api/media - Get all media items (supports ?fileType=image&limit=48)
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

    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error('Error fetching media items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    )
  }
}

// POST /api/media - Upload new media file
export async function POST(request: NextRequest) {
  console.log('[MEDIA API] Upload request received')
  try {
    // Check rate limit
    const clientIp = getClientIp(request)
    const rateLimitResult = uploadRateLimiter.checkLimit(clientIp)
    
    if (!rateLimitResult.allowed) {
      console.warn('[MEDIA API] Upload rejected - rate limit exceeded for IP:', clientIp)
      const resetDate = new Date(rateLimitResult.resetTime)
      return NextResponse.json(
        { 
          error: 'Too many uploads. Please try again later.',
          resetTime: resetDate.toISOString(),
          remaining: 0
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.toISOString()
          }
        }
      )
    }
    
    // Check authentication
    const isAuthed = await checkAuth(request)
    console.log('[MEDIA API] Auth check result:', isAuthed)
    if (!isAuthed) {
      console.warn('[MEDIA API] Upload rejected - unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to upload files.' },
        { status: 401 }
      )
    }

    try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string || ''
    const caption = formData.get('caption') as string || ''
    const tags = formData.get('tags') as string || ''

    console.log('[MEDIA API] File upload attempt:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      hasAltText: !!altText,
      hasCaption: !!caption
    })

    if (!file) {
      console.error('[MEDIA API] Upload failed - no file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type - SVG removed for security (XSS/XXE risks)
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ]

    if (!allowedTypes.includes(file.type)) {
      console.error('[MEDIA API] Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, PDF' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error('[MEDIA API] File too large:', {
        size: file.size,
        maxSize,
        fileName: file.name
      })
      return NextResponse.json(
        { error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      )
    }

    // Get file bytes for validation and saving
    console.log('[MEDIA API] Reading file bytes for validation')
    const bytes = await file.arrayBuffer()

    // PDFs skip magic number validation (broad signature variants)
    // Validate file signature (magic numbers) for security
    if (file.type !== 'application/pdf' && !validateFileSignature(bytes, file.type)) {
      console.error('[MEDIA API] File signature validation failed:', {
        fileName: file.name,
        declaredType: file.type,
        actualBytes: Array.from(new Uint8Array(bytes.slice(0, 12))).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')
      })
      return NextResponse.json(
        { error: 'File content does not match declared file type' },
        { status: 400 }
      )
    }
    console.log('[MEDIA API] File signature validation passed')

    let fileUrl: string
    let storageKey: string

    // Check if R2 is configured
    if (isR2Configured()) {
      console.log('[MEDIA API] Using R2 storage')
      
      // Generate R2 key
      storageKey = generateR2Key(file.name, 'uploads')
      
      try {
        // Upload to R2
        const { url } = await uploadToR2(
          storageKey,
          Buffer.from(bytes),
          file.type,
          {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
            altText: altText || '',
            caption: caption || ''
          }
        )
        fileUrl = url
        console.log('[MEDIA API] File uploaded to R2:', storageKey)
      } catch (r2Error) {
        console.error('[MEDIA API] R2 upload failed:', r2Error)
        return NextResponse.json(
          { error: 'Failed to upload file to cloud storage' },
          { status: 500 }
        )
      }
    } else {
      console.log('[MEDIA API] Using local storage (R2 not configured)')
      
      // Fallback to local storage
      const timestamp = Date.now()
      const extension = path.extname(file.name)
      const nameWithoutExt = path.basename(file.name, extension)
      const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_')
      const filename = `${timestamp}_${sanitizedName}${extension}`
      
      const uploadDir = process.env.UPLOAD_PATH || path.join(process.cwd(), 'public', 'uploads')
      console.log('[MEDIA API] Upload directory:', uploadDir)
      
      if (!existsSync(uploadDir)) {
        console.log('[MEDIA API] Creating upload directory:', uploadDir)
        await mkdir(uploadDir, { recursive: true })
      }
      
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, Buffer.from(bytes))
      
      storageKey = filename
      fileUrl = `/api/media/file/${filename}`
      console.log('[MEDIA API] File saved locally as:', filename)
    }

    // Create database record
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
        }
      })

      console.log('[MEDIA API] Upload successful:', {
        id: mediaItem.id,
        filename: mediaItem.filename,
        path: mediaItem.filePath
      })
      
      // Add rate limit info to response headers
      const response = NextResponse.json(mediaItem, { status: 201 })
      response.headers.set('X-RateLimit-Limit', '10')
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
      
      return response
    } catch (dbError) {
      // Database failed, clean up the file
      console.error('[MEDIA API] Database error, cleaning up uploaded file')
      
      // Clean up from R2 or local storage
      if (isR2Configured()) {
        try {
          await deleteFromR2(storageKey)
          console.log('[MEDIA API] R2 file cleanup successful')
        } catch (cleanupError) {
          console.error('[MEDIA API] R2 file cleanup failed:', cleanupError)
        }
      } else {
        // Local storage cleanup
        const uploadDir = process.env.UPLOAD_PATH || path.join(process.cwd(), 'public', 'uploads')
        const filePath = path.join(uploadDir, storageKey)
        try {
          await unlink(filePath)
          console.log('[MEDIA API] Local file cleanup successful')
        } catch (cleanupError) {
          console.error('[MEDIA API] Local file cleanup failed:', cleanupError)
        }
      }
      
      throw dbError
    }
  } catch (error) {
    console.error('[MEDIA API] Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
  } catch (error) {
    // Outer catch for any unexpected errors
    console.error('[MEDIA API] Unexpected error in media upload:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE /api/media - Delete a media item
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const isAuthed = await checkAuth(request)
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get media item ID from query params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Media item ID is required' },
        { status: 400 }
      )
    }

    // Get media item from database
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: parseInt(id) }
    })

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    // Delete from storage (R2 or local)
    if (isR2Configured()) {
      // Extract key from URL if it's an R2 URL
      const key = mediaItem.filePath.startsWith('http') 
        ? mediaItem.filename // Use stored key
        : mediaItem.filename
      
      try {
        await deleteFromR2(key)
        console.log('[MEDIA API] Deleted from R2:', key)
      } catch (error) {
        console.error('[MEDIA API] Failed to delete from R2:', error)
        // Continue with database deletion even if R2 deletion fails
      }
    } else {
      // Delete from local storage
      const uploadDir = process.env.UPLOAD_PATH || path.join(process.cwd(), 'public', 'uploads')
      const filePath = path.join(uploadDir, mediaItem.filename)
      
      try {
        if (existsSync(filePath)) {
          await unlink(filePath)
          console.log('[MEDIA API] Deleted local file:', filePath)
        }
      } catch (error) {
        console.error('[MEDIA API] Failed to delete local file:', error)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await prisma.mediaItem.delete({
      where: { id: parseInt(id) }
    })

    console.log('[MEDIA API] Media item deleted:', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[MEDIA API] Error deleting media item:', error)
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    )
  }
}