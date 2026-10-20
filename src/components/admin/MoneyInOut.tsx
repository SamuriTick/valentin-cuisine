"use client"

import { useSavedSheet, statusText } from "./useSavedSheet"
import { th, td, num, foot, cellInput, editCell, box, h2, note, addBtn, removeBtn, parseNum as n, money } from "./sheetStyles"

// Money in / money out ledger on the Info page. Paid orders count as money in
// automatically; everything else (shopping, jars, other income) is typed in.

export type PaidOrder = { id: number; name: string; total: number; date: string }
type Entry = { id: string; date: string; what: string; in: string; out: string }
type Ledger = { entries: Entry[] }

const DEFAULT_LEDGER: Ledger = { entries: [] }
const today = () => new Date().toISOString().slice(0, 10)
const fmtDate = (d: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "")

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6, padding: "14px 18px", minWidth: 130 }
const cardLabel: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(26,26,26,0.5)", margin: "0 0 6px" }
const cardValue: React.CSSProperties = { fontFamily: "Georgia, serif", fontSize: 26, color: "#1a1a1a", margin: 0, lineHeight: 1.1 }

type Row =
  | { kind: "order"; key: string; date: string; what: string; in: number; out: number }
  | { kind: "entry"; key: string; date: string; entry: Entry; in: number; out: number }

export default function MoneyInOut({ paidOrders, unpaidTotal }: { paidOrders: PaidOrder[]; unpaidTotal: number }) {
  const { value: ledger, update, loaded, status } = useSavedSheet("info.money", DEFAULT_LEDGER)

  const setEntry = (id: string, field: keyof Entry, value: string) =>
    update({ entries: ledger.entries.map(e => (e.id === id ? { ...e, [field]: value } : e)) })

  const rows: Row[] = [
    ...paidOrders.map(o => ({ kind: "order" as const, key: `o${o.id}`, date: o.date.slice(0, 10), what: `Order: ${o.name}`, in: o.total, out: 0 })),
    ...ledger.entries.map(e => ({ kind: "entry" as const, key: e.id, date: e.date, entry: e, in: n(e.in), out: n(e.out) })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  let running = 0
  const withBalance = rows.map(r => ({ ...r, balance: (running += r.in - r.out) }))
  const totalIn = rows.reduce((s, r) => s + r.in, 0)
  const totalOut = rows.reduce((s, r) => s + r.out, 0)
  const balance = totalIn - totalOut

  if (!loaded) return null

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h2 style={h2}>Money in, money out</h2>
        <span style={{ fontSize: 12, color: status === "error" ? "#b91c1c" : "rgba(26,26,26,0.45)" }}>{statusText(status)}</span>
      </div>
      <p style={note}>
        Paid orders are added as money in automatically, so don&apos;t type them again. Add everything else yourself: shopping, jars and labels, or any other money coming in. Changes save automatically.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={card}>
          <p style={cardLabel}>Money in</p>
          <p style={{ ...cardValue, color: "#15803d" }}>{money(totalIn)}</p>
        </div>
        <div style={card}>
          <p style={cardLabel}>Money out</p>
          <p style={{ ...cardValue, color: "#b91c1c" }}>{money(totalOut)}</p>
        </div>
        <div style={{ ...card, borderColor: "#3d7a6b" }}>
          <p style={cardLabel}>Balance</p>
          <p style={{ ...cardValue, color: balance >= 0 ? "#3d7a6b" : "#b91c1c" }}>{money(balance)}</p>
          {unpaidTotal > 0 && <p style={{ fontSize: 12, color: "rgba(26,26,26,0.5)", margin: "4px 0 0" }}>+ {money(unpaidTotal)} still to be paid</p>}
        </div>
      </div>

      <div style={box}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={th}>Date</th>
              <th style={th}>What</th>
              <th style={{ ...th, textAlign: "right" }}>In (£)</th>
              <th style={{ ...th, textAlign: "right" }}>Out (£)</th>
              <th style={{ ...th, textAlign: "right" }}>Balance</th>
              <th style={{ ...th, width: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {withBalance.length === 0 && (
              <tr><td colSpan={6} style={{ ...td, color: "rgba(26,26,26,0.5)" }}>Nothing yet. Add your first line below.</td></tr>
            )}
            {withBalance.map(r => r.kind === "order" ? (
              <tr key={r.key}>
                <td style={td}>{fmtDate(r.date)}</td>
                <td style={{ ...td, color: "rgba(26,26,26,0.65)" }}>{r.what}</td>
                <td style={{ ...num, color: "#15803d" }}>{money(r.in)}</td>
                <td style={num}></td>
                <td style={num}>{money(r.balance)}</td>
                <td style={td}></td>
              </tr>
            ) : (
              <tr key={r.key}>
                <td style={editCell}><input type="date" style={{ ...cellInput, minWidth: 130 }} value={r.entry.date} onChange={e => setEntry(r.entry.id, "date", e.target.value)} /></td>
                <td style={editCell}><input style={{ ...cellInput, minWidth: 180 }} value={r.entry.what} placeholder="e.g. Cabbages from market" onChange={e => setEntry(r.entry.id, "what", e.target.value)} /></td>
                <td style={editCell}><input style={{ ...cellInput, textAlign: "right", color: "#15803d" }} inputMode="decimal" placeholder="" value={r.entry.in} onChange={e => setEntry(r.entry.id, "in", e.target.value)} /></td>
                <td style={editCell}><input style={{ ...cellInput, textAlign: "right", color: "#b91c1c" }} inputMode="decimal" placeholder="" value={r.entry.out} onChange={e => setEntry(r.entry.id, "out", e.target.value)} /></td>
                <td style={num}>{money(r.balance)}</td>
                <td style={{ ...td, padding: "0 6px" }}>
                  <button onClick={() => update({ entries: ledger.entries.filter(e => e.id !== r.entry.id) })} title="Remove line" style={removeBtn}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ ...foot, textAlign: "left" }}>Total</td>
              <td style={foot}></td>
              <td style={{ ...foot, color: "#15803d" }}>{money(totalIn)}</td>
              <td style={{ ...foot, color: "#b91c1c" }}>{money(totalOut)}</td>
              <td style={{ ...foot, color: balance >= 0 ? "#3d7a6b" : "#b91c1c" }}>{money(balance)}</td>
              <td style={foot}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button style={addBtn}
        onClick={() => update({ entries: [...ledger.entries, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: today(), what: "", in: "", out: "" }] })}>
        + Add line
      </button>
    </div>
  )
}
