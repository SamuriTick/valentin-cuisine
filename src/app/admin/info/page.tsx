"use client"

import { useState, useEffect } from "react"
import { parseOrderLine } from "@/lib/customerEmails"
import KimchiCosts, { type CostVariant } from "@/components/admin/KimchiCosts"

type Order = {
  id: number; name: string; email: string; phone: string | null;
  items: string; total: number | null; stage: string; paid: boolean; createdAt: string; deletedAt: string | null;
}
type Product = { pageUrl: string | null; available: boolean; weights: string | null }
type Variant = { amount: string; unit: string; price: string; discount?: { type: string; value: string } }

const STAGE_LABELS: Record<string, string> = { ordered: "Ordered", confirmed: "Confirmed", ready: "Ready to collect", collected: "Collected" }

const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(26,26,26,0.5)", borderBottom: "1px solid #e8e3dc", borderRight: "1px solid #f0ece6", whiteSpace: "nowrap", background: "#faf8f5" }
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, color: "#1a1a1a", borderBottom: "1px solid #f0ece6", borderRight: "1px solid #f0ece6", whiteSpace: "nowrap" }
const num: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }
const foot: React.CSSProperties = { ...num, fontWeight: 700, background: "#faf8f5", borderTop: "2px solid #e8e3dc" }

const sizeKey = (amount: string, unit: string) => `${Number(amount)}${unit.trim().toLowerCase()}`
const fmtKg = (kg: number) => `${Number(kg.toFixed(2))} kg`
const toKg = (amount: string, unit: string) => Number(amount) / (unit.trim().toLowerCase() === "g" ? 1000 : 1)
// Price the customer actually pays, after the size's discount
const salePrice = (v: Variant) => {
  const price = parseFloat(v.price) || 0, off = parseFloat(v.discount?.value ?? "") || 0
  return v.discount?.type === "percent" ? price * (1 - off / 100) : price - off
}
const fmtMoney = (n: number) => `£${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`

