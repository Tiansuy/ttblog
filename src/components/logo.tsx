import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-sm font-bold">T</span>
      </div>
      <span className="font-bold text-xl">TTBlog</span>
    </Link>
  )
} 