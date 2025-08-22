import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth-middleware'

// GET /api/community-groups/[id] - Get a specific community group
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id)
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      )
    }

    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Community group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error fetching community group:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community group' },
      { status: 500 }
    )
  }
}

// PUT /api/community-groups/[id] - Update a community group
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication for write operations
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const groupId = parseInt(params.id)
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      )
    }

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
      displayOrder,
      active
    } = body

    const updatedGroup = await prisma.communityGroup.update({
      where: { id: groupId },
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
        featured: featured !== undefined ? featured : false,
        display_order: displayOrder !== undefined ? displayOrder : 0,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json(updatedGroup)
  } catch (error) {
    console.error('Error updating community group:', error)
    return NextResponse.json(
      { error: 'Failed to update community group' },
      { status: 500 }
    )
  }
}

// DELETE /api/community-groups/[id] - Delete a community group
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication for write operations
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const groupId = parseInt(params.id)
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      )
    }

    // Soft delete - set active to false instead of hard delete
    const deletedGroup = await prisma.communityGroup.update({
      where: { id: groupId },
      data: { active: false }
    })

    return NextResponse.json(deletedGroup)
  } catch (error) {
    console.error('Error deleting community group:', error)
    return NextResponse.json(
      { error: 'Failed to delete community group' },
      { status: 500 }
    )
  }
}