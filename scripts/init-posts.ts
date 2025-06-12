#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { join } from 'path';
import * as readline from 'readline';

// 加载环境变量
config({ path: join(process.cwd(), '.env.local') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

const initialPosts = [
  {
    title: "Getting Started with Next.js 15 and Server Components",
    excerpt: "Learn how to build modern web applications with Next.js 15 and its revolutionary Server Components feature. This comprehensive guide covers everything from setup to deployment.",
    content: `# Getting Started with Next.js 15 and Server Components

Next.js 15 introduces powerful new features that revolutionize how we build React applications. **Server Components** represent a paradigm shift in how we think about rendering and data fetching.

## What are Server Components?

Server Components run on the server and can directly access backend resources like databases, file systems, and APIs without additional API layers.

### Key Benefits

- **Zero Bundle Size**: Server Components don't add to your JavaScript bundle
- **Direct Backend Access**: No need for API routes for simple data fetching  
- **Better Performance**: Reduced hydration and faster loading times
- **Improved SEO**: Better server-side rendering capabilities

## Getting Started

First, create a new Next.js 15 project:

\`\`\`bash
npx create-next-app@latest my-app --app
cd my-app
npm run dev
\`\`\`

## Example Server Component

Here's a simple example of a Server Component that fetches data:

\`\`\`tsx
async function PostList() {
  // This runs on the server
  const posts = await fetch('https://api.example.com/posts');
  const data = await posts.json();
  
  return (
    <div className="grid gap-4">
      {data.map(post => (
        <Article key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

## Client vs Server Components

> **Important**: Use Server Components by default, and only add 'use client' when you need interactivity.

- **Server Components**: Data fetching, static content
- **Client Components**: Interactive features, event handlers, state

## Best Practices

1. **Start with Server Components** - They're faster and more efficient
2. **Use Client Components sparingly** - Only when you need interactivity
3. **Compose them together** - Server Components can render Client Components
4. **Fetch data close to where it's used** - Reduces waterfall requests

---

This is just the beginning of what's possible with Next.js 15! The new architecture opens up exciting possibilities for building faster, more efficient web applications.`,
    cover_image: "https://picsum.photos/600/338?random=1",
    slug: "getting-started-with-nextjs-15",
    published_at: "2024-03-15T10:00:00Z",
    status: "published" as const,
    tags: ["Next.js", "React", "Server Components", "JavaScript"]
  },
  {
    title: "Building a Blog with Supabase and Next.js",
    excerpt: "Discover how to create a full-featured blog using Supabase as the backend and Next.js for the frontend. Complete with authentication, real-time features, and more.",
    content: `# Building a Blog with Supabase and Next.js

In this comprehensive tutorial, we'll build a complete blog application using **Supabase** as our backend and **Next.js** for the frontend.

## Why Supabase?

Supabase provides everything you need for a modern application:

- 🗄️ **PostgreSQL database** - Powerful relational database
- ⚡ **Real-time subscriptions** - Live updates without polling
- 🔐 **Built-in authentication** - User management out of the box
- 🚀 **Auto-generated APIs** - REST and GraphQL APIs
- 📁 **File storage** - Handle images and documents

## Project Setup

Let's start by setting up our Next.js project:

\`\`\`bash
npx create-next-app@latest blog-app --typescript --tailwind
cd blog-app
npm install @supabase/supabase-js
\`\`\`

## Database Schema

Our blog needs a robust posts table. Here's the SQL schema:

\`\`\`sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);
\`\`\`

## Supabase Client Setup

Create a Supabase client in \`lib/supabase.ts\`:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
\`\`\`

## Real-time Features

One of Supabase's killer features is real-time updates. Here's how to listen for changes:

\`\`\`typescript
useEffect(() => {
  const channel = supabase
    .channel('posts')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'posts' },
      (payload) => {
        console.log('Change received!', payload)
        // Update your UI here
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [])
\`\`\`

## Data Fetching

Create a service layer for your posts:

\`\`\`typescript
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data
}
\`\`\`

## Row Level Security

Don't forget to enable RLS for security:

\`\`\`sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Public posts are viewable by everyone" 
ON posts FOR SELECT 
USING (status = 'published');
\`\`\`

---

With this setup, you have a production-ready blog that can scale to millions of users! 🚀`,
    cover_image: "https://picsum.photos/600/338?random=2",
    slug: "building-blog-with-supabase",
    published_at: "2024-03-14T09:30:00Z",
    status: "published" as const,
    tags: ["Supabase", "Next.js", "PostgreSQL", "Real-time"]
  },
  {
    title: "Implementing Dark Mode with Next-Themes",
    excerpt: "A comprehensive guide to adding dark mode support to your Next.js application using next-themes. Learn about system preferences, persistence, and smooth transitions.",
    content: `# Implementing Dark Mode with Next-Themes

Dark mode has become an **essential feature** for modern web applications. In this guide, we'll implement dark mode using \`next-themes\`, the most popular solution for Next.js applications.

## Why Next-Themes?

\`next-themes\` offers several advantages over custom implementations:

| Feature | next-themes | Custom |
|---------|-------------|--------|
| System preference detection | ✅ | ❌ |
| No flash of incorrect theme | ✅ | ❌ |
| Persistence across sessions | ✅ | ⚠️ |
| Multiple theme support | ✅ | ❌ |
| TypeScript support | ✅ | ⚠️ |

## Installation

Start by installing the required package:

\`\`\`bash
npm install next-themes
\`\`\`

## Basic Setup

Wrap your app with the \`ThemeProvider\` in your root layout:

\`\`\`tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
\`\`\`

## Theme Toggle Component

Create a beautiful toggle component:

\`\`\`tsx
'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
\`\`\`

## CSS Configuration

Configure your CSS variables for seamless theme switching:

\`\`\`css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other light theme variables */
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark theme variables */
  }
}
\`\`\`

## Advanced Configuration

For more complex scenarios, you can configure additional options:

\`\`\`tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  themes={['light', 'dark', 'blue', 'green']}
  storageKey="app-theme"
>
  {children}
</ThemeProvider>
\`\`\`

## Preventing Flash

To prevent the flash of incorrect theme, add this to your HTML:

\`\`\`tsx
<html lang="en" suppressHydrationWarning>
\`\`\`

> **Note**: The \`suppressHydrationWarning\` prop prevents React from warning about the theme mismatch during hydration.

## Best Practices

1. **Use CSS variables** - They provide the smoothest transitions
2. **Test both themes** - Ensure all components work in both modes
3. **Consider accessibility** - Some users prefer high contrast themes
4. **Respect system preferences** - Default to system theme when possible

---

With this implementation, your users will enjoy a seamless dark mode experience that respects their preferences and provides smooth transitions! 🌙`,
    cover_image: "https://picsum.photos/600/338?random=3",
    slug: "dark-mode-with-next-themes",
    published_at: "2024-03-13T14:15:00Z",
    status: "published" as const,
    tags: ["Dark Mode", "Next.js", "CSS", "UX"]
  }
];

const initialTags = [
  { name: "Next.js", slug: "nextjs", description: "React框架，用于构建现代Web应用程序" },
  { name: "React", slug: "react", description: "用于构建用户界面的JavaScript库" },
  { name: "TypeScript", slug: "typescript", description: "JavaScript的超集，添加了类型安全" },
  { name: "JavaScript", slug: "javascript", description: "动态编程语言，Web开发的基础" },
  { name: "CSS", slug: "css", description: "用于样式化Web页面的样式表语言" },
  { name: "Tailwind CSS", slug: "tailwind-css", description: "实用优先的CSS框架" },
  { name: "Supabase", slug: "supabase", description: "开源的Firebase替代品" },
  { name: "PostgreSQL", slug: "postgresql", description: "强大的开源关系型数据库" },
  { name: "Server Components", slug: "server-components", description: "React服务器组件技术" },
  { name: "Real-time", slug: "real-time", description: "实时数据同步技术" },
  { name: "Dark Mode", slug: "dark-mode", description: "暗色主题模式" },
  { name: "UX", slug: "ux", description: "用户体验设计" },
  { name: "Performance", slug: "performance", description: "性能优化相关技术" },
  { name: "SEO", slug: "seo", description: "搜索引擎优化" },
  { name: "Frontend", slug: "frontend", description: "前端开发技术" },
  { name: "Backend", slug: "backend", description: "后端开发技术" },
  { name: "Database", slug: "database", description: "数据库相关技术" },
  { name: "Authentication", slug: "authentication", description: "用户认证和授权" },
  { name: "API", slug: "api", description: "应用程序接口" },
  { name: "Tutorial", slug: "tutorial", description: "教程和指南" }
];

async function ensureTableExists(supabase: any, tableName: string, createSql?: string) {
  console.log(`🔧 确保 ${tableName} 表存在...`);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log(`✅ ${tableName} 表已存在`);
      return true;
    } else if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      console.log(`❌ ${tableName} 表不存在`);
      return false;
    } else {
      console.log(`⚠️  ${tableName} 表可能有问题:`, error.message);
      return true;
    }
  } catch (error: any) {
    console.log(`❌ 检查 ${tableName} 表时发生错误:`, error.message);
    return false;
  }
}

