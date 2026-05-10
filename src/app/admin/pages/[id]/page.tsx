import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PageForm from "@/components/admin/PageForm"

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: Number(params.id) } })
  if (!page || page.deletedAt) notFound()
  return <PageForm page={page} />
}
