"use client"

import { useState, useEffect, useRef } from "react"

// Kimchi costing sheet on the Info page: ingredients for one batch, scaled to each
// jar size the kimchi product sells. Saved as JSON in site_content (lang "admin",
// so the public pages never read it).

export type CostVariant = { size: string; kg: number; price: number }
type Ingredient = { name: string; amount: string; cost: string }
type Costs = { batchKg: string; ingredients: Ingredient[]; jar: Record<string, string> }

const KEY = "info.costs"
const LANG = "admin"
const DEFAULT_COSTS: Costs = {
  batchKg: "2",
  ingredients: ["Napa cabbage", "Korean radish", "Gochugaru", "Garlic", "Ginger", "Fish sauce", "Salt", "Spring onions", "Sugar"]
    .map(name => ({ name, amount: "", cost: "" })),
  jar: {},
}

const n = (s: string | undefined) => { const v = parseFloat(s ?? ""); return isFinite(v) ? v : 0 }
const money = (v: number) => `${v < 0 ? "−" : ""}£${Math.abs(v).toFixed(2)}`

const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(26,26,26,0.5)", borderBottom: "1px solid #e8e3dc", borderRight: "1px solid #f0ece6", whiteSpace: "nowrap", background: "#faf8f5" }
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, color: "#1a1a1a", borderBottom: "1px solid #f0ece6", borderRight: "1px solid #f0ece6", whiteSpace: "nowrap" }
const num: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }
const foot: React.CSSProperties = { ...num, fontWeight: 700, background: "#faf8f5", borderTop: "2px solid #e8e3dc" }
const cellInput: React.CSSProperties = { width: "100%", border: "none", background: "transparent", font: "inherit", fontSize: 13, color: "#1a1a1a", padding: "10px 12px", outline: "none", boxSizing: "border-box" }
const editCell: React.CSSProperties = { ...td, padding: 0, background: "#fffdf8" }
const box: React.CSSProperties = { overflowX: "auto", background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6 }
const h2: React.CSSProperties = { fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 22, margin: "0 0 6px" }
const note: React.CSSProperties = { fontSize: 13, color: "rgba(26,26,26,0.5)", margin: "0 0 16px" }

