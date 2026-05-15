export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { s, Badge } from "@/components/admin/AdminUI"

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={s.heading as any}>Posts</h1>
        <Link href="/admin/posts/new" style={{ ...s.btnGold, textDecoration: "none", display: "inline-block" } as any}>
          + New post
        </Link>
      </div>

      <div style={s.card}>
        {posts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#7A7060" }}>
            No posts yet. <Link href="/admin/posts/new" style={{ color: "#B8962E" }}>Create one</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={s.tableHead}>
              <tr>
                <th style={s.th}>Title</th>
                <th style={s.th}>Category</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
                <th style={{ ...s.th, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td style={s.td}><strong>{p.title}</strong></td>
                  <td style={{ ...s.td, color: "#7A7060" }}>{p.category}</td>
                  <td style={s.td}><Badge published={p.published} /></td>
                  <td style={{ ...s.td, color: "#7A7060", fontSize: "12px" }}>{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <Link href={`/admin/posts/${p.id}`} style={{ color: "#B8962E", fontSize: "13px", textDecoration: "none" }}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
