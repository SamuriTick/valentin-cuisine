"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.ok) {
      router.push("/admin")
    } else {
      setError("Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#1E3A1E", fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "380px", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: "36px", color: "#B8962E" }}>
            Valentin&apos;s Cuisine
          </div>
          <div style={{ fontSize: "12px", color: "#7A7060", marginTop: "4px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Admin
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: "#F8F5EE", borderRadius: "12px", padding: "32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}>
          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C",
              padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3A3A3A", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              style={{
                width: "100%", padding: "10px 12px", border: "1px solid #DDD8CC",
                borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3A3A3A", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 12px", border: "1px solid #DDD8CC",
                borderRadius: "6px", fontSize: "14px", background: "#fff", boxSizing: "border-box",
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "11px", background: loading ? "#7A7060" : "#1E3A1E",
            color: "#F8F5EE", border: "none", borderRadius: "6px", fontSize: "14px",
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.04em",
          }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
