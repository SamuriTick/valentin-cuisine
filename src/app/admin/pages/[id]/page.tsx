export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PageForm from "@/components/admin/PageForm"

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await prisma.page.findUnique({ where: { id: Number(id) } })
  if (!page || page.deletedAt) notFound()
  return <PageForm page={page} />
}
