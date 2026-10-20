// Shared table styles for the spreadsheet-style sheets on the admin Info page
import type { CSSProperties } from "react"

export const th: CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(26,26,26,0.5)", borderBottom: "1px solid #e8e3dc", borderRight: "1px solid #f0ece6", whiteSpace: "nowrap", background: "#faf8f5" }
export const td: CSSProperties = { padding: "10px 12px", fontSize: 13, color: "#1a1a1a", borderBottom: "1px solid #f0ece6", borderRight: "1px solid #f0ece6", whiteSpace: "nowrap" }
export const num: CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }
export const foot: CSSProperties = { ...num, fontWeight: 700, background: "#faf8f5", borderTop: "2px solid #e8e3dc" }
export const cellInput: CSSProperties = { width: "100%", border: "none", background: "transparent", font: "inherit", fontSize: 13, color: "#1a1a1a", padding: "10px 12px", outline: "none", boxSizing: "border-box" }
export const editCell: CSSProperties = { ...td, padding: 0, background: "#fffdf8" }
export const box: CSSProperties = { overflowX: "auto", background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6 }
export const h2: CSSProperties = { fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 22, margin: "0 0 6px" }
export const note: CSSProperties = { fontSize: 13, color: "rgba(26,26,26,0.5)", margin: "0 0 16px" }
export const addBtn: CSSProperties = { marginTop: 10, padding: "8px 14px", fontSize: 13, borderRadius: 4, cursor: "pointer", border: "1px solid #e8e3dc", background: "#fff", color: "#1a1a1a" }
export const removeBtn: CSSProperties = { border: "none", background: "none", cursor: "pointer", color: "rgba(26,26,26,0.35)", fontSize: 16, padding: 4 }

export const parseNum = (s: string | undefined) => { const v = parseFloat(s ?? ""); return isFinite(v) ? v : 0 }
export const money = (v: number) => `${v < 0 ? "−" : ""}£${Math.abs(v).toFixed(2)}`
