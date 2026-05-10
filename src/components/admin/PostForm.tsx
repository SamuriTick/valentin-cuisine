"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { s, FormRow, CheckRow } from "./AdminUI"
import Link from "next/link"

const CATEGORIES = ["recipe", "news", "update", "achievement", "experience"]

export default function PostForm({ post }: { post: any }) {
  const router = useRouter()
  const isNew = !post

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    imageUrl: post?.imageUrl ?? "",
    category: post?.category ?? "news",
    tags: post?.tags ?? "",
    featured: post?.featured ?? false,
    published: post?.published ?? false,
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
      const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${post.id}`
      const method = isNew ? "POST" : "PUT"
      const body = { ...form, _wasPreviouslyPublished: post?.published }
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      router.push(`/admin/posts/${data.id}`)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  async function del() {
    if (!confirm("Delete this post?")) return
    const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" })
    if (res.ok) router.push("/admin/posts")
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link href="/admin/posts" style={{ color: "#7A7060", textDecoration: "none", fontSize: "14px" }}>← Posts</Link>
        <h1 style={s.heading as any}>{isNew ? "New post" : "Edit post"}</h1>
      </div>

      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

      <div style={{ background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px", padding: "24px" }}>
        <FormRow>
          <label style={s.label}>Title</label>
          <input style={s.input} value={form.title} onChange={e => set("title", e.target.value)} />
        </FormRow>

        <FormRow>
          <label style={s.label}>Slug</label>
          <input style={s.input} value={form.slug} onChange={e => set("slug", e.target.value)} />
        </FormRow>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FormRow>
            <label style={s.label}>Category</label>
            <select style={s.select} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormRow>
          <FormRow>
            <label style={s.label}>Tags (comma-separated)</label>
            <input style={s.input} value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="cake, chocolate, birthday" />
          </FormRow>
        </div>

        <FormRow>
          <label style={s.label}>Excerpt</label>
          <textarea style={{ ...s.textarea, minHeight: "70px" }} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} />
        </FormRow>

        <FormRow>
          <label style={s.label}>Content</label>
          <textarea style={{ ...s.textarea, minHeight: "240px" }} value={form.content} onChange={e => set("content", e.target.value)} />
          <div style={{ fontSize: "11px", color: "#7A7060", marginTop: "4px" }}>Supports Markdown.</div>
        </FormRow>

        <FormRow>
          <label style={s.label}>Image URL</label>
          <input style={s.input} value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" />
        </FormRow>

        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <CheckRow label="Featured" checked={form.featured} onChange={v => set("featured", v)} />
          <CheckRow label="Published" checked={form.published} onChange={v => set("published", v)} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!isNew ? (
            <button onClick={del} style={s.btnDanger}>Delete</button>
          ) : <span />}
          <button onClick={save} disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : isNew ? "Create post" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
