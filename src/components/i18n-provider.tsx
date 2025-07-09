"use client"

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // 在客户端初始化时，确保从 localStorage 中读取语言设置
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
} 