import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { s } from "@/components/admin/AdminUI"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] })

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={s.heading as any}>Products</h1>
        <Link href="/admin/products/new" style={{ ...s.btnGold, textDecoration: "none", display: "inline-block" } as any}>
          + New product
        </Link>
      </div>

      <div style={s.card}>
        {products.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#7A7060" }}>
            No products yet. <Link href="/admin/products/new" style={{ color: "#B8962E" }}>Create one</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={s.tableHead}>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Category</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Available</th>
                <th style={s.th}>Featured</th>
                <th style={{ ...s.th, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={s.td}><strong>{p.name}</strong></td>
                  <td style={{ ...s.td, color: "#7A7060" }}>{p.category}</td>
                  <td style={{ ...s.td, color: "#7A7060" }}>{p.price || "—"}</td>
                  <td style={s.td}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: 600, background: p.available ? "#DCFCE7" : "#F3F4F6", color: p.available ? "#166534" : "#6B7280" }}>
                      {p.available ? "Yes" : "No"}
                    </span>
                  </td>
                  <td style={s.td}>{p.featured ? "★" : ""}</td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <Link href={`/admin/products/${p.id}`} style={{ color: "#B8962E", fontSize: "13px", textDecoration: "none" }}>Edit</Link>
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
