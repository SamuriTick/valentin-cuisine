"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { name: "Overview",     href: "/admin" },
  { name: "Products",     href: "/admin/products" },
  { name: "Gallery",      href: "/admin/media" },
  { name: "Site Content", href: "/admin/content" },
  { name: "Email",        href: "/admin/email" },
]

function Sidebar({ session, onClose }: { session: any; onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", borderRight: "1px solid #e8e3dc" }}>

      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #e8e3dc", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontStyle: "italic", fontWeight: 400, color: "#b03060", letterSpacing: 0.3 }}>
            Valentin&apos;s Cuisine
          </div>
          <div style={{ fontSize: 10, color: "rgba(26,26,26,0.35)", marginTop: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Admin
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "rgba(26,26,26,0.4)", lineHeight: 1, padding: "2px 0 0" }}>×</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV.map(({ name, href }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={onClose} style={{
              display: "block", padding: "9px 12px", marginBottom: "2px", borderRadius: "6px",
              fontSize: "13px", fontWeight: active ? 600 : 400, textDecoration: "none",
              background: active ? "#1a1a1a" : "transparent",
              color: active ? "#fff" : "rgba(26,26,26,0.5)",
            }}>
              {name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #e8e3dc" }}>
        <div style={{ fontSize: 12, color: "rgba(26,26,26,0.4)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {session?.user?.email}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} style={{ fontSize: 12, color: "rgba(26,26,26,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Sign out
          </button>
          <Link href="/" target="_blank" style={{ fontSize: 12, color: "rgba(26,26,26,0.4)", textDecoration: "none" }}>
            View site ↗
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Nunito', sans-serif", background: "#f4f1ed" }}>

      {/* Desktop sidebar */}
      <div className="admin-sidebar" style={{ width: "220px", flexShrink: 0 }}>
        <Sidebar session={session} />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "relative", width: "260px", maxWidth: "80vw", zIndex: 201 }}>
            <Sidebar session={session} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Mobile topbar */}
        <div className="admin-topbar" style={{
          display: "none", alignItems: "center", padding: "0 16px",
          background: "#fff", borderBottom: "1px solid #e8e3dc",
          height: 52, flexShrink: 0,
        }}>
          <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 8px 8px 0", marginRight: 8 }}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="1.5" rx="1" fill="#1a1a1a"/>
              <rect y="6.25" width="20" height="1.5" rx="1" fill="#1a1a1a"/>
              <rect y="12.5" width="20" height="1.5" rx="1" fill="#1a1a1a"/>
            </svg>
          </button>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: "italic", color: "#b03060" }}>
            Valentin&apos;s Cuisine
          </span>
        </div>

        <main className="admin-main" style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar { display: flex !important; }
          .admin-main { padding: 20px 16px !important; }

          /* Site Content fixed bar: full width on mobile (no sidebar) */
          .admin-content-bar { left: 0 !important; }

          /* Site Content page: undo the desktop negative margin bleed */
          .admin-content-page { margin: -20px -16px !important; }

          /* Tables: horizontal scroll on mobile */
          .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

          /* Stack 2-col grids on mobile */
          .admin-2col { grid-template-columns: 1fr !important; }

          /* Tighten card padding on mobile */
          .admin-card-tight { padding: 16px !important; }
        }

        @media (max-width: 480px) {
          .admin-main { padding: 16px 12px !important; }
        }
      `}</style>
    </div>
  )
}