async function createAdmin(supabase: any) {
  console.log('\n👤 创建管理员账户');
  console.log('请输入管理员信息（用于登录后台管理）\n');
  
  const email = await question('请输入管理员邮箱: ');
  const password = await question('请输入管理员密码 (至少6位): ');

  if (password.length < 6) {
    throw new Error('密码长度至少需要6位');
  }

  console.log('\n创建管理员账户中...');

  // 创建用户
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // 自动确认邮箱
  });

  if (authError) {
    throw authError;
  }

  console.log('✅ 管理员账户创建成功!');
  console.log(`📧 邮箱: ${email}`);
  console.log(`🆔 用户ID: ${authData.user.id}`);
  
  return authData.user.id;
}

async function initializeTags(supabase: any) {
  console.log('\n🏷️  初始化标签数据...');
  
  // 清理现有标签数据
  const { error: deleteTagsError } = await supabase
    .from('tags')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteTagsError) {
    console.log('⚠️  清理标签数据时发生错误:', deleteTagsError.message);
  } else {
    console.log('✅ 现有标签数据已清理');
  }
  
  // 插入初始标签
  const { data: tagsData, error: tagsError } = await supabase
    .from('tags')
    .insert(initialTags)
    .select();
  
  if (tagsError) {
    console.error('❌ 插入标签失败:', tagsError);
    throw tagsError;
  }
  
  console.log(`✅ 已插入 ${tagsData?.length} 个标签`);
  return tagsData;
}

