import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const [posts, products, pages, references, media] = await Promise.all([
    prisma.post.count(),
    prisma.product.count(),
    prisma.page.count({ where: { deletedAt: null } }),
    prisma.reference.count({ where: { active: true } }),
    prisma.mediaItem.count(),
  ])

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, category: true, published: true, createdAt: true },
  })

  const cards = [
    { label: "Posts", count: posts, href: "/admin/posts", color: "#2D5A2D" },
    { label: "Products", count: products, href: "/admin/products", color: "#B8962E" },
    { label: "Pages", count: pages, href: "/admin/pages", color: "#1E3A1E" },
    { label: "References", count: references, href: "/admin/references", color: "#7A7060" },
    { label: "Media files", count: media, href: "/admin/media", color: "#3A3A3A" },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#1E3A1E", marginBottom: "8px" }}>
        Dashboard
      </h1>
      <p style={{ color: "#7A7060", fontSize: "14px", marginBottom: "32px" }}>
        Welcome back. Here&apos;s an overview of your site.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px",
              padding: "20px", transition: "box-shadow 0.15s",
            }}>
              <div style={{ fontSize: "32px", fontWeight: 700, color: c.color }}>{c.count}</div>
              <div style={{ fontSize: "13px", color: "#7A7060", marginTop: "4px" }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #DDD8CC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1E3A1E" }}>Recent Posts</h2>
          <Link href="/admin/posts/new" style={{ fontSize: "13px", color: "#B8962E", textDecoration: "none", fontWeight: 600 }}>
            + New post
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#7A7060", fontSize: "14px" }}>
            No posts yet. <Link href="/admin/posts/new" style={{ color: "#B8962E" }}>Create one</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {recentPosts.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #F0EBE0" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <Link href={`/admin/posts/${p.id}`} style={{ fontSize: "14px", color: "#181818", textDecoration: "none", fontWeight: 500 }}>
                      {p.title}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "12px", color: "#7A7060" }}>{p.category}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{
                      fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: 600,
                      background: p.published ? "#DCFCE7" : "#F3F4F6",
                      color: p.published ? "#166534" : "#6B7280",
                    }}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "12px", color: "#7A7060", textAlign: "right" }}>
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
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
