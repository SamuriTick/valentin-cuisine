"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { s, FormRow, CheckRow } from "./AdminUI"
import Link from "next/link"

const CATEGORIES = ["cake", "pastry", "bread", "fermented", "seasonal"]
const UNITS = ["g", "kg"]

interface WeightVariant {
  amount: string
  unit: string
  price: string
}

function parseWeights(raw: string | null | undefined): WeightVariant[] {
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export default function ProductForm({ product }: { product: any }) {
  const router = useRouter()
  const isNew = !product

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    imageUrl: product?.imageUrl ?? "",
    category: product?.category ?? "cake",
    available: product?.available ?? true,
    featured: product?.featured ?? false,
    orderNote: product?.orderNote ?? "",
    displayOrder: product?.displayOrder ?? 0,
  })

  const [weights, setWeights] = useState<WeightVariant[]>(parseWeights(product?.weights))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function set(key: string, value: any) { setForm(f => ({ ...f, [key]: value })) }

  function addWeight() {
    setWeights(w => [...w, { amount: "", unit: "kg", price: "" }])
  }

  function removeWeight(i: number) {
    setWeights(w => w.filter((_, idx) => idx !== i))
  }

  function updateWeight(i: number, field: keyof WeightVariant, value: string) {
    setWeights(w => w.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  async function save() {
    setSaving(true)
    setError("")
    try {
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`
      const method = isNew ? "POST" : "PUT"
      const validWeights = weights.filter(w => w.amount && w.price)
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, weights: validWeights.length ? validWeights : null }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      router.push(`/admin/products/${data.id}`)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  async function del() {
    if (!confirm("Delete this product?")) return
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" })
    if (res.ok) router.push("/admin/products")
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link href="/admin/products" style={{ color: "#7A7060", textDecoration: "none", fontSize: "14px" }}>← Products</Link>
        <h1 style={s.heading as any}>{isNew ? "New product" : "Edit product"}</h1>
      </div>

      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

      <div style={{ background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px", padding: "24px" }}>
        <FormRow>
          <label style={s.label}>Name</label>
          <input style={s.input} value={form.name} onChange={e => set("name", e.target.value)} />
        </FormRow>

        <div className="admin-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FormRow>
            <label style={s.label}>Category</label>
            <select style={s.select} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormRow>
          <FormRow>
            <label style={s.label}>Base price (e.g. "£25")</label>
            <input style={s.input} value={form.price} onChange={e => set("price", e.target.value)} placeholder="£25" />
          </FormRow>
        </div>

        {/* Weight variants */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <label style={s.label}>Weight variants</label>
            <button
              type="button"
              onClick={addWeight}
              style={{ fontSize: "12px", padding: "4px 12px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}
            >
              + Add variant
            </button>
          </div>

          {weights.length === 0 && (
            <p style={{ fontSize: "13px", color: "#aaa", fontStyle: "italic", marginBottom: 0 }}>
              No variants yet — click "Add variant" to add weight options with individual prices.
            </p>
          )}

          {weights.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
              {/* Amount */}
              <input
                type="number"
                min="0"
                step="any"
                placeholder="Amount"
                value={row.amount}
                onChange={e => updateWeight(i, "amount", e.target.value)}
                style={{ ...s.input, width: "90px", marginBottom: 0 }}
              />
              {/* Unit */}
              <select
                value={row.unit}
                onChange={e => updateWeight(i, "unit", e.target.value)}
                style={{ ...s.select, width: "70px", marginBottom: 0 }}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {/* Price */}
              <input
                type="text"
                placeholder="Price e.g. £10"
                value={row.price}
                onChange={e => updateWeight(i, "price", e.target.value)}
                style={{ ...s.input, flex: 1, marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={() => removeWeight(i)}
                style={{ background: "none", border: "1px solid #e0d8cc", borderRadius: "5px", cursor: "pointer", padding: "6px 10px", color: "#999", fontSize: "14px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          ))}

          {weights.length > 0 && (
            <p style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>
              Example: 1 kg → £10, 2 kg → £15
            </p>
          )}
        </div>

        <FormRow>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} value={form.description} onChange={e => set("description", e.target.value)} />
        </FormRow>

        <FormRow>
          <label style={s.label}>Image URL</label>
          <input style={s.input} value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" />
        </FormRow>

        <FormRow>
          <label style={s.label}>Order note (shown on order form)</label>
          <input style={s.input} value={form.orderNote} onChange={e => set("orderNote", e.target.value)} placeholder="e.g. 3 days notice required" />
        </FormRow>

        <FormRow>
          <label style={s.label}>Display order</label>
          <input type="number" style={{ ...s.input, width: "100px" }} value={form.displayOrder} onChange={e => set("displayOrder", Number(e.target.value))} />
        </FormRow>

        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <CheckRow label="Available" checked={form.available} onChange={v => set("available", v)} />
          <CheckRow label="Featured" checked={form.featured} onChange={v => set("featured", v)} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!isNew ? (
            <button onClick={del} style={s.btnDanger}>Delete</button>
          ) : <span />}
          <button onClick={save} disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
