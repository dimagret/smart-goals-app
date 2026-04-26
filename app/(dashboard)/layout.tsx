import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/session"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { Providers } from "@/components/providers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <Providers>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  )
}