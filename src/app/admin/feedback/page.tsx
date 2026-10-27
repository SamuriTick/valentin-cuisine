"use client"

import { useState, useEffect } from "react"
import { ALL_QUESTIONS, OVERALL_OPTIONS, gridKey, type Answers } from "@/lib/feedbackQuestions"
import { orderSummary } from "@/lib/customerEmails"

type Response = { id: number; orderId: number | null; name: string; answers: Answers; items: string | null; updatedAt: string }

const EMOJI = ["😞", "😐", "🙂", "😋", "🤩"]
const RED = "#c2412d", GREEN = "#15803d", MUTED = "rgba(26,26,26,0.5)"

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6, padding: "14px 18px", minWidth: 140 }
const cardLabel: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: MUTED, margin: "0 0 6px" }
const cardValue: React.CSSProperties = { fontFamily: "Georgia, serif", fontSize: 26, color: "#1a1a1a", margin: 0, lineHeight: 1.1 }
const box: React.CSSProperties = { background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6, padding: "16px 18px" }
const h2: React.CSSProperties = { fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 22, margin: "36px 0 12px" }

// One bar per option: how many people picked it
function Bars({ label, options, counts }: { label: string; options: string[]; counts: Record<string, number> }) {
  const total = options.reduce((n, o) => n + (counts[o] ?? 0), 0)
  return (
    <div style={box}>
      <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 10px" }}>{label} <span style={{ fontWeight: 400, color: MUTED }}>({total})</span></p>
      {options.map(o => {
        const n = counts[o] ?? 0, pct = total ? (n / total) * 100 : 0
        return (
          <div key={o} style={{ display: "grid", gridTemplateColumns: "110px 1fr 34px", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o}</span>
            <div style={{ height: 10, background: "#f4efe8", borderRadius: 99 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: RED, borderRadius: 99 }} />
            </div>
            <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED }}>{n}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function FeedbackAdminPage() {
  const [rows, setRows] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/feedback").then(async r => { if (r.ok) setRows(await r.json()); setLoading(false) })
  }, [])

  async function remove(id: number) {
    if (!confirm("Delete this feedback? This can't be undone.")) return
    setRows(rs => rs.filter(r => r.id !== id))
    await fetch(`/api/admin/feedback?id=${id}`, { method: "DELETE" })
  }

  const count = (key: string) => rows.reduce<Record<string, number>>((c, r) => {
    const v = r.answers[key]
    for (const x of Array.isArray(v) ? v : v ? [v] : []) c[x] = (c[x] ?? 0) + 1
    return c
  }, {})
  const scores = rows.map(r => OVERALL_OPTIONS.indexOf(r.answers.overall as string) + 1).filter(n => n > 0)
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  const share = (key: string, value: string) => {
    const c = count(key), total = Object.values(c).reduce((a, b) => a + b, 0)
    return total ? `${Math.round(((c[value] ?? 0) / total) * 100)}%` : "–"
  }
  const comments = rows.flatMap(r => (["change", "ideas", "review"] as const)
    .filter(k => typeof r.answers[k] === "string")
    .map(k => ({ id: `${r.id}${k}`, name: r.name, kind: k, text: r.answers[k] as string, share: r.answers.share === "yes" })))

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 28, margin: "0 0 6px" }}>Feedback</h1>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 24px" }}>
        Answers from the kimchi feedback form. Send people their link from the Orders page (&quot;Copy feedback link&quot;, or Email → &quot;How was your kimchi?&quot;).
        Anyone can also fill it in at <a href="/feedback" target="_blank" style={{ color: RED }}>/feedback</a>.
      </p>

      {loading ? <p style={{ fontSize: 13, color: MUTED }}>Loading…</p> : rows.length === 0 ? (
        <p style={{ fontSize: 13, color: MUTED }}>No feedback yet.</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={card}><p style={cardLabel}>Responses</p><p style={cardValue}>{rows.length}</p></div>
            <div style={{ ...card, borderColor: RED }}>
              <p style={cardLabel}>Overall</p>
              <p style={{ ...cardValue, color: RED }}>{EMOJI[Math.round(avg) - 1] ?? ""} {avg.toFixed(1)}<span style={{ fontSize: 15, color: MUTED }}> / 5</span></p>
            </div>
            <div style={card}><p style={cardLabel}>Would order again</p><p style={{ ...cardValue, color: GREEN }}>{share("again", "Yes")}</p></div>
            <div style={card}><p style={cardLabel}>Would recommend</p><p style={{ ...cardValue, color: GREEN }}>{share("recommend", "Yes")}</p></div>
          </div>

          <h2 style={h2}>Answers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {ALL_QUESTIONS.flatMap(q =>
              q.kind === "grid" ? q.rows.map(row => <Bars key={gridKey(q, row)} label={`Taste: ${row}`} options={q.options} counts={count(gridKey(q, row))} />)
              : q.kind === "text" ? []
              : [<Bars key={q.key} label={q.label} options={q.options} counts={count(q.key)} />])}
          </div>

          {comments.length > 0 && (
            <>
              <h2 style={h2}>Comments</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {comments.map(c => (
                  <div key={c.id} style={box}>
                    <p style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: MUTED, margin: "0 0 6px" }}>
                      {c.name} · {c.kind === "change" ? "Would change" : c.kind === "ideas" ? "Would like you to make" : "Review"}
                      {c.kind === "review" && <span style={{ color: c.share ? GREEN : MUTED }}> · {c.share ? "OK to share" : "private"}</span>}
                    </p>
                    <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>“{c.text}”</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 style={h2}>Everyone</h2>
          <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #e8e3dc", borderRadius: 6 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Name", "Order", "Overall", "Price", "Again", "Date", ""].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: MUTED, borderBottom: "1px solid #e8e3dc", background: "#faf8f5", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => {
                  const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid #f0ece6", whiteSpace: "nowrap" }
                  const score = OVERALL_OPTIONS.indexOf(r.answers.overall as string)
                  return (
                    <tr key={r.id}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                      <td style={td}>{r.items ? orderSummary(r.items) : <span style={{ color: MUTED }}>—</span>}</td>
                      <td style={td}>{EMOJI[score]} {r.answers.overall}</td>
                      <td style={td}>{r.answers.price ?? ""}</td>
                      <td style={td}>{r.answers.again ?? ""}</td>
                      <td style={td}>{new Date(r.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                      <td style={td}><button onClick={() => remove(r.id)} style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Delete</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
