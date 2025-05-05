"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Activity,
  ClipboardList,
  Calendar,
  BarChart,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  School,
  Upload,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Guides",
    href: "/admin/guides",
    icon: UserCircle,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Classes",
    href: "/admin/classess",
    icon: School,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: ClipboardList,
  },
  {
    title: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Attendance Graph",
    href: "/admin/attendance-graph",
    icon: BarChart,
  },
  {
    title: "Awards",
    href: "/admin/awards",
    icon: Award,
  },
  {
    title: "Import Data",
    href: "/admin/import-data",
    icon: Upload,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: User,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch profile")
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "",
        bio: data.bio || "",
      })
      setError(null)
    } catch (err: any) {
      setError(err.message)
      setProfileData({ name: "", email: "", role: "", bio: "" }) // Reset to empty on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r w-64 fixed inset-y-0 z-40 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold">Attendly Admin</span>
            </Link>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxQp68r5uRwzNilYwOcvbJAnPvmtrP3ZvXYA&s" alt="Admin" />
                <AvatarFallback>
                  {profileData.name && !loading ? profileData.name.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <>
                    <p className="font-medium">{profileData.name || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground">{profileData.email || "No email"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profileData.role || "Unknown"}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>{formatDate(currentTime)}</p>
              <p>{formatTime(currentTime)}</p>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-600">Error: {error}</p>
            )}
          </div>

          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-gray-500")} />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}