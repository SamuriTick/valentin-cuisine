"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Posts", href: "/admin/posts" },
  { name: "Products", href: "/admin/products" },
  { name: "Pages", href: "/admin/pages" },
  { name: "References", href: "/admin/references" },
  { name: "Media", href: "/admin/media" },
  { name: "Site Content", href: "/admin/content" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const Sidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1E3A1E" }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #2D5A2D" }}>
        <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: "22px", color: "#B8962E", lineHeight: 1 }}>
          Valentin&apos;s Cuisine
        </div>
        <div style={{ fontSize: "11px", color: "#7A7060", marginTop: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Admin Panel
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link key={item.name} href={item.href} style={{
              display: "block", padding: "9px 12px", marginBottom: "2px", borderRadius: "6px",
              fontSize: "14px", fontWeight: active ? 600 : 400, textDecoration: "none",
              background: active ? "#2D5A2D" : "transparent",
              color: active ? "#F8F5EE" : "#B0A99A",
            }}>
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid #2D5A2D" }}>
        <div style={{ fontSize: "13px", color: "#B0A99A", marginBottom: "6px" }}>
          {session?.user?.email}
        </div>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} style={{
          fontSize: "12px", color: "#7A7060", background: "none", border: "none", cursor: "pointer", padding: 0,
        }}>
          Sign out
        </button>
        <br />
        <Link href="/" target="_blank" style={{ fontSize: "12px", color: "#7A7060", textDecoration: "none" }}>
          View site ↗
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Nunito', sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar" style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "relative", width: "220px", zIndex: 60 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F8F5EE" }}>
        {/* Mobile topbar */}
        <div className="admin-topbar" style={{ display: "none", alignItems: "center", padding: "12px 16px", background: "#1E3A1E", gap: "12px" }}>
          <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#F8F5EE", fontSize: "20px" }}>
            ☰
          </button>
          <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "20px", color: "#B8962E" }}>Valentin&apos;s Cuisine</span>
        </div>
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar { display: flex !important; }
          main { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
