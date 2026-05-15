import type { CSSProperties } from "react"

export const s: Record<string, CSSProperties> = {
  page: { maxWidth: "800px" },
  heading: { fontFamily: "'DM Serif Display', serif", fontSize: "26px", color: "#1a1a1a", marginBottom: "24px", fontWeight: 300 },
  card: { background: "#fff", border: "1px solid #e8e3dc", borderRadius: "10px", overflow: "hidden" },
  tableHead: { background: "#f4f1ed", borderBottom: "1px solid #e8e3dc" },
  th: { padding: "10px 16px", fontSize: "11px", fontWeight: 700, color: "rgba(26,26,26,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "left" },
  td: { padding: "13px 16px", fontSize: "14px", color: "#1a1a1a", borderBottom: "1px solid #f5f1ec" },
  label: { display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,26,26,0.45)", marginBottom: "7px" },
  input: { width: "100%", padding: "10px 13px", border: "1px solid #e8e3dc", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box", fontFamily: "'Nunito', sans-serif", outline: "none", color: "#1a1a1a" },
  textarea: { width: "100%", padding: "10px 13px", border: "1px solid #e8e3dc", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box", fontFamily: "'Nunito', sans-serif", resize: "vertical", minHeight: "100px", outline: "none", color: "#1a1a1a" },
  select: { width: "100%", padding: "10px 13px", border: "1px solid #e8e3dc", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box", color: "#1a1a1a" },
  row: { marginBottom: "20px" },
  btnPrimary: { padding: "10px 22px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer" },
  btnGold: { padding: "10px 22px", background: "#b03060", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
  btnDanger: { padding: "8px 14px", background: "none", color: "#DC2626", border: "1px solid #DC2626", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  btnGhost: { padding: "8px 14px", background: "none", color: "rgba(26,26,26,0.5)", border: "1px solid #ece8df", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
}
