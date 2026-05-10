"use client"

import { useState, useEffect } from "react"
import { s } from "@/components/admin/AdminUI"

type Item = { id?: number; key: string; lang: string; value: string }

const LANGS = ["en", "fr", "vi"]
const SECTIONS = [
  { section: "Hero", keys: ["hero.title", "hero.subtitle", "hero.tagline", "hero.cta"] },
  { section: "About", keys: ["about.title", "about.body1", "about.body2"] },
  { section: "Specialties", keys: ["specialties.title", "specialties.subtitle"] },
  { section: "Order", keys: ["order.title", "order.subtitle", "order.cta"] },
  { section: "Footer", keys: ["footer.tagline", "footer.contact"] },
]

export default function ContentPage() {
  const [lang, setLang] = useState("en")
  const [items, setItems] = useState<Item[]>([])
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function load() {
    const res = await fetch("/api/admin/content")
    if (res.ok) setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  function getValue(key: string) {
    const k = `${key}::${lang}`
    if (k in changes) return changes[k]
    return items.find(i => i.key === key && i.lang === lang)?.value ?? ""
  }

  function change(key: string, value: string) {
    setChanges(c => ({ ...c, [`${key}::${lang}`]: value }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    const payload = Object.entries(changes).map(([kl, value]) => {
      const [key, l] = kl.split("::")
      return { key, lang: l, value }
    })
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setChanges({})
      setSaved(true)
      await load()
    }
    setSaving(false)
  }

  const dirty = Object.keys(changes).length > 0

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={s.heading as any}>Site Content</h1>
        <button onClick={save} disabled={saving || !dirty} style={{ ...s.btnPrimary, opacity: !dirty || saving ? 0.5 : 1 }}>
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      <p style={{ fontSize: "13px", color: "#7A7060", marginBottom: "20px" }}>
        Edit all homepage text here. Switch languages using the tabs below.
      </p>

      <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "7px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            background: lang === l ? "#1E3A1E" : "#fff", color: lang === l ? "#F8F5EE" : "#3A3A3A",
            border: "1px solid", borderColor: lang === l ? "#1E3A1E" : "#DDD8CC",
          }}>
            {l === "en" ? "English" : l === "fr" ? "Français" : "Tiếng Việt"}
          </button>
        ))}
      </div>

      {SECTIONS.map(sec => (
        <div key={sec.section} style={{ ...s.card, marginBottom: "20px", padding: "20px" } as any}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1E3A1E", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {sec.section}
          </h2>
          {sec.keys.map(key => (
            <div key={key} style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#7A7060", marginBottom: "4px" }}>
                {key.split(".")[1]}
              </label>
              <textarea
                style={{ ...s.textarea, minHeight: "60px" }}
                value={getValue(key)}
                onChange={e => change(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}

      <div style={{ position: "sticky", bottom: "20px", textAlign: "right" }}>
        {dirty && (
          <button onClick={save} disabled={saving} style={s.btnPrimary}>
            {saving ? "Saving…" : `Save ${Object.keys(changes).length} change${Object.keys(changes).length > 1 ? "s" : ""}`}
          </button>
        )}
      </div>
    </div>
  )
}
