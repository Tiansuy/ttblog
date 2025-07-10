"use client"

import Link from "next/link";
import { Menu, User, Settings, HelpCircle, LogOut, Shield, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { isAdmin } from "@/lib/admin";
import { signOut } from "@/lib/auth";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { t } = useTranslation();
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  // 防止hydration错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  // 在hydration完成前，使用静态文本避免不匹配
  const getNavText = (key: string, fallback: string) => {
    return mounted ? t(key) : fallback;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200/20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex-shrink-0">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium mr-6">
            <Link
              href="/"
              className="transition-all duration-300 hover:text-blue-300 text-blue-100 hover:scale-105 relative group"
            >
              <span className="relative z-10">{getNavText('site.home', '主控台')}</span>
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Link>
            <Link
              href="/posts"
              className="transition-all duration-300 hover:text-blue-300 text-blue-100 hover:scale-105 relative group"
            >
              <span className="relative z-10">{getNavText('site.posts', '任务日志')}</span>
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Link>
            <Link
              href="/about"
              className="transition-all duration-300 hover:text-blue-300 text-blue-100 hover:scale-105 relative group"
            >
              <span className="relative z-10">{getNavText('site.aboutSite', '关于空间站')}</span>
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Link>
            <Link
              href="/about/me"
              className="transition-all duration-300 hover:text-blue-300 text-blue-100 hover:scale-105 relative group"
            >
              <span className="relative z-10">{getNavText('site.aboutMe', '关于我')}</span>
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Link>
            {/* 管理员入口 - 桌面端 */}
            {isAuthenticated && isAdmin(user) && (
              <Link
                href="/admin"
                className="transition-all duration-300 hover:text-blue-300 text-blue-100 hover:scale-105 relative group"
              >
                <span className="relative z-10 flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  {getNavText('site.admin', '控制中心')}
                </span>
                <div className="absolute inset-0 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            {/* <ThemeToggle /> */}
            
            {loading ? (
              <div className="h-9 w-20 animate-pulse bg-blue-800/30 rounded-md border border-blue-400/20" />
            ) : isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-blue-200 bg-blue-800/30 px-3 py-1.5 rounded-lg border border-blue-400/20">
                  ✨ {user?.email}
                </span>
              </div>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-800/50 text-blue-100 hover:text-blue-200 border border-blue-400/20 hover:border-blue-300/40 transition-all duration-300">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">{getNavText('common.moreOptions', '更多选项')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-slate-900 border border-blue-400/20 shadow-xl shadow-blue-900/20">
                <div className="md:hidden">
                  <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                    <Link href="/">{getNavText('site.home', '主控台')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                    <Link href="/posts">{getNavText('site.posts', '任务日志')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                    <Link href="/about">{getNavText('site.aboutSite', '关于空间站')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                    <Link href="/about/me">{getNavText('site.aboutMe', '关于我')}</Link>
                  </DropdownMenuItem>
                  
                  {isAuthenticated && isAdmin(user) && (
                    <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        {getNavText('site.admin', '控制中心')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-blue-400/20" />
                </div>
                
                {/* 用户账户相关选项 */}
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm text-blue-200 bg-blue-800/20 mx-1 rounded">
                      <User className="mr-2 h-4 w-4 inline" />
                      {user?.email}
                    </div>
                    <DropdownMenuItem onClick={handleSignOut} className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                      <LogOut className="mr-2 h-4 w-4" />
                      {getNavText('auth.logout', '退出')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      {getNavText('auth.login', '登录')}
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator className="bg-blue-400/20" />
                <DropdownMenuItem className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{getNavText('common.settings', '设置')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-blue-100 hover:bg-blue-800/30 hover:text-blue-200">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>{getNavText('common.help', '帮助')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
} 