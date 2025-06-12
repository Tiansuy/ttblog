# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新账户或登录
3. 创建新项目
4. 等待项目初始化完成

## 2. 获取项目凭据

在 Supabase 项目仪表板中：

1. 点击 "Settings" → "API"
2. 复制以下信息：
   - `Project URL`
   - `anon public` key
   - `service_role` key (仅用于服务端脚本)

## 3. 配置环境变量

创建 `.env.local` 文件并添加：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. 运行数据库迁移

在 Supabase SQL 编辑器中运行以下 SQL 文件：

1. `supabase/migrations/001_create_posts_table.sql`
2. `supabase/migrations/002_add_functions.sql`

或者使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

## 5. 初始化数据

运行初始化脚本来添加示例文章：

```bash
npm run db:init
```

## 6. 验证设置

1. 检查 Supabase 仪表板中是否已创建 `posts` 表
2. 确认表中有 3 篇示例文章
3. 运行 `npm run dev` 启动项目
4. 访问 `http://localhost:3000` 查看文章

## 故障排除

### 问题：无法连接到 Supabase
- 检查环境变量是否正确设置
- 确认项目 URL 和密钥是否有效
- 检查网络连接

### 问题：无法创建表
- 确认已在 SQL 编辑器中运行迁移文件
- 检查是否有权限错误
- 确认 SQL 语法正确

### 问题：初始化脚本失败
- 确认已设置 `SUPABASE_SERVICE_ROLE_KEY`
- 检查表是否已创建
- 查看控制台错误信息

## 重置数据

如果需要重置所有文章数据：

```bash
npm run db:reset
```

这将删除所有现有文章并重新插入示例数据。 