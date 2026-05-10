"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { s, FormRow, CheckRow } from "./AdminUI"
import Link from "next/link"

export default function PageForm({ page }: { page: any }) {
  const router = useRouter()
  const isNew = !page

  const [form, setForm] = useState({
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    content: page?.content ?? "",
    showTitle: page?.showTitle ?? true,
    showInNav: page?.showInNav ?? false,
    navOrder: page?.navOrder ?? 99,
    topLevel: page?.topLevel ?? false,
    published: page?.published ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function set(key: string, value: any) {
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === "title" && isNew) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      }
      return next
    })
  }

  async function save() {
    setSaving(true)
    setError("")
    try {
      const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${page.id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      router.push(`/admin/pages/${data.id}`)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  async function del() {
    if (!confirm("Delete this page?")) return
    const res = await fetch(`/api/admin/pages/${page.id}`, { method: "DELETE" })
    if (res.ok) router.push("/admin/pages")
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link href="/admin/pages" style={{ color: "#7A7060", textDecoration: "none", fontSize: "14px" }}>← Pages</Link>
        <h1 style={s.heading as any}>{isNew ? "New page" : "Edit page"}</h1>
      </div>

      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

      <div style={{ background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px", padding: "24px" }}>
        <FormRow>
          <label style={s.label}>Title</label>
          <input style={s.input} value={form.title} onChange={e => set("title", e.target.value)} />
        </FormRow>

        <FormRow>
          <label style={s.label}>Slug (URL: /{form.slug})</label>
          <input style={s.input} value={form.slug} onChange={e => set("slug", e.target.value)} />
        </FormRow>

        <FormRow>
          <label style={s.label}>Content</label>
          <textarea style={{ ...s.textarea, minHeight: "300px" }} value={form.content} onChange={e => set("content", e.target.value)} />
          <div style={{ fontSize: "11px", color: "#7A7060", marginTop: "4px" }}>Supports Markdown.</div>
        </FormRow>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={s.label}>Nav order</label>
            <input type="number" style={{ ...s.input, width: "100px" }} value={form.navOrder} onChange={e => set("navOrder", Number(e.target.value))} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "24px" }}>
          <CheckRow label="Show title on page" checked={form.showTitle} onChange={v => set("showTitle", v)} />
          <CheckRow label="Show in navigation" checked={form.showInNav} onChange={v => set("showInNav", v)} />
          <CheckRow label="Top level (no /pages/ prefix)" checked={form.topLevel} onChange={v => set("topLevel", v)} />
          <CheckRow label="Published" checked={form.published} onChange={v => set("published", v)} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!isNew ? (
            <button onClick={del} style={s.btnDanger}>Delete</button>
          ) : <span />}
          <button onClick={save} disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : isNew ? "Create page" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
