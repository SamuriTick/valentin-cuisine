export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: Number(params.id) } })
  if (!product) notFound()
  return <ProductForm product={product} />
}
