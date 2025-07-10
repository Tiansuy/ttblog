"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Github, Mail, Twitter, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

export default function AboutMePage() {
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

  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {getText('about.me.title', '关于我')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {getText('about.me.subtitle', '了解空间站指挥官的故事')}
          </p>
        </div>
      </section>

      <section className="container space-y-8 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[64rem]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.me.intro.title', '个人介绍')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {getText('about.me.intro.content', '我是一名热爱技术的开发者，致力于探索和分享新技术。')}
              </p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.me.skills.title', '技能专长')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-3 text-primary">{getText('about.me.skills.frontend', '前端技术')}</h4>
                  <div className="space-y-2">
                    {getArray('about.me.skills.frontendList', [
                      'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'
                    ]).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-primary">{getText('about.me.skills.backend', '后端技术')}</h4>
                  <div className="space-y-2">
                    {getArray('about.me.skills.backendList', [
                      'Node.js', 'Python', 'PostgreSQL', 'Supabase', 'API开发'
                    ]).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-primary">{getText('about.me.skills.tools', '开发工具')}</h4>
                  <div className="space-y-2">
                    {getArray('about.me.skills.toolsList', [
                      'Git', 'VS Code', 'Docker', 'Linux', 'Figma'
                    ]).map((tool: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.me.interests.title', '兴趣爱好')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {getArray('about.me.interests.list', [
                  '💻 编程开发', '📚 技术学习', '🎮 游戏', '🎵 音乐', '📖 阅读'
                ]).map((interest: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-2xl">{interest.split(' ')[0]}</span>
                    <span className="text-muted-foreground">{interest.substring(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{getText('about.me.contact.title', '联系方式')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {getText('about.me.contact.content', '如果您对我的项目感兴趣或想要交流技术话题，欢迎通过以下方式联系我。')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {getText('about.me.contact.github', 'GitHub')}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="mailto:your.email@example.com">
                    <Mail className="mr-2 h-4 w-4" />
                    {getText('about.me.contact.email', '邮箱')}
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" />
                    {getText('about.me.contact.twitter', 'Twitter')}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 