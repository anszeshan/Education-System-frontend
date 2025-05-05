import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto md:ml-64 ml-0 transition-all duration-300">{children}</main>
    </div>
  )
}
