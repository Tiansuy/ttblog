"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // 防止hydration错误
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取文本，防止hydration错误
  const getText = (key: string, fallback: string) => {
    return mounted ? t(key) : fallback
  }

  return (
    <Link href="/" className={cn("flex items-center space-x-3 group", className)}>
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-400/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-blue-600/20 animate-pulse"></div>
        <span className="relative text-xl font-black text-white drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">T</span>
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 shadow-sm animate-bounce"></div>
        <div className="absolute top-1 right-2 h-1 w-1 rounded-full bg-blue-200 animate-pulse"></div>
        <div className="absolute -inset-1 rounded-full border-2 border-blue-300/20 animate-ping"></div>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-xl bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-200 bg-clip-text text-transparent group-hover:from-blue-50 group-hover:via-blue-100 group-hover:to-indigo-100 transition-all duration-500 tracking-wider transform group-hover:scale-105 group-hover:-skew-x-1 font-orbitron" 
              style={{ 
                textShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                filter: "drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))"
              }}>
          {getText('logo.title', '天随空间站')}
        </span>
        <span className="text-xs font-semibold text-blue-300/80 group-hover:text-blue-200/90 transition-all duration-300 -mt-0.5 tracking-widest transform group-hover:translate-x-1 font-jetbrains-mono"
              style={{ 
                textShadow: "0 0 10px rgba(147, 197, 253, 0.2)"
              }}>
          {getText('logo.subtitle', '探索技术宇宙')}
        </span>
      </div>
    </Link>
  )
} 