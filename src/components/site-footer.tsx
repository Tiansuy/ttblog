"use client"

import Link from "next/link"
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export function SiteFooter() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // 防止hydration错误
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取文本，防止hydration错误
  const getText = (key: string, fallback: string) => {
    return mounted ? t(key) : fallback
  }

  // 获取语言，防止hydration错误
  const getLanguage = () => {
    return mounted ? i18n.language : 'en'
  }

  return (
    <footer>
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            {getLanguage() === 'zh' ? (
              <>
                {getText('footer.builtBy', '由')}{" "}
                <Link
                  href="https://github.com/tiansuy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Tiansuy(天随)
                </Link>
                {" "}{getText('footer.sourceCodeAvailable', '构建，源代码可在')}{" "}
                <Link
                  href="https://github.com/tiansuy/ttblog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  {getText('footer.github', 'GitHub')}
                </Link>
                {" "}上查看。
              </>
            ) : (
              <>
                {getText('footer.builtBy', 'Built by')}{" "}
                <Link
                  href="https://github.com/tiansuy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Tiansuy(天随)
                </Link>
                . {getText('footer.sourceCodeAvailable', 'Source code available on')}{" "}
                <Link
                  href="https://github.com/tiansuy/ttblog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  {getText('footer.github', 'GitHub')}
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
} 