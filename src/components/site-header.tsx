"use client"

import Link from "next/link";
import { Menu, User, Settings, HelpCircle, LogOut, Shield, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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
  const { user, loading, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex-shrink-0">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mr-4">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Posts
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                href="/admin"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-1">
            <LanguageToggle />
            <ThemeToggle />
            
            {loading ? (
              <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
            ) : isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  退出
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="h-3 w-3 mr-1" />
                    登录
                  </Link>
                </Button>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="md:hidden">
                  <DropdownMenuItem asChild>
                    <Link href="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/posts">Posts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about">About</Link>
                  </DropdownMenuItem>
                  
                  {isAuthenticated && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {user?.email}
                      </div>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        退出登录
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        登录
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </div>
                
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
} 