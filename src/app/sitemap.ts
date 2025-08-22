import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://westactoncc.org.uk'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/facilities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community-groups`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    // Only generate dynamic routes if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return staticRoutes
    }
    
    // Get dynamic routes from database
    const [programs, facilities, communityGroups] = await Promise.all([
      prisma.program.findMany({
        where: { active: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.facility.findMany({
        where: { active: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.communityGroup.findMany({
        where: { active: true },
        select: { id: true, updated_at: true },
      }),
    ])

    // Add program routes (if individual program pages exist)
    const programRoutes: MetadataRoute.Sitemap = programs.map((program) => ({
      url: `${baseUrl}/programs/${program.id}`,
      lastModified: program.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // Add facility routes (if individual facility pages exist)
    const facilityRoutes: MetadataRoute.Sitemap = facilities.map((facility) => ({
      url: `${baseUrl}/facilities/${facility.id}`,
      lastModified: facility.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // Add community group routes (if individual group pages exist)
    const groupRoutes: MetadataRoute.Sitemap = communityGroups.map((group) => ({
      url: `${baseUrl}/community-groups/${group.id}`,
      lastModified: group.updated_at || new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))

    return [
      ...staticRoutes,
      // Only include dynamic routes if individual pages exist
      // For now, we'll exclude them as they don't have individual pages yet
      // ...programRoutes,
      // ...facilityRoutes,
      // ...groupRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if database query fails
    return staticRoutes
  }
}