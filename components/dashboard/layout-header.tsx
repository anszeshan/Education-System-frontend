import { BookOpen } from 'lucide-react'
import Link from "next/link"

interface LayoutHeaderProps {
  title: string
  description: string
}

export function LayoutHeader({ title, description }: LayoutHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Link href="/" className="hidden md:flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-emerald-600" />
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Attendly
        </span>
      </Link>
    </div>
  )
}
