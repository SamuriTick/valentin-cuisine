"use client"

import { useState, useEffect } from "react"

type Order = {
  id: number; name: string; email: string; phone: string | null;
  items: string; total: number | null; stage: string; paid: boolean; createdAt: string;
}

const STAGES = [
  { value: "ordered", label: "Ordered" },
  { value: "confirmed", label: "Confirmed" },
  { value: "ready", label: "Ready to collect" },
  { value: "collected", label: "Collected" },
]

const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(26,26,26,0.5)", borderBottom: "1px solid #e8e3dc", whiteSpace: "nowrap" }
const td: React.CSSProperties = { padding: "12px", fontSize: 13, color: "#1a1a1a", borderBottom: "1px solid #f0ece6", verticalAlign: "top" }
const select: React.CSSProperties = { padding: "6px 8px", fontSize: 13, border: "1px solid #e8e3dc", borderRadius: 4, background: "#fff", cursor: "pointer" }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch("/api/admin/orders")
    if (res.ok) setOrders(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function update(id: number, patch: Partial<Pick<Order, "stage" | "paid">>) {
    setOrders(os => os.map(o => o.id === id ? { ...o, ...patch } : o))
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    })
  }

  async function remove(id: number) {
    if (!confirm("Delete this order?")) return
    setOrders(os => os.filter(o => o.id !== id))
    await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" })
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 28, margin: "0 0 6px" }}>Orders</h1>
      <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)", margin: "0 0 24px" }}>Every kimchi order placed on the site. Update the stage and payment as you go.</p>

      {loading ? (
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>Loading…</p>
      ) : orders.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>No orders yet.</p>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6 }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 820 }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Order</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>Ordered on</th>
                <th style={th}>Stage</th>
                <th style={th}>Payment</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ ...td, fontWeight: 600 }}>{o.name}</td>
                  <td style={td}>
                    {o.items}
                    {o.total != null && <div style={{ fontSize: 12, color: "rgba(26,26,26,0.5)", marginTop: 2 }}>£{o.total % 1 === 0 ? o.total.toFixed(0) : o.total.toFixed(2)}</div>}
                  </td>
                  <td style={td}><a href={`mailto:${o.email}`} style={{ color: "#3d7a6b" }}>{o.email}</a></td>
                  <td style={td}>{o.phone ? <a href={`tel:${o.phone}`} style={{ color: "#3d7a6b" }}>{o.phone}</a> : <span style={{ color: "rgba(26,26,26,0.3)" }}>—</span>}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{new Date(o.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td style={td}>
                    <select value={o.stage} onChange={e => update(o.id, { stage: e.target.value })} style={select}>
                      {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <select value={o.paid ? "paid" : "unpaid"} onChange={e => update(o.id, { paid: e.target.value === "paid" })}
                      style={{ ...select, color: o.paid ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                      <option value="unpaid">Not paid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td style={td}>
                    <button onClick={() => remove(o.id)} style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
