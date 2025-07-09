"use client"

import * as React from "react"
import { Globe, Check } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "中文", nativeName: "中文" },
]

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  // 确保组件在客户端挂载后才渲染，避免水合错误
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = async (locale: string) => {
    try {
      await i18n.changeLanguage(locale)
      // 保存到 localStorage
      localStorage.setItem('language', locale)
      console.log(`Language changed to ${locale}`)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  // 在挂载前显示占位符，避免布局偏移
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Change language</span>
      </Button>
    )
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1] // 默认中文

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('common.changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-2"
          >
            <span className="flex-1">{lang.nativeName}</span>
            {i18n.language === lang.code && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 