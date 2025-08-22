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