export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import ShopClient from '@/components/cuisine/ShopClient'

export const metadata = {
  title: 'Shop · Valentin\'s Cuisine',
  description: 'Order custom cakes, kimchi, pastries and more from Valentin Thang — Putney, London.',
}

export default async function ShopPage() {
  const raw = await prisma.product.findMany({
    where: { available: true },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  })

  const products = raw.map(p => ({
    ...p,
    weights: p.weights ? (() => { try { return JSON.parse(p.weights!) } catch { return [] } })() : [],
    discount: p.discount ? (() => { try { return JSON.parse(p.discount!) } catch { return null } })() : null,
  }))

  return <ShopClient products={products} />
}
