"use client"

import React from "react"

export const s = {
  page: { maxWidth: "800px" } as React.CSSProperties,
  heading: { fontFamily: "'DM Serif Display', serif", fontSize: "26px", color: "#1E3A1E", marginBottom: "24px" } as React.CSSProperties,
  card: { background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px", overflow: "hidden" } as React.CSSProperties,
  tableHead: { background: "#F8F5EE", borderBottom: "1px solid #DDD8CC" } as React.CSSProperties,
  th: { padding: "10px 16px", fontSize: "11px", fontWeight: 700, color: "#7A7060", textTransform: "uppercase" as const, letterSpacing: "0.08em", textAlign: "left" as const },
  td: { padding: "12px 16px", fontSize: "14px", color: "#181818", borderBottom: "1px solid #F0EBE0" } as React.CSSProperties,
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#3A3A3A", marginBottom: "6px" } as React.CSSProperties,
  input: { width: "100%", padding: "9px 12px", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box" as const, fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box" as const, fontFamily: "'Nunito', sans-serif", resize: "vertical" as const, minHeight: "100px" } as React.CSSProperties,
  select: { width: "100%", padding: "9px 12px", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box" as const } as React.CSSProperties,
  row: { marginBottom: "18px" } as React.CSSProperties,
  btnPrimary: { padding: "9px 20px", background: "#1E3A1E", color: "#F8F5EE", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  btnGold: { padding: "9px 20px", background: "#B8962E", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  btnDanger: { padding: "7px 14px", background: "none", color: "#DC2626", border: "1px solid #DC2626", borderRadius: "6px", fontSize: "13px", cursor: "pointer" } as React.CSSProperties,
  btnGhost: { padding: "7px 14px", background: "none", color: "#7A7060", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "13px", cursor: "pointer" } as React.CSSProperties,
}

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
