"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Satellite, Stars, Globe, Zap, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useState, useEffect, useRef, useCallback } from "react"

// 固定的星星位置，避免hydration不匹配
const FIXED_STARS = [
  { top: 20, left: 10, delay: 0, duration: 2 },
  { top: 32, left: 80, delay: 0.5, duration: 3 },
  { top: 60, left: 30, delay: 1, duration: 2.5 },
  { top: 80, right: 30, delay: 1.5, duration: 3.5 },
  { top: 40, left: 60, delay: 2, duration: 2.8 },
  { top: 15, right: 20, delay: 0.8, duration: 3.2 },
  { top: 65, left: 15, delay: 2.2, duration: 2.3 },
  { top: 35, right: 15, delay: 1.8, duration: 2.7 },
  { top: 75, left: 70, delay: 2.5, duration: 3.1 },
  { top: 25, left: 45, delay: 1.2, duration: 2.9 },
  { top: 55, right: 50, delay: 2.8, duration: 2.6 },
  { top: 85, left: 25, delay: 0.3, duration: 3.3 },
  { top: 45, right: 40, delay: 1.9, duration: 2.4 },
  { top: 18, left: 75, delay: 2.3, duration: 3.7 },
  { top: 68, right: 25, delay: 0.9, duration: 2.1 }
]

