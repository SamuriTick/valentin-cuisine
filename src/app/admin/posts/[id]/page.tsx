import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PostForm from "@/components/admin/PostForm"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: Number(params.id) } })
  if (!post) notFound()
  return <PostForm post={post} />
}
