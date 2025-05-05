import type { ReactNode } from "react"
import GuideSidebar from "@/components/guide/sidebar"

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <GuideSidebar />
      <main className="flex-1 overflow-auto w-full">{children}</main>
    </div>
  )
}