export default function Home() {
  const { t } = useTranslation()
  const [currentSection, setCurrentSection] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(false) // 禁用自动切换
  const [transitioning, setTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalSections = 3
  const isScrolling = useRef(false)

  // 防止hydration错误
  useEffect(() => {
    setMounted(true)
  }, [])

  // 自动滑动（已禁用）
  useEffect(() => {
    if (!isAutoSliding) return

    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % totalSections)
    }, 8000) // 8秒切换一次

    return () => clearInterval(interval)
  }, [isAutoSliding, totalSections])

  // 滑动到指定section
  const slideTo = useCallback((index: number) => {
    if (isScrolling.current || transitioning) return
    
    isScrolling.current = true
    setCurrentSection(index)
    setIsAutoSliding(false)
    
    // 防抖时间短，但自动滑动恢复时间较长
    setTimeout(() => {
      isScrolling.current = false
    }, 300)
    
    setTimeout(() => {
      setIsAutoSliding(false) // 保持禁用状态
    }, 3000)
  }, [transitioning])

  // 优化的切换函数，实现真正的循环滚动效果
  const switchSection = useCallback((direction: 'next' | 'prev') => {
    if (isScrolling.current || transitioning) return
    
    isScrolling.current = true
    setIsAutoSliding(false)

    const nextSection = direction === 'next' 
      ? (currentSection + 1) % totalSections
      : (currentSection - 1 + totalSections) % totalSections

    // 检测是否为首尾循环
    const isWrapAround = 
      (direction === 'next' && currentSection === totalSections - 1) ||
      (direction === 'prev' && currentSection === 0)

    if (isWrapAround) {
      // 首尾循环：禁用React的transition，手动控制DOM
      setTransitioning(true)
      
      const container = containerRef.current
      if (container) {
        const slideContainer = container.querySelector('.slide-container') as HTMLElement
        if (slideContainer) {
          if (direction === 'next' && currentSection === totalSections - 1) {
            // 第3页→第1页：瞬间跳到虚拟第4页位置，然后动画到第1页
            slideContainer.style.transition = 'none'
            slideContainer.style.transform = `translateX(-${totalSections * 100}%)`
            
            // 强制重绘后启用动画
            requestAnimationFrame(() => {
              slideContainer.style.transition = 'transform 700ms ease-in-out'
              slideContainer.style.transform = `translateX(0%)`
              
              // 动画完成后更新React状态并移除内联样式
              setTimeout(() => {
                setCurrentSection(nextSection)
                setTransitioning(false)
                isScrolling.current = false
                // 清除内联样式，让React重新控制
                slideContainer.style.transition = ''
                slideContainer.style.transform = ''
              }, 700)
            })
          } else if (direction === 'prev' && currentSection === 0) {
            // 第1页→第3页：瞬间跳到虚拟第0页位置，然后动画到第3页
            slideContainer.style.transition = 'none'
            slideContainer.style.transform = `translateX(100%)`
            
            // 强制重绘后启用动画
            requestAnimationFrame(() => {
              slideContainer.style.transition = 'transform 700ms ease-in-out'
              slideContainer.style.transform = `translateX(-${(totalSections - 1) * 100}%)`
              
              // 动画完成后更新React状态并移除内联样式
              setTimeout(() => {
                setCurrentSection(nextSection)
                setTransitioning(false)
                isScrolling.current = false
                // 清除内联样式，让React重新控制
                slideContainer.style.transition = ''
                slideContainer.style.transform = ''
              }, 700)
            })
          }
        }
      }
    } else {
      // 普通切换：使用React的transition（不设置transitioning=true）
      setCurrentSection(nextSection)
      setTimeout(() => {
        isScrolling.current = false
      }, 700)
    }
    
    setTimeout(() => {
      setIsAutoSliding(false) // 保持禁用状态
    }, 3000)
  }, [currentSection, totalSections, transitioning])

  // 上一个/下一个
  const goToPrevious = useCallback(() => {
    switchSection('prev')
  }, [switchSection])

  const goToNext = useCallback(() => {
    switchSection('next')
  }, [switchSection])

  // 滚轮滑动处理
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling.current || transitioning) return
      
      // 检测滚轮方向，使用更灵敏的阈值
      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0) {
          // 向下滚轮 = 下一个section（向右滑动效果）
          goToNext()
        } else {
          // 向上滚轮 = 上一个section（向左滑动效果）
          goToPrevious()
        }
      }
    }

    // 键盘事件处理
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current || transitioning) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    // 确保事件监听器正确绑定到整个页面
    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [goToPrevious, goToNext, transitioning])

  // 触摸滑动处理
  const handleTouchStart = useRef<{ x: number; y: number } | null>(null)
  const handleTouchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    handleTouchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    handleTouchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const onTouchEnd = () => {
    if (!handleTouchStart.current || !handleTouchEnd.current) return

    const deltaX = handleTouchStart.current.x - handleTouchEnd.current.x
    const deltaY = handleTouchStart.current.y - handleTouchEnd.current.y

    // 确保是水平滑动（水平移动距离大于垂直移动距离）
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 50) { // 最小滑动距离
        if (deltaX > 0) {
          goToNext() // 向左滑动，显示下一个
        } else {
          goToPrevious() // 向右滑动，显示上一个
        }
      }
    }

    handleTouchStart.current = null
    handleTouchEnd.current = null
  }

  // 获取文本，防止hydration错误
  const getText = (key: string, fallback: string) => {
    return mounted ? t(key) : fallback
  }

  return (
    <div className="w-full h-[calc(100vh-8rem)] fixed top-16 left-0 right-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
      {/* 动态星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 固定位置的星星群 */}
        {FIXED_STARS.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-200 rounded-full animate-pulse opacity-60"
            style={{
              top: `${star.top}%`,
              left: star.left ? `${star.left}%` : undefined,
              right: (star as any).right ? `${(star as any).right}%` : undefined,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
        
        {/* 月球 */}
        <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 opacity-20 animate-pulse">
          <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-gray-500 opacity-30"></div>
          <div className="absolute top-12 right-8 w-2 h-2 rounded-full bg-gray-500 opacity-40"></div>
          <div className="absolute bottom-8 left-10 w-4 h-4 rounded-full bg-gray-500 opacity-25"></div>
        </div>

        {/* 空间站 */}
        <div className="absolute top-1/3 right-1/4 w-16 h-16 opacity-30 animate-spin" style={{animationDuration: '30s'}}>
          <div className="relative w-full h-full">
            {/* 主体 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-300 rounded-sm"></div>
            {/* 太阳能板 */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-6 h-2 bg-blue-400"></div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-6 h-2 bg-blue-400"></div>
            {/* 天线 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-200"></div>
          </div>
        </div>

        {/* 流星 */}
        <div className="absolute top-20 -left-10 w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform rotate-45 animate-pulse opacity-50"></div>
        <div className="absolute top-2/3 -right-10 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform -rotate-45 animate-pulse opacity-30" style={{animationDelay: '3s'}}></div>
      </div>

      {/* 滑动容器 */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 滑动内容 */}
        <div 
          className="slide-container flex w-full h-full"
          style={{
            transform: `translateX(-${currentSection * 100}%)`,
            transition: transitioning ? 'none' : 'transform 700ms ease-in-out'
          }}
        >
          {/* Section 1 - Hero */}
          <section className="w-full h-full flex-shrink-0 relative flex items-center">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* 左侧内容区 - 不对称偏移 */}
                <div className="lg:col-span-7 lg:col-start-1 space-y-6 relative z-10 transform lg:-skew-y-1">
                  {/* 太空站图标动画 - 偏移位置 */}
                  <div className="relative mb-6 transform lg:translate-x-8">
                    <div className="w-20 h-20 mx-auto lg:mx-0 mb-4 relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 animate-spin" style={{animationDuration: '20s'}}></div>
                      <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                        <Satellite className="w-6 h-6 text-blue-300 animate-pulse" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-yellow-400 animate-bounce"></div>
                      {/* 能量环 */}
                      <div className="absolute -inset-3 rounded-full border-2 border-blue-400/20 animate-ping"></div>
                    </div>
                  </div>
                  
                  {/* 主标题 - 波动高亮效果 */}
                  <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center lg:text-left leading-tight transform lg:skew-y-1">
                    <span className="inline-block cosmic-wave-text bg-gradient-to-r from-blue-300 via-blue-100 to-indigo-300 bg-clip-text text-transparent">
                      {getText('home.title', '欢迎来到天随空间站').split('').map((char, i) => (
                        <span 
                          key={i} 
                          className="inline-block animate-bounce"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '2s',
                            animationIterationCount: 'infinite'
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </span>
                  </h1>
                  
                  {/* 副标题 - 高亮闪烁 */}
                  <div className="max-w-2xl text-base sm:text-lg leading-relaxed text-center lg:text-left backdrop-blur-sm bg-blue-950/20 p-4 rounded-lg border border-blue-400/20 transform lg:-rotate-1 relative">
                    <span className="text-blue-200 animate-pulse">
                      {getText('home.subtitle', '探索技术宇宙的宇宙平台')}
                    </span>
                    {/* 装饰性光点 */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-50"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
                  </div>
                  
                  {/* 按钮组 - 不对称排列 */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform lg:translate-x-4">
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 transition-all duration-300 hover:scale-105 hover:rotate-1 transform -rotate-1">
                      <Link href="/posts">
                        <Rocket className="mr-2 h-4 w-4 animate-pulse" />
                        {getText('home.browsePosts', '探索任务日志')}
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="border-blue-400/70 text-blue-100 bg-blue-900/20 hover:bg-blue-800/40 hover:text-blue-50 hover:border-blue-300/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm transform rotate-1 hover:-rotate-1">
                      <Link href="/about">
                        <Stars className="mr-2 h-3 w-3 animate-spin" style={{animationDuration: '3s'}} />
                        {getText('home.learnMore', '了解更多')}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* 右侧装饰区 */}
                <div className="lg:col-span-5 lg:col-start-8 relative hidden lg:block">
                  <div className="relative transform rotate-12">
                    {/* 大型装饰圆环 */}
                    <div className="w-64 h-64 rounded-full border-4 border-blue-400/20 animate-spin" style={{animationDuration: '40s'}}>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-indigo-400/30 animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}}>
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-6 right-6 w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                    {/* 星系装饰 */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 opacity-40">
                      <Sparkles className="w-full h-full text-blue-300 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 - Features */}
          <section className="w-full h-full flex-shrink-0 relative flex items-center">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="text-center mb-8 transform -rotate-1">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-blue-100 mb-4">
                  <span className="cosmic-glow-text">{getText('home.features.title', '空间站功能')}</span>
                </h2>
                <p className="max-w-3xl mx-auto text-blue-200 text-base transform rotate-1">
                  {getText('home.features.subtitle', '先进的太空技术提供恒星级探索体验')}
                </p>
              </div>
              
              {/* 不规则卡片布局 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-900/50 border-blue-400/20 hover:border-blue-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm transform rotate-2 hover:-rotate-1">
                  <CardHeader className="pb-2">
                    <Rocket className="h-6 w-6 text-blue-400 mb-2 animate-bounce" />
                    <CardTitle className="text-lg text-blue-100">{getText('home.features.modernTech.title', '量子技术栈')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-200/80 text-sm">
                      {getText('home.features.modernTech.description', '使用现代技术栈构建')}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-900/50 border-blue-400/20 hover:border-blue-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm transform -rotate-1 hover:rotate-2 md:translate-y-6">
                  <CardHeader className="pb-2">
                    <Stars className="h-6 w-6 text-blue-400 mb-2 animate-pulse" />
                    <CardTitle className="text-lg text-blue-100">{getText('home.features.richContent.title', '银河知识')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-200/80 text-sm">
                      {getText('home.features.richContent.description', '丰富的技术内容和知识分享')}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-900/50 border-blue-400/20 hover:border-blue-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm transform rotate-1 hover:-rotate-2">
                  <CardHeader className="pb-2">
                    <Satellite className="h-6 w-6 text-blue-400 mb-2 animate-spin" style={{animationDuration: '4s'}} />
                    <CardTitle className="text-lg text-blue-100">{getText('home.features.studyNotes.title', '任务日志')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-200/80 text-sm">
                      {getText('home.features.studyNotes.description', '记录太空探索之旅和发现')}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-900/50 border-blue-400/20 hover:border-blue-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm transform -rotate-2 hover:rotate-1 md:translate-y-6">
                  <CardHeader className="pb-2">
                    <Globe className="h-6 w-6 text-blue-400 mb-2 animate-pulse" />
                    <CardTitle className="text-lg text-blue-100">{getText('home.features.openSharing.title', '宇宙连接')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-200/80 text-sm">
                      {getText('home.features.openSharing.description', '多语言支持，开源使命')}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Section 3 - CTA */}
          <section className="w-full h-full flex-shrink-0 relative flex items-center">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="text-center transform -skew-y-1 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {/* 装饰性背景元素 */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-400/20 rounded-full animate-ping"></div>
                <div className="absolute bottom-3 left-3 w-4 h-4 bg-blue-400/20 rounded-full animate-pulse"></div>
                
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-blue-100 mb-4 transform skew-y-1">
                  <span className="cosmic-highlight-text">{getText('home.cta.title', '开始您的旅程')}</span>
                </h2>
                <p className="text-blue-200 text-base mb-6 transform skew-y-1">
                  {getText('home.cta.subtitle', '探索我们的宇宙档案')}
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 transition-all duration-300 hover:scale-110 transform skew-y-1 hover:-skew-y-1">
                  <Link href="/posts">
                    <Rocket className="mr-2 h-4 w-4 animate-bounce" />
                    {getText('home.cta.viewAllPosts', '查看所有任务日志')}
                    <Zap className="ml-2 h-3 w-3 animate-pulse" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 导航箭头 */}
      <button
        onClick={goToPrevious}
        className="absolute left-24 top-1/2 transform -translate-y-1/2 z-20 w-24 h-24 hover:rounded-full hover:backdrop-blur-lg hover:bg-blue-400/10 hover:border hover:border-blue-300/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 group"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-8 h-8">
            {/* CSS绘制的左箭头 */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-l-4 border-b-4 border-blue-300 group-hover:border-blue-100 rotate-45 transition-all duration-300"
              style={{
                borderLeftColor: 'rgba(147, 197, 253, 0.9)',
                borderBottomColor: 'rgba(147, 197, 253, 0.9)',
              }}
            />
          </div>
        </div>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-24 top-1/2 transform -translate-y-1/2 z-20 w-24 h-24 hover:rounded-full hover:backdrop-blur-lg hover:bg-blue-400/10 hover:border hover:border-blue-300/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 group"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-8 h-8">
            {/* CSS绘制的右箭头 */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-r-4 border-t-4 border-blue-300 group-hover:border-blue-100 rotate-45 transition-all duration-300"
              style={{
                borderRightColor: 'rgba(147, 197, 253, 0.9)',
                borderTopColor: 'rgba(147, 197, 253, 0.9)',
              }}
            />
          </div>
        </div>
      </button>

      {/* 底部指示器 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => slideTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSection
                ? 'bg-blue-400 shadow-lg shadow-blue-400/50 scale-125'
                : 'bg-blue-400/30 hover:bg-blue-400/60'
            }`}
          />
        ))}
      </div>

      {/* 底部装饰星球 */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-950/50 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 blur-2xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
    </div>
  )
}
