export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import ShopClient from '@/components/cuisine/ShopClient'

export const metadata = {
  title: "The Deli · Valentin's Cuisine",
  description: 'Homemade provisions from Valentin Thang — beef jerky, fermented goods, and more. Made fresh in Putney, London.',
}

export default async function DeliPage() {
  const raw = await prisma.product.findMany({
    where: { available: true },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  })

  const products = raw.map(p => ({
    ...p,
    weights: p.weights ? (() => { try { return JSON.parse(p.weights!) } catch { return [] } })() : [],
    discount: p.discount ? (() => { try { return JSON.parse(p.discount!) } catch { return null } })() : null,
    pageUrl: p.pageUrl ?? null,
  }))

  return (
    <ShopClient
      products={products}
      titleMain="The"
      titleEmphasis="Deli"
      eyebrow="Homemade provisions · Putney, London"
    />
  )
}
