import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth-middleware'
import { deleteFromR2, isR2Configured } from '@/lib/r2-storage'

// GET /api/media/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 })
    }

    const mediaItem = await prisma.mediaItem.findUnique({ where: { id } })
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 })
    }

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error('Error fetching media item:', error)
    return NextResponse.json({ error: 'Failed to fetch media item' }, { status: 500 })
  }
}

// PUT /api/media/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 })
    }

    const body = await request.json() as { altText?: string; caption?: string }
    const { altText, caption } = body

    const mediaItem = await prisma.mediaItem.update({
      where: { id },
      data: { altText: altText ?? null, caption: caption ?? null },
    })

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error('Error updating media item:', error)
    return NextResponse.json({ error: 'Failed to update media item' }, { status: 500 })
  }
}

// DELETE /api/media/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 })
    }

    const mediaItem = await prisma.mediaItem.findUnique({ where: { id } })
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 })
    }

    if (isR2Configured()) {
      try {
        await deleteFromR2(mediaItem.filename)
      } catch (error) {
        console.error('Failed to delete from R2:', error)
      }
    }

    await prisma.mediaItem.delete({ where: { id } })
    return NextResponse.json({ message: 'Media item deleted successfully' })
  } catch (error) {
    console.error('Error deleting media item:', error)
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 })
  }
}