async function initializePosts(supabase: any, authorId: string, tagsData: any[]) {
  console.log('\n📝 初始化文章数据...');
  
  // 清理现有文章数据
  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
    console.log('⚠️  清理文章数据时发生错误:', deleteError.message);
  } else {
    console.log('✅ 现有文章数据已清理');
  }
  
  // 为文章添加 author_id
  const postsWithAuthor = initialPosts.map(post => ({
    ...post,
    author_id: authorId
  }));
  
  // 插入示例文章
  const { data: postsData, error } = await supabase
    .from('posts')
    .insert(postsWithAuthor)
    .select();
  
  if (error) {
    console.error('❌ 插入文章失败:', error);
    throw error;
  }
  
  console.log(`✅ 已插入 ${postsData?.length} 篇文章`);
  
  // 创建文章-标签关联
  console.log('🔗 创建文章-标签关联...');
  
  const postTagRelations = [];
  for (const post of postsData) {
    const originalPost = initialPosts.find(p => p.slug === post.slug);
    if (originalPost?.tags) {
      for (const tagName of originalPost.tags) {
        const tag = tagsData.find(t => t.name === tagName);
        if (tag) {
          postTagRelations.push({
            post_id: post.id,
            tag_id: tag.id
          });
        }
      }
    }
  }
  
  if (postTagRelations.length > 0) {
    const { error: relationError } = await supabase
      .from('post_tags')
      .insert(postTagRelations);
    
    if (relationError) {
      console.log('⚠️  创建文章-标签关联时发生错误:', relationError.message);
    } else {
      console.log(`✅ 已创建 ${postTagRelations.length} 个文章-标签关联`);
    }
  }
  
  return postsData;
}

