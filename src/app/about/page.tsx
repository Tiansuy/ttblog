"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

export default function AboutSitePage() {
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

  // 获取数组，防止hydration错误
  const getArray = (key: string, fallback: string[]) => {
    if (!mounted) return fallback
    try {
      const result = t(key, { returnObjects: true })
      return Array.isArray(result) ? result : fallback
    } catch {
      return fallback
    }
  }
  
  const technologies = [
    "Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", 
    "React 18", "Server Components", "i18next", "Prisma"
  ]

  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {getText('about.site.title', '关于空间站')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {getText('about.site.subtitle', '了解天随空间站的技术架构与设计理念')}
          </p>
        </div>
      </section>

      <section className="container space-y-8 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[64rem]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.site.projectIntro.title', '项目介绍')}</CardTitle>
              <CardDescription>
                {getText('about.site.projectIntro.subtitle', '一个现代化的技术博客平台')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {getText('about.site.projectIntro.description1', '天随空间站是一个基于现代Web技术栈构建的个人技术博客平台。')}
              </p>
              <p className="text-muted-foreground">
                {getText('about.site.projectIntro.description2', '它支持多语言、响应式设计，并提供完整的内容管理和用户交互功能。')}
              </p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.site.techStack.title', '技术栈')}</CardTitle>
              <CardDescription>
                {getText('about.site.techStack.subtitle', '采用现代化的前后端技术')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">{getText('about.site.techStack.frontend', '前端技术')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getArray('about.site.techStack.frontendList', [
                      'Next.js 15 App Router',
                      'TypeScript 严格模式',
                      'Tailwind CSS 样式',
                      'React 18 新特性'
                    ]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{getText('about.site.techStack.backend', '后端技术')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getArray('about.site.techStack.backendList', [
                      'Supabase 数据库',
                      'PostgreSQL 存储',
                      'Auth 身份认证',
                      'Real-time 实时更新'
                    ]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.site.features.title', '核心功能')}</CardTitle>
              <CardDescription>
                {getText('about.site.features.subtitle', '完整的博客平台功能')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">{getText('about.site.features.contentManagement', '内容管理')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getArray('about.site.features.contentList', [
                      'Markdown 文章编写',
                      '标签分类管理',
                      '文章搜索功能',
                      '评论系统支持'
                    ]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{getText('about.site.features.userExperience', '用户体验')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getArray('about.site.features.experienceList', [
                      '响应式设计',
                      '暗黑模式切换',
                      '多语言支持',
                      '快速加载体验'
                    ]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 