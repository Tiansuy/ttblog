"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Code, Lightbulb, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {t('home.title')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t('home.subtitle')}
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/posts">
                <BookOpen className="mr-2 h-4 w-4" />
                {t('home.browsePosts')}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                {t('home.learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {t('home.features.title')}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {t('home.features.subtitle')}
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{t('home.features.modernTech.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.features.modernTech.description')}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{t('home.features.richContent.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.features.richContent.description')}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{t('home.features.studyNotes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.features.studyNotes.description')}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{t('home.features.openSharing.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.features.openSharing.description')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {t('home.cta.title')}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {t('home.cta.subtitle')}
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/posts">
              {t('home.cta.viewAllPosts')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