async function initializeDatabase() {
  console.log('🚀 开始数据库初始化...\n');
  
  try {
    // 检查环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) {
      throw new Error('缺少环境变量 NEXT_PUBLIC_SUPABASE_URL');
    }
    
    if (!serviceRoleKey) {
      throw new Error('缺少环境变量 SUPABASE_SERVICE_ROLE_KEY');
    }
    
    console.log('✅ 环境变量检查通过');
    console.log(`📡 连接到 Supabase: ${supabaseUrl.replace(/https?:\/\/([^.]+)\..*/, 'https://$1.supabase.co')}`);
    
    // 创建管理员客户端
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // 检查必要的表是否存在
    const postsTableExists = await ensureTableExists(supabase, 'posts');
    const tagsTableExists = await ensureTableExists(supabase, 'tags');
    const postTagsTableExists = await ensureTableExists(supabase, 'post_tags');
    
    if (!postsTableExists || !tagsTableExists || !postTagsTableExists) {
      console.log('\n⚠️  必要的表不存在！');
      console.log('请在 Supabase SQL 编辑器中运行以下迁移文件：');
      console.log('1. supabase/migrations/001_create_posts_table.sql');
      console.log('2. supabase/migrations/002_add_functions.sql');
      console.log('3. TAGS_SETUP.md 中的 SQL 语句');
      throw new Error('数据库表未创建，请先创建表结构');
    }
    
    // 创建管理员账户
    const adminUserId = await createAdmin(supabase);
    
    // 初始化标签
    const tagsData = await initializeTags(supabase);
    
    // 初始化文章
    const postsData = await initializePosts(supabase, adminUserId, tagsData);
    
    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📋 初始化摘要:');
    console.log(`👤 管理员账户: 已创建`);
    console.log(`🏷️  标签数量: ${tagsData?.length}`);
    console.log(`📝 文章数量: ${postsData?.length}`);
    
    console.log('\n📖 示例文章:');
    postsData?.forEach((post: any, index: number) => {
      console.log(`   ${index + 1}. ${post.title}`);
      console.log(`      📎 slug: ${post.slug}`);
      console.log(`      🔗 URL: /posts/${post.slug}\n`);
    });
    
    console.log('💡 提示: 运行 "npm run dev" 启动开发服务器');
    console.log('🔑 使用刚才创建的管理员账户登录 /admin 管理后台');
    
  } catch (error: any) {
    console.error('\n❌ 初始化失败:', error.message);
    console.log('\n🔧 故障排除步骤:');
    console.log('1. 确保已创建 .env.local 文件');
    console.log('2. 确保已设置 NEXT_PUBLIC_SUPABASE_URL');
    console.log('3. 确保已设置 SUPABASE_SERVICE_ROLE_KEY');
    console.log('4. 检查 Supabase 项目是否正常运行');
    console.log('5. 确保在 Supabase 中已创建所有必要的表');
    
    console.log('\n📋 当前环境变量状态:');
    console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置'}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '已设置' : '未设置'}`);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('\n📄 请检查 .env.local 文件内容:');
      console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
      console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    }
    
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 直接运行脚本
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase, initialPosts, initialTags }; 