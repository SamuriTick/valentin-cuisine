"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminLayout from "./AdminLayout"

export default function AdminLayoutClient({ children, session }: { children: React.ReactNode; session: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoginPage && !session) {
      router.push("/admin/login")
    }
  }, [session, isLoginPage, router])

  if (isLoginPage) return <>{children}</>
  if (!session) return null

  return <AdminLayout>{children}</AdminLayout>
}
