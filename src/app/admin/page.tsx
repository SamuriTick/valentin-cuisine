import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const [products, references, media] = await Promise.all([
    prisma.product.count(),
    prisma.reference.count({ where: { active: true } }),
    prisma.mediaItem.count(),
  ])

  const cards = [
    { label: "Products",    count: products,   href: "/admin/products" },
    { label: "References",  count: references, href: "/admin/references" },
    { label: "Media files", count: media,      href: "/admin/media" },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#1a1a1a", marginBottom: "8px" }}>
        Overview
      </h1>
      <p style={{ color: "#7A7060", fontSize: "14px", marginBottom: "32px" }}>
        Welcome back. Here&apos;s an overview of your site.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#fff", border: "1px solid #e8e3dc", borderRadius: "10px",
              padding: "20px",
            }}>
              <div style={{ fontSize: "32px", fontWeight: 700, color: "#1a1a1a" }}>{c.count}</div>
              <div style={{ fontSize: "13px", color: "#7A7060", marginTop: "4px" }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
