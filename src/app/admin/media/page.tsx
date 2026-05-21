"use client"

import { useState, useEffect } from "react"
import { s } from "@/components/admin/AdminUI"

type Media = {
  id: number; filename: string; originalName: string; filePath: string;
  fileType: string; fileSize: number | null; altText: string | null;
  caption: string | null; tags: string | null; featured: boolean;
  width: number | null; height: number | null; uploadedAt: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([])
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState("all")
  const [error, setError] = useState("")

  async function load() {
    const res = await fetch("/api/media")
    if (res.ok) setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const form = new FormData()
      form.append("file", file)
      const tags = file.type === "application/pdf" ? "cv" : "gallery"
      form.append("tags", tags)
      const res = await fetch("/api/media", { method: "POST", body: form })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(body.detail ? `${body.error}: ${body.detail}` : body.error)
      }
      await load()
    } catch (e: any) {
      setError(e.message)
    }
    setUploading(false)
    e.target.value = ""
  }

  async function del(id: number) {
    if (!confirm("Delete this file?")) return
    await fetch(`/api/media/${id}`, { method: "DELETE" })
    await load()
  }

  const filtered = filter === "all" ? items : items.filter(i => (i.tags || "").includes(filter))

  const tagOptions = ["all", "gallery"]

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={s.heading as any}>Media</h1>
        <label style={{ ...s.btnGold, cursor: "pointer", display: "inline-block" }}>
          {uploading ? "Uploading…" : "Upload file"}
          <input type="file" accept="image/*,.pdf" onChange={upload} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>

      {error && <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {tagOptions.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "5px 14px", borderRadius: "99px", fontSize: "13px", cursor: "pointer",
            background: filter === t ? "#1a1a1a" : "#fff", color: filter === t ? "#fff" : "#1a1a1a",
            border: "1px solid", borderColor: filter === t ? "#1a1a1a" : "#e8e3dc",
          }}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...s.card, padding: "40px", textAlign: "center", color: "#7A7060" } as any}>
          No files yet. Upload an image or PDF above.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {filtered.map(item => (
            <div key={item.id} style={{ ...s.card, overflow: "hidden" } as any}>
              <div style={{ height: "140px", background: "#F0EBE0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {item.fileType === "image" ? (
                  <img
                    src={item.filePath}
                    alt={item.altText || item.originalName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{ fontSize: "36px" }}>📄</div>
                )}
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "12px", color: "#1a1a1a", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.originalName}
                </div>
                <div style={{ fontSize: "11px", color: "#7A7060", marginTop: "2px" }}>
                  {item.tags || "—"} · {item.fileType}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", alignItems: "center" }}>
                  <a href={item.filePath} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "#B8962E", textDecoration: "none" }}>View</a>
                  <button onClick={() => del(item.id)} style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
