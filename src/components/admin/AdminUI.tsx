// Server-safe UI primitives — no "use client" needed (no hooks)
import React from "react"
import { s } from "./adminStyles"

export { s }

export function Badge({ published }: { published: boolean }) {
  return (
    <span style={{
      fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: 600,
      background: published ? "#DCFCE7" : "#F3F4F6",
      color: published ? "#166534" : "#6B7280",
    }}>
      {published ? "Published" : "Draft"}
    </span>
  )
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div style={s.row}>{children}</div>
}

export function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer", marginBottom: "8px" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: "16px", height: "16px" }} />
      {label}
    </label>
  )
}
