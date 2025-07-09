"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"

export default function AboutSitePage() {
  const { t } = useTranslation()
  
  const technologies = [
    "Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", 
    "React 18", "Server Components", "i18next", "Prisma"
  ]

  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {t('about.site.title')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t('about.site.subtitle')}
          </p>
        </div>
      </section>

      <section className="container space-y-8 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[64rem]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.site.projectIntro.title')}</CardTitle>
              <CardDescription>
                {t('about.site.projectIntro.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('about.site.projectIntro.description1')}
              </p>
              <p className="text-muted-foreground">
                {t('about.site.projectIntro.description2')}
              </p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.site.techStack.title')}</CardTitle>
              <CardDescription>
                {t('about.site.techStack.subtitle')}
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
                  <h4 className="font-semibold mb-2">{t('about.site.techStack.frontend')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(t('about.site.techStack.frontendList', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('about.site.techStack.backend')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(t('about.site.techStack.backendList', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
              <CardTitle className="text-2xl">{t('about.site.features.title')}</CardTitle>
              <CardDescription>
                {t('about.site.features.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">{t('about.site.features.contentManagement')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(t('about.site.features.contentList', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('about.site.features.userExperience')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(t('about.site.features.experienceList', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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