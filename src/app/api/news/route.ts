import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const where: any = {}
    
    if (published !== null) {
      where.published = published === 'true'
    }
    
    if (featured !== null) {
      where.featured = featured === 'true'
    }
    
    if (category) {
      where.category = category
    }

    const news = await prisma.newsPost.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
      
      // Ensure slug is unique
      const existingPost = await prisma.newsPost.findUnique({
        where: { slug }
      })
      
      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const newsPost = await prisma.newsPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content,
        imageUrl: body.imageUrl || null,
        category: body.category || 'general',
        tags: body.tags || null,
        author: body.author || session.user?.name || null,
        featured: body.featured || false,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
        displayOrder: body.displayOrder || 0
      }
    })

    return NextResponse.json(newsPost)
  } catch (error) {
    console.error('Error creating news post:', error)
    return NextResponse.json(
      { error: 'Failed to create news post' },
      { status: 500 }
    )
  }
}