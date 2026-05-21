"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { s, FormRow, CheckRow } from "./AdminUI"
import Link from "next/link"
import { getMediaDisplayUrl } from "@/lib/media-url"

const CATEGORIES = ["cake", "pastry", "bread", "fermented", "provisions", "seasonal"]
const UNITS = ["g", "kg"]

interface Discount { type: 'percent' | 'amount'; value: string }
interface WeightVariant { amount: string; unit: string; price: string; discount?: Discount }

function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) } catch { return fallback }
}

function parsePrice(raw: string): number {
  return parseFloat(raw.replace(/[^0-9.]/g, '')) || 0
}

function calcOther(priceStr: string, disc: Discount): string {
  const price = parsePrice(priceStr)
  if (!price || !disc.value) return ''
  const val = parseFloat(disc.value)
  if (!val) return ''
  if (disc.type === 'percent') {
    const amt = price * val / 100
    return `£${amt % 1 === 0 ? amt.toFixed(0) : amt.toFixed(2)} off`
  } else {
    const pct = (val / price) * 100
    return `${Math.round(pct * 10) / 10}% off`
  }
}

function DiscountRow({ price, disc, onChange }: {
  price: string
  disc: Discount | undefined
  onChange: (d: Discount | undefined) => void
}) {
  const type = disc?.type ?? 'none'
  const value = disc?.value ?? ''
  const other = disc && price ? calcOther(price, disc) : ''

  function setType(t: string) {
    if (t === 'none') { onChange(undefined); return }
    onChange({ type: t as 'percent' | 'amount', value })
  }
  function setValue(v: string) {
    if (!disc) return
    onChange({ ...disc, value: v })
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        style={{ ...s.select, width: 110, marginBottom: 0, fontSize: 12 }}
      >
        <option value="none">No discount</option>
        <option value="percent">% off</option>
        <option value="amount">£ off</option>
      </select>
      {disc && (
        <>
          <input
            type="number"
            min="0"
            step="any"
            placeholder={disc.type === 'percent' ? 'e.g. 15' : 'e.g. 3'}
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ ...s.input, width: 80, marginBottom: 0, fontSize: 12 }}
          />
          {other && (
            <span style={{ fontSize: 11, color: '#7a7060', fontStyle: 'italic' }}>= also {other}</span>
          )}
        </>
      )}
    </div>
  )
}

export default function ProductForm({ product }: { product: any }) {
  const router = useRouter()
  const isNew = !product

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    pageUrl: product?.pageUrl ?? "",
    imageUrl: product?.imageUrl ?? "",
    category: product?.category ?? "cake",
    available: product?.available ?? true,
    featured: product?.featured ?? false,
    orderNote: product?.orderNote ?? "",
    displayOrder: product?.displayOrder ?? 0,
  })

  const [weights, setWeights] = useState<WeightVariant[]>(parseJSON(product?.weights, []))
  const [discount, setDiscount] = useState<Discount | undefined>(parseJSON(product?.discount, undefined))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [imageUploading, setImageUploading] = useState(false)

  function set(key: string, value: any) { setForm(f => ({ ...f, [key]: value })) }

  function addWeight() {
    setWeights(w => [...w, { amount: "", unit: "kg", price: "" }])
  }
  function removeWeight(i: number) {
    setWeights(w => w.filter((_, idx) => idx !== i))
  }
  function updateWeight(i: number, field: keyof WeightVariant, value: any) {
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
        body: JSON.stringify({
          ...form,
          weights: validWeights.length ? validWeights : null,
          discount: discount?.value ? discount : null,
        }),
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
            <label style={s.label}>Base price — optional if using weight variants</label>
            <input style={s.input} value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. £25 · leave blank to price by weight" />
          </FormRow>
        </div>

        {/* Product-level discount */}
        <div style={{ marginBottom: "24px", padding: "14px 16px", background: "#fffef5", border: "1px solid #e8e3dc", borderRadius: "8px" }}>
          <label style={{ ...s.label, marginBottom: "8px", display: "block" }}>Product discount</label>
          <DiscountRow
            price={form.price}
            disc={discount}
            onChange={setDiscount}
          />
          {!weights.length && discount?.value && form.price && (
            <p style={{ fontSize: 11, color: "#aaa", marginTop: 6, marginBottom: 0 }}>
              Applies to the base price above. Per-variant discounts override this.
            </p>
          )}
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
            <div key={i} style={{ marginBottom: "12px", padding: "12px", background: "#fafaf8", border: "1px solid #e8e3dc", borderRadius: "8px" }}>
              {/* Main row */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: row.discount || true ? "8px" : 0 }}>
                <input
                  type="number" min="0" step="any" placeholder="Amount"
                  value={row.amount}
                  onChange={e => updateWeight(i, "amount", e.target.value)}
                  style={{ ...s.input, width: "80px", marginBottom: 0 }}
                />
                <select
                  value={row.unit}
                  onChange={e => updateWeight(i, "unit", e.target.value)}
                  style={{ ...s.select, width: "65px", marginBottom: 0 }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input
                  type="text" placeholder="Price e.g. £10"
                  value={row.price}
                  onChange={e => updateWeight(i, "price", e.target.value)}
                  style={{ ...s.input, flex: 1, marginBottom: 0 }}
                />
                <button
                  type="button" onClick={() => removeWeight(i)}
                  style={{ background: "none", border: "1px solid #e0d8cc", borderRadius: "5px", cursor: "pointer", padding: "6px 10px", color: "#999", fontSize: "14px", lineHeight: 1 }}
                >✕</button>
              </div>

              {/* Discount sub-row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", width: 56, flexShrink: 0 }}>Discount</span>
                <DiscountRow
                  price={row.price}
                  disc={row.discount}
                  onChange={d => updateWeight(i, "discount", d)}
                />
              </div>
            </div>
          ))}
        </div>

        <FormRow>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} value={form.description} onChange={e => set("description", e.target.value)} />
        </FormRow>

        <FormRow>
          <label style={s.label}>Linked page URL</label>
          <input style={s.input} value={form.pageUrl} onChange={e => set("pageUrl", e.target.value)} placeholder="e.g. /kimchi" />
          <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, marginBottom: 0 }}>
            Links this product to a page on the site. The shop card will show a "View page" button, and that page will use this product's price and variants.
          </p>
        </FormRow>

        <FormRow>
          <label style={s.label}>Image</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input style={{ ...s.input, flex: 1, marginBottom: 0 }} value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="Paste a URL, or upload →" />
            <label style={{ padding: "8px 14px", background: imageUploading ? "#ccc" : "#1a1a1a", color: "#fff", borderRadius: "6px", fontSize: "13px", cursor: imageUploading ? "default" : "pointer", whiteSpace: "nowrap", fontFamily: "'Nunito', sans-serif" }}>
              {imageUploading ? "Uploading…" : "Upload photo"}
              {!imageUploading && (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setImageUploading(true)
                    try {
                      const fd = new FormData()
                      fd.append("file", file)
                      const res = await fetch("/api/media", { method: "POST", body: fd })
                      if (!res.ok) throw new Error(await res.text())
                      const item = await res.json()
                      set("imageUrl", item.filePath ?? item.url ?? "")
                    } catch (err: any) {
                      setError("Image upload failed: " + err.message)
                    } finally {
                      setImageUploading(false)
                      e.target.value = ""
                    }
                  }}
                />
              )}
            </label>
          </div>
          {form.imageUrl && (
            <img src={getMediaDisplayUrl(form.imageUrl)} alt="preview" style={{ marginTop: "8px", maxHeight: "120px", borderRadius: "6px", objectFit: "cover" }} />
          )}
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
