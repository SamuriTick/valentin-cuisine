"use client"

import { useState, useEffect, useRef } from "react"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

// Loads a JSON value from site_content (lang "admin", which the public pages never
// read) and autosaves it shortly after each change.
export function useSavedSheet<T extends object>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(defaults)
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<SaveStatus>("idle")
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    fetch("/api/admin/content").then(r => (r.ok ? r.json() : [])).then((rows: { key: string; lang: string; value: string }[]) => {
      const row = rows.find(r => r.key === key && r.lang === "admin")
      if (row) {
        try { setValue(v => ({ ...v, ...JSON.parse(row.value) })) } catch { /* bad JSON: keep defaults */ }
      }
      setLoaded(true)
    })
  }, [key])

  function update(next: T) {
    setValue(next)
    setStatus("saving")
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ key, lang: "admin", value: JSON.stringify(next) }]),
      }).catch(() => null)
      setStatus(res?.ok ? "saved" : "error")
    }, 700)
  }

  return { value, update, loaded, status }
}

export const statusText = (s: SaveStatus) =>
  s === "saving" ? "Saving…" : s === "saved" ? "Saved" : s === "error" ? "Couldn't save, try again" : ""
