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
      background: "#faf8f5", fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 20px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 32, fontWeight: 400, fontStyle: "italic",
            color: "#b03060", letterSpacing: 0.5, marginBottom: 6,
          }}>
            Valentin&apos;s Cuisine
          </div>
          <div style={{
            fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(26,26,26,0.4)",
          }}>
            Admin
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{
          background: "#fff", borderRadius: 12, padding: 36,
          border: "1px solid #ece8df",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C",
              padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(26,26,26,0.5)", marginBottom: 8,
            }}>
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              style={{
                width: "100%", padding: "11px 14px", border: "1px solid #ece8df",
                borderRadius: 6, fontSize: 14, background: "#faf8f5",
                boxSizing: "border-box", outline: "none", color: "#1a1a1a",
              }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(26,26,26,0.5)", marginBottom: 8,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "11px 14px", border: "1px solid #ece8df",
                borderRadius: 6, fontSize: 14, background: "#faf8f5",
                boxSizing: "border-box", outline: "none", color: "#1a1a1a",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px", background: loading ? "#1a1a1a80" : "#1a1a1a",
              color: "#fff", border: "none", borderRadius: 6, fontSize: 11,
              fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(26,26,26,0.3)", marginTop: 24, letterSpacing: "0.08em" }}>
          Valentin&apos;s Cuisine · Admin
        </p>
      </div>
    </div>
  )
}
