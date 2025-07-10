"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // 确保组件在客户端挂载后才渲染，避免水合错误
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    // 如果当前是系统主题或者未设置，根据当前解析的主题来切换
    if (theme === "system" || !theme) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    } else {
      // 在亮色和暗色之间切换
      setTheme(theme === "dark" ? "light" : "dark")
    }
  }

  // 在挂载前显示占位符，避免布局偏移
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-blue-100 hover:text-blue-200 hover:bg-blue-800/50">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // 确定当前显示的主题（用于图标显示）
  const currentTheme = theme === "system" ? resolvedTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} className="text-blue-100 hover:text-blue-200 hover:bg-blue-800/50 transition-all duration-300">
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 