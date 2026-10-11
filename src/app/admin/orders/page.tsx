"use client"

import { useState, useEffect } from "react"
import { CUSTOMER_EMAILS, orderSummary, toPlainText } from "@/lib/customerEmails"

type Order = {
  id: number; name: string; email: string; phone: string | null;
  items: string; total: number | null; stage: string; paid: boolean; createdAt: string; deletedAt: string | null;
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
  const [view, setView] = useState<"active" | "trash">("active")

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

  async function setTrashed(id: number, trashed: boolean) {
    setOrders(os => os.map(o => o.id === id ? { ...o, deletedAt: trashed ? new Date().toISOString() : null } : o))
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, trashed }),
    })
  }

  async function deleteForever(id: number) {
    if (!confirm("Permanently delete this order? This can't be undone.")) return
    setOrders(os => os.filter(o => o.id !== id))
    await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" })
  }

  async function emptyTrash() {
    if (!confirm("Permanently delete everything in the trash? This can't be undone.")) return
    setOrders(os => os.filter(o => !o.deletedAt))
    await fetch("/api/admin/orders?all=1", { method: "DELETE" })
  }

  function gmailLink(o: Order, slug: string) {
    const email = CUSTOMER_EMAILS.find(e => e.slug === slug)!
    const total = o.total == null ? "" : o.total % 1 === 0 ? o.total.toFixed(0) : o.total.toFixed(2)
    const body = toPlainText(email, { name: o.name, order: orderSummary(o.items), total })
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(o.email)}&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(body)}`
  }

  function daysLeft(deletedAt: string) {
    const ms = new Date(deletedAt).getTime() + 14 * 24 * 60 * 60 * 1000 - Date.now()
    return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
  }

  const active = orders.filter(o => !o.deletedAt)
  const trashed = orders.filter(o => o.deletedAt)
  const shown = view === "active" ? active : trashed
  const tab = (on: boolean): React.CSSProperties => ({
    padding: "8px 14px", fontSize: 13, borderRadius: 4, cursor: "pointer",
    border: "1px solid " + (on ? "#1a1a1a" : "#e8e3dc"),
    background: on ? "#1a1a1a" : "#fff", color: on ? "#fff" : "#1a1a1a",
  })

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 28, margin: "0 0 6px" }}>Orders</h1>
      <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)", margin: "0 0 24px" }}>Every kimchi order placed on the site. Update the stage and payment as you go.</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setView("active")} style={tab(view === "active")}>Orders ({active.length})</button>
        <button onClick={() => setView("trash")} style={tab(view === "trash")}>Trash ({trashed.length})</button>
        {view === "trash" && trashed.length > 0 && (
          <button onClick={emptyTrash} style={{ marginLeft: "auto", padding: "8px 14px", fontSize: 13, borderRadius: 4, cursor: "pointer", border: "1px solid #DC2626", background: "#fff", color: "#DC2626" }}>
            Empty trash
          </button>
        )}
      </div>
      {view === "trash" && (
        <p style={{ fontSize: 12, color: "rgba(26,26,26,0.5)", margin: "0 0 16px" }}>Orders in the trash are permanently deleted automatically after 14 days.</p>
      )}

      {loading ? (
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>Loading…</p>
      ) : shown.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>{view === "active" ? "No orders yet." : "Trash is empty."}</p>
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
              {shown.map(o => (
                <tr key={o.id}>
                  <td style={{ ...td, fontWeight: 600 }}>{o.name}</td>
                  <td style={td}>
                    {o.items}
                    {o.total != null && <div style={{ fontSize: 12, color: "rgba(26,26,26,0.5)", marginTop: 2 }}>£{o.total % 1 === 0 ? o.total.toFixed(0) : o.total.toFixed(2)}</div>}
                  </td>
                  <td style={td}><a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(o.email)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3d7a6b" }}>{o.email}</a></td>
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
                  <td style={{ ...td, whiteSpace: "nowrap" }}>
                    {view === "active" ? (
                      <>
                      <select value="" onChange={e => { if (e.target.value) window.open(gmailLink(o, e.target.value), "_blank", "noopener,noreferrer") }}
                        style={{ ...select, fontSize: 12, color: "#c2412d", fontWeight: 600, marginRight: 12 }}>
                        <option value="">Email…</option>
                        {CUSTOMER_EMAILS.map(em => <option key={em.slug} value={em.slug}>{em.name}</option>)}
                      </select>
                      <button onClick={() => setTrashed(o.id, true)} style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setTrashed(o.id, false)} style={{ fontSize: 12, color: "#3d7a6b", fontWeight: 600, background: "none", border: "none", cursor: "pointer", marginRight: 12 }}>Restore</button>
                        <button onClick={() => deleteForever(o.id)} style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Delete forever</button>
                        <div style={{ fontSize: 11, color: "rgba(26,26,26,0.4)", marginTop: 4 }}>{daysLeft(o.deletedAt!)} day{daysLeft(o.deletedAt!) === 1 ? "" : "s"} left</div>
                      </>
                    )}
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
