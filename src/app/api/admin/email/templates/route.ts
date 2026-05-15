import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

const PREFIX = 'email.tpl.'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const rows = await prisma.siteContent.findMany({
      where: { key: { startsWith: PREFIX }, lang: 'en' },
      orderBy: { key: 'asc' },
    })
    const templates = rows.map(r => {
      try {
        return { slug: r.key.slice(PREFIX.length), ...JSON.parse(r.value) }
      } catch {
        return null
      }
    }).filter(Boolean)
    return NextResponse.json(templates)
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const { slug, name, subject, body } = await req.json()
    if (!slug || !name) return NextResponse.json({ error: 'slug and name required' }, { status: 400 })
    const key = PREFIX + slug
    const row = await prisma.siteContent.upsert({
      where: { key_lang: { key, lang: 'en' } },
      update: { value: JSON.stringify({ name, subject, body }) },
      create: { key, lang: 'en', value: JSON.stringify({ name, subject, body }) },
    })
    return NextResponse.json(row)
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async () => {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
    await prisma.siteContent.deleteMany({ where: { key: PREFIX + slug, lang: 'en' } })
    return NextResponse.json({ success: true })
  })
}
