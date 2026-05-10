import type { CSSProperties } from "react"

export const s: Record<string, CSSProperties> = {
  page: { maxWidth: "800px" },
  heading: { fontFamily: "'DM Serif Display', serif", fontSize: "26px", color: "#1E3A1E", marginBottom: "24px" },
  card: { background: "#fff", border: "1px solid #DDD8CC", borderRadius: "10px", overflow: "hidden" },
  tableHead: { background: "#F8F5EE", borderBottom: "1px solid #DDD8CC" },
  th: { padding: "10px 16px", fontSize: "11px", fontWeight: 700, color: "#7A7060", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#181818", borderBottom: "1px solid #F0EBE0" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#3A3A3A", marginBottom: "6px" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box", fontFamily: "'Nunito', sans-serif" },
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box", fontFamily: "'Nunito', sans-serif", resize: "vertical", minHeight: "100px" },
  select: { width: "100%", padding: "9px 12px", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box" },
  row: { marginBottom: "18px" },
  btnPrimary: { padding: "9px 20px", background: "#1E3A1E", color: "#F8F5EE", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" },
  btnGold: { padding: "9px 20px", background: "#B8962E", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" },
  btnDanger: { padding: "7px 14px", background: "none", color: "#DC2626", border: "1px solid #DC2626", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  btnGhost: { padding: "7px 14px", background: "none", color: "#7A7060", border: "1px solid #DDD8CC", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
}
