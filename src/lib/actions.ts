'use server'

import { prisma } from '@/lib/prisma'

export async function getFeaturedPrograms() {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    return await prisma.program.findMany({
      where: { active: true },
      include: {
        schedules: {
          where: { active: true },
          orderBy: { id: 'asc' }
        }
      },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching featured programs:', error)
    return []
  }
}

export async function getFacilities() {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const facilities = await prisma.facility.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' }
    })

    // Ensure features is always an array
    return facilities.map(facility => ({
      ...facility,
      features: Array.isArray(facility.features) ? facility.features : []
    }))
  } catch (error) {
    console.error('Error fetching facilities:', error)
    return []
  }
}

export async function getActiveFacilities(take?: number) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const query: any = {
      where: { active: true },
      orderBy: { createdAt: 'asc' }
    }

    if (take) {
      query.take = take
    }

    const facilities = await prisma.facility.findMany(query)
    
    // Ensure features is always an array
    return facilities.map(facility => ({
      ...facility,
      features: Array.isArray(facility.features) ? facility.features : []
    }))
  } catch (error) {
    console.error('Error fetching active facilities:', error)
    return []
  }
}

export async function getActivePrograms(take?: number) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const query: any = {
      where: { active: true },
      include: {
        schedules: {
          where: { active: true },
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    }

    if (take) {
      query.take = take
    }

    return await prisma.program.findMany(query)
  } catch (error) {
    console.error('Error fetching active programs:', error)
    return []
  }
}

export async function getFacilityGallery() {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    return await prisma.facility_gallery.findMany({
      where: { active: true },
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' }
      ]
    })
  } catch (error) {
    console.error('Error fetching facility gallery:', error)
    return []
  }
}

export async function getNews() {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const news = await prisma.newsPost.findMany({
      where: {
        published: true
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    // Convert dates to strings for serialization
    return news.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

export async function getNewsPost(slug: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return null
    }

    const post = await prisma.newsPost.findUnique({
      where: { slug }
    })
    
    if (!post) {
      return null
    }

    // Convert dates to strings for serialization
    return {
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error fetching news post:', error)
    return null
  }
}

export async function getRelatedNews(category: string, currentSlug: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const news = await prisma.newsPost.findMany({
      where: {
        published: true,
        category,
        slug: { not: currentSlug }
      },
      orderBy: { publishedAt: 'desc' },
      take: 3
    })
    
    // Convert dates to strings for serialization
    return news.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching related news:', error)
    return []
  }
}