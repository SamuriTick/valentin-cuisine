"use client"

import { useState, useEffect } from "react"
import { s, FormRow } from "@/components/admin/AdminUI"

type Ref = {
  id: number; name: string; role: string; company: string;
  phone: string; email: string; website: string; quote: string;
  active: boolean; displayOrder: number;
}

function empty(): Omit<Ref, "id"> {
  return { name: "", role: "", company: "", phone: "", email: "", website: "", quote: "", active: true, displayOrder: 0 }
}

export default function ReferencesPage() {
  const [refs, setRefs] = useState<Ref[]>([])
  const [editing, setEditing] = useState<(Ref & { isNew?: boolean }) | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    const res = await fetch("/api/admin/references")
    if (res.ok) setRefs(await res.json())
  }

  useEffect(() => { load() }, [])

  function set(key: string, value: any) {
    setEditing(e => e ? { ...e, [key]: value } : e)
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const isNew = editing.isNew
      const url = isNew ? "/api/admin/references" : `/api/admin/references/${editing.id}`
      const method = isNew ? "POST" : "PUT"
      const { isNew: _, id, ...body } = editing as any
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(isNew ? body : editing) })
      if (!res.ok) throw new Error(await res.text())
      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e.message)
    }
    setSaving(false)
  }

  async function del(id: number) {
    if (!confirm("Delete this reference?")) return
    await fetch(`/api/admin/references/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={s.heading as any}>References</h1>
        <button style={s.btnGold} onClick={() => setEditing({ id: 0, ...empty(), isNew: true } as any)}>
          + Add reference
        </button>
      </div>

      <div style={s.card}>
        {refs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#7A7060" }}>No references yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={s.tableHead}>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Role / Company</th>
                <th style={s.th}>Contact</th>
                <th style={s.th}>Active</th>
                <th style={{ ...s.th, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {refs.map(r => (
                <tr key={r.id}>
                  <td style={s.td}>
                    <strong>{r.name}</strong>
                    {r.quote && <div style={{ fontSize: "12px", color: "#7A7060", fontStyle: "italic", marginTop: "2px" }}>&ldquo;{r.quote.slice(0, 60)}{r.quote.length > 60 ? "…" : ""}&rdquo;</div>}
                  </td>
                  <td style={{ ...s.td, color: "#7A7060", fontSize: "13px" }}>
                    {r.role}{r.role && r.company ? " · " : ""}{r.company}
                  </td>
                  <td style={{ ...s.td, fontSize: "12px", color: "#7A7060" }}>
                    {r.email && <div>{r.email}</div>}
                    {r.phone && <div>{r.phone}</div>}
                  </td>
                  <td style={s.td}>{r.active ? "✓" : "—"}</td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <button onClick={() => setEditing(r)} style={{ color: "#B8962E", fontSize: "13px", background: "none", border: "none", cursor: "pointer", marginRight: "12px" }}>Edit</button>
                    <button onClick={() => del(r.id)} style={{ color: "#DC2626", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#F8F5EE", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1E3A1E", marginBottom: "20px" }}>
              {(editing as any).isNew ? "Add reference" : "Edit reference"}
            </h2>

            {error && <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}

            <FormRow><label style={s.label}>Name *</label><input style={s.input} value={editing.name} onChange={e => set("name", e.target.value)} /></FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <FormRow><label style={s.label}>Role</label><input style={s.input} value={editing.role} onChange={e => set("role", e.target.value)} /></FormRow>
              <FormRow><label style={s.label}>Company</label><input style={s.input} value={editing.company} onChange={e => set("company", e.target.value)} /></FormRow>
              <FormRow><label style={s.label}>Email</label><input style={s.input} value={editing.email} onChange={e => set("email", e.target.value)} /></FormRow>
              <FormRow><label style={s.label}>Phone</label><input style={s.input} value={editing.phone} onChange={e => set("phone", e.target.value)} /></FormRow>
            </div>
            <FormRow><label style={s.label}>Website</label><input style={s.input} value={editing.website} onChange={e => set("website", e.target.value)} placeholder="https://…" /></FormRow>
            <FormRow><label style={s.label}>Endorsement / Quote</label><textarea style={{ ...s.textarea, minHeight: "80px" }} value={editing.quote} onChange={e => set("quote", e.target.value)} /></FormRow>
            <FormRow>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" checked={editing.active} onChange={e => set("active", e.target.checked)} style={{ width: "16px", height: "16px" }} />
                Active (show on credentials page)
              </label>
            </FormRow>
            <FormRow><label style={s.label}>Display order</label><input type="number" style={{ ...s.input, width: "80px" }} value={editing.displayOrder} onChange={e => set("displayOrder", Number(e.target.value))} /></FormRow>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => { setEditing(null); setError("") }} style={s.btnGhost}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
