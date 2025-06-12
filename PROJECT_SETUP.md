# TTBlog 项目配置指南

## 📋 项目概述

TTBlog 是一个基于 Next.js 15 和 Supabase 的现代化博客内容管理系统，支持 MDX 内容格式。

## 🛠 技术栈

- **框架**: Next.js 15 (App Router + Server Actions)
- **语言**: TypeScript
- **数据库**: Supabase (PostgreSQL)
- **样式**: TailwindCSS + ShadCN/UI
- **内容**: MDX (Markdown + JSX)
- **状态管理**: Zustand
- **表单处理**: React Hook Form
- **数据获取**: Server Components + React Query

## 🚀 快速开始

### 1. 环境设置

1. 复制环境变量模板：
   ```bash
   cp ENV_SETUP.md .env.local
   ```

2. 按照 `ENV_SETUP.md` 中的指南设置 Supabase 凭据

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库设置

1. 在 Supabase SQL 编辑器中运行迁移文件：
   - `supabase/migrations/001_create_posts_table.sql`
   - `supabase/migrations/002_add_functions.sql`

2. 初始化示例数据：
   ```bash
   npm run db:init
   ```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📝 NPM Scripts

- `npm run dev` - 启动开发服务器（Turbopack）
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
- `npm run db:init` - 初始化数据库示例数据
- `npm run db:reset` - 重置数据库数据

## 📁 项目结构

```
src/
├── app/                 # App Router 页面和布局
│   ├── page.tsx        # 首页
│   ├── posts/[slug]/   # 动态文章页面
│   └── layout.tsx      # 根布局
├── components/         # React 组件
│   ├── ui/            # ShadCN UI 组件
│   ├── mdx-content.tsx # MDX 内容渲染
│   ├── post-card.tsx  # 文章卡片
│   └── site-header.tsx # 网站头部
├── lib/               # 工具函数和配置
│   ├── supabase.ts    # Supabase 客户端
│   ├── posts.ts       # 文章数据服务
│   └── utils.ts       # 通用工具函数
└── types/             # TypeScript 类型定义
    └── database.ts    # 数据库类型

scripts/
└── init-posts.ts      # 数据库初始化脚本

supabase/
├── migrations/        # 数据库迁移文件
│   ├── 001_create_posts_table.sql
│   └── 002_add_functions.sql
```

## 🎨 特性

- ✅ **响应式设计** - 移动端友好
- ✅ **深色模式** - 系统主题检测
- ✅ **MDX 支持** - Markdown + JSX 内容
- ✅ **语法高亮** - 代码块美化
- ✅ **SEO 优化** - 元数据和 OpenGraph
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **实时数据** - Supabase 实时订阅
- ✅ **Row Level Security** - 数据安全保护

## 📖 内容管理

### 文章结构

每篇文章包含以下字段：
- `title` - 标题
- `excerpt` - 摘要
- `content` - MDX 格式的内容
- `cover_image` - 封面图片 URL
- `slug` - URL 路径
- `tags` - 标签数组
- `status` - 状态 (draft/published/archived)

### MDX 内容

文章内容使用 MDX 格式，支持：
- 标准 Markdown 语法
- 代码块语法高亮
- 自定义 React 组件
- 表格、引用、列表等

## 🔧 故障排除

### 常见问题

1. **Supabase 连接失败**
   - 检查 `.env.local` 文件是否存在
   - 验证环境变量是否正确设置

2. **数据库表不存在**
   - 确保已运行数据库迁移
   - 检查 Supabase 项目是否正确配置

3. **初始化脚本失败**
   - 确保设置了 `SUPABASE_SERVICE_ROLE_KEY`
   - 检查网络连接和权限

### 重置数据

如需重置所有文章数据：
```bash
npm run db:reset
```

## 📚 参考资料

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [MDX 文档](https://mdxjs.com/)
- [TailwindCSS 文档](https://tailwindcss.com/docs) 