export default function InfoPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [costVariants, setCostVariants] = useState<CostVariant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch("/api/admin/orders"), fetch("/api/admin/products")]).then(async ([o, p]) => {
      if (o.ok) setOrders(await o.json())
      if (p.ok) {
        const products: Product[] = await p.json()
        const kimchi = products.find(x => x.pageUrl === "/kimchi" && x.available) ?? products.find(x => x.pageUrl === "/kimchi")
        let variants: Variant[] = []
        try { variants = kimchi?.weights ? JSON.parse(kimchi.weights) : [] } catch { /* bad JSON: no sizes */ }
        setSizes(Array.from(new Set(variants.map(v => sizeKey(v.amount, v.unit)))))
        setCostVariants(variants.map(v => ({ size: sizeKey(v.amount, v.unit), kg: toKg(v.amount, v.unit), price: salePrice(v) })))
      }
      setLoading(false)
    })
  }, [])

  const rows = orders.filter(o => !o.deletedAt).map(o => ({ ...o, line: parseOrderLine(o.items) }))
  const jarsOf = (size: string) => rows.reduce((n, r) => n + (r.line?.size === size ? r.line.qty : 0), 0)
  const kgOf = (size: string) => rows.reduce((n, r) => n + (r.line?.size === size ? r.line.kg : 0), 0)
  const totalKg = sizes.reduce((n, s) => n + kgOf(s), 0)
  const totalJars = sizes.reduce((n, s) => n + jarsOf(s), 0)
  const totalMoney = rows.reduce((n, r) => n + (r.total ?? 0), 0)
  const paidMoney = rows.reduce((n, r) => n + (r.paid ? r.total ?? 0 : 0), 0)

  function downloadCsv() {
    const cell = (v: string | number | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = [
      ["Name", "Email", "Phone", "Ordered on", ...sizes, "Total kg", "Total £", "Paid", "Stage"],
      ...rows.map(r => [
        r.name, r.email, r.phone ?? "", new Date(r.createdAt).toLocaleDateString("en-GB"),
        ...sizes.map(s => (r.line?.size === s ? r.line.qty : "")),
        r.line ? Number(r.line.kg.toFixed(2)) : "", r.total ?? "", r.paid ? "Yes" : "No", STAGE_LABELS[r.stage] ?? r.stage,
      ]),
      ["Total", "", "", "", ...sizes.map(s => jarsOf(s)), Number(totalKg.toFixed(2)), totalMoney, "", ""],
    ]
    const blob = new Blob([lines.map(l => l.map(cell).join(",")).join("\n")], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `kimchi-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6, padding: "14px 18px", minWidth: 130 }
  const cardLabel: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(26,26,26,0.5)", margin: "0 0 6px" }
  const cardValue: React.CSSProperties = { fontFamily: "Georgia, serif", fontSize: 26, color: "#1a1a1a", margin: 0, lineHeight: 1.1 }
  const cardSub: React.CSSProperties = { fontSize: 12, color: "rgba(26,26,26,0.5)", margin: "4px 0 0" }

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 28, margin: "0 0 6px" }}>Info</h1>
      <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)", margin: "0 0 24px" }}>
        All current orders as a spreadsheet, with how many jars of each size and how much kimchi to make, plus what each jar costs you to make below. Sizes follow the kimchi product, so adding or removing a size updates the totals. Orders in the trash aren&apos;t counted.
      </p>

      {loading ? (
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>Loading…</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            {sizes.map(s => (
              <div key={s} style={card}>
                <p style={cardLabel}>{s} jars</p>
                <p style={cardValue}>{jarsOf(s)}</p>
                <p style={cardSub}>{fmtKg(kgOf(s))}</p>
              </div>
            ))}
            <div style={{ ...card, borderColor: "#3d7a6b" }}>
              <p style={cardLabel}>Total kimchi</p>
              <p style={{ ...cardValue, color: "#3d7a6b" }}>{fmtKg(totalKg)}</p>
              <p style={cardSub}>{totalJars} jar{totalJars === 1 ? "" : "s"}</p>
            </div>
            <div style={card}>
              <p style={cardLabel}>Money</p>
              <p style={cardValue}>{fmtMoney(totalMoney)}</p>
              <p style={cardSub}>{fmtMoney(paidMoney)} paid</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
            <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)", margin: 0 }}>{rows.length} order{rows.length === 1 ? "" : "s"}</p>
            <button onClick={downloadCsv} disabled={rows.length === 0}
              style={{ padding: "8px 14px", fontSize: 13, borderRadius: 4, cursor: "pointer", border: "1px solid #1a1a1a", background: "#1a1a1a", color: "#fff" }}>
              Download spreadsheet (CSV)
            </button>
          </div>

          {rows.length === 0 ? (
            <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6 }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Ordered on</th>
                    {sizes.map(s => <th key={s} style={{ ...th, textAlign: "right" }}>{s}</th>)}
                    <th style={{ ...th, textAlign: "right" }}>Kg</th>
                    <th style={{ ...th, textAlign: "right" }}>Total</th>
                    <th style={th}>Paid</th>
                    <th style={th}>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const inSizes = r.line && sizes.includes(r.line.size)
                    return (
                      <tr key={r.id}>
                        <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                        <td style={td}>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                        {sizes.map(s => <td key={s} style={num}>{r.line?.size === s ? r.line.qty : ""}</td>)}
                        <td style={{ ...num, color: inSizes ? "#1a1a1a" : "rgba(26,26,26,0.35)" }} title={inSizes ? undefined : r.items}>
                          {inSizes ? Number(r.line!.kg.toFixed(2)) : "—"}
                        </td>
                        <td style={num}>{r.total != null ? fmtMoney(r.total) : ""}</td>
                        <td style={{ ...td, color: r.paid ? "#15803d" : "#b91c1c", fontWeight: 600 }}>{r.paid ? "Paid" : "Not paid"}</td>
                        <td style={td}>{STAGE_LABELS[r.stage] ?? r.stage}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ ...foot, textAlign: "left" }}>Total</td>
                    <td style={foot}></td>
                    {sizes.map(s => <td key={s} style={foot}>{jarsOf(s)}</td>)}
                    <td style={{ ...foot, color: "#3d7a6b" }}>{Number(totalKg.toFixed(2))}</td>
                    <td style={foot}>{fmtMoney(totalMoney)}</td>
                    <td style={foot}></td>
                    <td style={foot}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <KimchiCosts variants={costVariants} jars={Object.fromEntries(sizes.map(s => [s, jarsOf(s)]))} />
        </>
      )}
    </div>
  )
}
