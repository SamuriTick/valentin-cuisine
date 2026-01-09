import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      // Try to find by slug
      const newsPost = await prisma.newsPost.findUnique({
        where: { slug: params.id }
      })
      
      if (!newsPost) {
        return NextResponse.json(
          { error: 'News post not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(newsPost)
    }
    
    const newsPost = await prisma.newsPost.findUnique({
      where: { id }
    })

    if (!newsPost) {
      return NextResponse.json(
        { error: 'News post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(newsPost)
  } catch (error) {
    console.error('Error fetching news post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Generate slug from title if not provided
    let slug = body.slug
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      // Ensure slug is unique (excluding current post)
      const existingPost = await prisma.newsPost.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      })
      
      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }
    }
    
    // Handle publishedAt
    let publishedAt = undefined
    if (body.published && !body.publishedAt) {
      const currentPost = await prisma.newsPost.findUnique({
        where: { id },
        select: { published: true, publishedAt: true }
      })
      
      if (!currentPost?.published) {
        publishedAt = new Date()
      }
    } else if (!body.published) {
      publishedAt = null
    }

    const newsPost = await prisma.newsPost.update({
      where: { id },
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content,
        imageUrl: body.imageUrl || null,
        category: body.category || 'general',
        tags: body.tags || null,
        author: body.author || null,
        featured: body.featured || false,
        published: body.published || false,
        publishedAt,
        displayOrder: body.displayOrder || 0
      }
    })

    return NextResponse.json(newsPost)
  } catch (error) {
    console.error('Error updating news post:', error)
    return NextResponse.json(
      { error: 'Failed to update news post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      )
    }

    await prisma.newsPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news post:', error)
    return NextResponse.json(
      { error: 'Failed to delete news post' },
      { status: 500 }
    )
  }
}