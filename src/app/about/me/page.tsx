"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Github, Mail, Twitter, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function AboutMePage() {
  const { t } = useTranslation()

  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {t('about.me.title')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t('about.me.subtitle')}
          </p>
        </div>
      </section>

      <section className="container space-y-8 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[64rem]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.me.intro.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.me.intro.content')}
              </p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.me.skills.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-3 text-primary">{t('about.me.skills.frontend')}</h4>
                  <div className="space-y-2">
                    {(t('about.me.skills.frontendList', { returnObjects: true }) as string[]).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-primary">{t('about.me.skills.backend')}</h4>
                  <div className="space-y-2">
                    {(t('about.me.skills.backendList', { returnObjects: true }) as string[]).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-primary">{t('about.me.skills.tools')}</h4>
                  <div className="space-y-2">
                    {(t('about.me.skills.toolsList', { returnObjects: true }) as string[]).map((tool: string, index: number) => (
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
              <CardTitle className="text-2xl">{t('about.me.interests.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {(t('about.me.interests.list', { returnObjects: true }) as string[]).map((interest: string, index: number) => (
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
              <CardTitle className="text-2xl">{t('about.me.contact.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {t('about.me.contact.content')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t('about.me.contact.github')}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="mailto:your.email@example.com">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('about.me.contact.email')}
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" />
                    {t('about.me.contact.twitter')}
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