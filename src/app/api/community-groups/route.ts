import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth-middleware'

// GET /api/community-groups - Get all community groups
export async function GET() {
  try {
    const groups = await prisma.communityGroup.findMany({
      where: { active: true },
      orderBy: [
        { featured: 'desc' },
        { display_order: 'asc' },
        { created_at: 'desc' }
      ]
    })

    return NextResponse.json(groups, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching community groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community groups' },
      { status: 500 }
    )
  }
}

// POST /api/community-groups - Create a new community group
export async function POST(request: NextRequest) {
  // Check authentication for write operations
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const {
      title,
      name,
      description,
      category,
      meetingTime,
      meetingDay,
      contactName,
      contactEmail,
      contactPhone,
      imageUrl,
      websiteUrl,
      facebookUrl,
      instagramUrl,
      memberCount,
      ageGroup,
      language,
      fees,
      featured,
      displayOrder
    } = body

    const group = await prisma.communityGroup.create({
      data: {
        title: title || name, // Use title for compatibility, fallback to name
        name,
        description,
        category,
        meeting_time: meetingTime,
        meeting_day: meetingDay,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        image_url: imageUrl,
        website_url: websiteUrl,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        member_count: memberCount,
        age_group: ageGroup,
        language,
        fees,
        featured: featured || false,
        display_order: displayOrder || 0
      }
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating community group:', error)
    return NextResponse.json(
      { error: 'Failed to create community group' },
      { status: 500 }
    )
  }
}