import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { s, Badge } from "@/components/admin/AdminUI"

export default async function PagesPage() {
  const pages = await prisma.page.findMany({
    where: { deletedAt: null },
    orderBy: [{ navOrder: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={s.heading as any}>Pages</h1>
        <Link href="/admin/pages/new" style={{ ...s.btnGold, textDecoration: "none", display: "inline-block" } as any}>
          + New page
        </Link>
      </div>

      <div style={s.card}>
        {pages.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#7A7060" }}>
            No pages yet. <Link href="/admin/pages/new" style={{ color: "#B8962E" }}>Create one</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={s.tableHead}>
              <tr>
                <th style={s.th}>Title</th>
                <th style={s.th}>URL</th>
                <th style={s.th}>Top level</th>
                <th style={s.th}>Nav order</th>
                <th style={s.th}>Show title</th>
                <th style={s.th}>Show in nav</th>
                <th style={s.th}>Status</th>
                <th style={{ ...s.th, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.id}>
                  <td style={s.td}><strong>{p.title}</strong></td>
                  <td style={{ ...s.td, color: "#7A7060", fontSize: "12px" }}>/{p.slug}</td>
                  <td style={s.td}>{p.topLevel ? "✓" : ""}</td>
                  <td style={{ ...s.td, color: "#7A7060" }}>{p.navOrder}</td>
                  <td style={s.td}>{p.showTitle ? "✓" : ""}</td>
                  <td style={s.td}>{p.showInNav ? "✓" : ""}</td>
                  <td style={s.td}><Badge published={p.published} /></td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <Link href={`/admin/pages/${p.id}`} style={{ color: "#B8962E", fontSize: "13px", textDecoration: "none" }}>Edit</Link>
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