export default function KimchiCosts({ variants, jars }: { variants: CostVariant[]; jars: Record<string, number> }) {
  const [costs, setCosts] = useState<Costs>(DEFAULT_COSTS)
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    fetch("/api/admin/content").then(r => (r.ok ? r.json() : [])).then((rows: { key: string; lang: string; value: string }[]) => {
      const row = rows.find(r => r.key === KEY && r.lang === LANG)
      if (row) {
        try { setCosts({ ...DEFAULT_COSTS, ...JSON.parse(row.value) }) } catch { /* bad JSON: keep defaults */ }
      }
      setLoaded(true)
    })
  }, [])

  function update(next: Costs) {
    setCosts(next)
    setStatus("saving")
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ key: KEY, lang: LANG, value: JSON.stringify(next) }]),
      }).catch(() => null)
      setStatus(res?.ok ? "saved" : "error")
    }, 700)
  }

  const setIngredient = (i: number, field: keyof Ingredient, value: string) =>
    update({ ...costs, ingredients: costs.ingredients.map((g, j) => (j === i ? { ...g, [field]: value } : g)) })

  const batchKg = n(costs.batchKg)
  const batchCost = costs.ingredients.reduce((s, g) => s + n(g.cost), 0)
  const perKg = batchKg > 0 ? batchCost / batchKg : 0

  const lines = variants.map(v => {
    const ingredients = perKg * v.kg
    const jar = n(costs.jar[v.size])
    const total = ingredients + jar
    const profit = v.price - total
    return { ...v, ingredients, jar, total, profit, margin: v.price > 0 ? (profit / v.price) * 100 : 0, sold: jars[v.size] ?? 0 }
  })
  const orderCost = lines.reduce((s, l) => s + l.total * l.sold, 0)
  const orderRevenue = lines.reduce((s, l) => s + l.price * l.sold, 0)
  const orderKg = lines.reduce((s, l) => s + l.kg * l.sold, 0)

  if (!loaded) return null

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h2 style={h2}>Costs</h2>
        <span style={{ fontSize: 12, color: status === "error" ? "#b91c1c" : "rgba(26,26,26,0.45)" }}>
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Couldn't save, try again" : ""}
        </span>
      </div>
      <p style={note}>
        Type in what the ingredients cost for one batch. The second table scales that to each jar size you sell and works out the profit. Changes save automatically.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13 }}>
        <label htmlFor="batch-kg">One batch makes</label>
        <input id="batch-kg" inputMode="decimal" value={costs.batchKg} onChange={e => update({ ...costs, batchKg: e.target.value })}
          style={{ width: 60, padding: "6px 8px", fontSize: 13, border: "1px solid #e8e3dc", borderRadius: 4, textAlign: "right" }} />
        <span>kg of kimchi</span>
      </div>

      <div style={box}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={th}>Ingredient</th>
              <th style={th}>Amount per {costs.batchKg || "?"}kg</th>
              <th style={{ ...th, textAlign: "right" }}>Cost (£)</th>
              <th style={{ ...th, textAlign: "right" }}>Per kg</th>
              <th style={{ ...th, width: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {costs.ingredients.map((g, i) => (
              <tr key={i}>
                <td style={editCell}><input style={cellInput} value={g.name} placeholder="Ingredient" onChange={e => setIngredient(i, "name", e.target.value)} /></td>
                <td style={editCell}><input style={cellInput} value={g.amount} placeholder="e.g. 1.5kg" onChange={e => setIngredient(i, "amount", e.target.value)} /></td>
                <td style={editCell}><input style={{ ...cellInput, textAlign: "right" }} inputMode="decimal" value={g.cost} placeholder="0.00" onChange={e => setIngredient(i, "cost", e.target.value)} /></td>
                <td style={num}>{batchKg > 0 && g.cost ? money(n(g.cost) / batchKg) : ""}</td>
                <td style={{ ...td, padding: "0 6px" }}>
                  <button onClick={() => update({ ...costs, ingredients: costs.ingredients.filter((_, j) => j !== i) })} title="Remove row"
                    style={{ border: "none", background: "none", cursor: "pointer", color: "rgba(26,26,26,0.35)", fontSize: 16, padding: 4 }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ ...foot, textAlign: "left" }}>Total per {costs.batchKg || "?"}kg batch</td>
              <td style={foot}></td>
              <td style={foot}>{money(batchCost)}</td>
              <td style={{ ...foot, color: "#3d7a6b" }}>{money(perKg)}</td>
              <td style={foot}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button onClick={() => update({ ...costs, ingredients: [...costs.ingredients, { name: "", amount: "", cost: "" }] })}
        style={{ marginTop: 10, padding: "8px 14px", fontSize: 13, borderRadius: 4, cursor: "pointer", border: "1px solid #e8e3dc", background: "#fff", color: "#1a1a1a" }}>
        + Add ingredient
      </button>

      <h3 style={{ ...h2, fontSize: 18, marginTop: 28 }}>Cost per jar</h3>
      <p style={note}>
        Ingredient cost is the batch cost scaled to the jar&apos;s weight. Add what the jar, lid and label cost for each size. Sizes and prices come from the kimchi product.
      </p>
      {lines.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.5)" }}>The kimchi product has no sizes yet.</p>
      ) : (
        <div style={box}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Size</th>
                <th style={{ ...th, textAlign: "right" }}>Ingredients</th>
                <th style={{ ...th, textAlign: "right" }}>Jar + label (£)</th>
                <th style={{ ...th, textAlign: "right" }}>Total cost</th>
                <th style={{ ...th, textAlign: "right" }}>Sell price</th>
                <th style={{ ...th, textAlign: "right" }}>Profit</th>
                <th style={{ ...th, textAlign: "right" }}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(l => (
                <tr key={l.size}>
                  <td style={{ ...td, fontWeight: 600 }}>{l.size}</td>
                  <td style={num}>{money(l.ingredients)}</td>
                  <td style={editCell}>
                    <input style={{ ...cellInput, textAlign: "right" }} inputMode="decimal" placeholder="0.00" value={costs.jar[l.size] ?? ""}
                      onChange={e => update({ ...costs, jar: { ...costs.jar, [l.size]: e.target.value } })} />
                  </td>
                  <td style={num}>{money(l.total)}</td>
                  <td style={num}>{money(l.price)}</td>
                  <td style={{ ...num, fontWeight: 600, color: l.profit >= 0 ? "#15803d" : "#b91c1c" }}>{money(l.profit)}</td>
                  <td style={num}>{Math.round(l.margin)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {orderKg > 0 && (
        <p style={{ fontSize: 13, color: "#1a1a1a", margin: "16px 0 0" }}>
          For the current orders ({Number(orderKg.toFixed(2))} kg): costs <strong>{money(orderCost)}</strong>, brings in <strong>{money(orderRevenue)}</strong>, profit{" "}
          <strong style={{ color: orderRevenue - orderCost >= 0 ? "#15803d" : "#b91c1c" }}>{money(orderRevenue - orderCost)}</strong>.
        </p>
      )}
    </div>
  )
}
