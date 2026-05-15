import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SessionProvider } from "@/components/SessionProvider"
import AdminLayoutClient from "@/components/AdminLayoutClient"

export const metadata = {
  title: "Admin — Valentin's Cuisine",
  robots: { index: false, follow: false },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <SessionProvider session={session}>
      <AdminLayoutClient session={session}>{children}</AdminLayoutClient>
    </SessionProvider>
  )
}
