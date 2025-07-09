# 环境变量设置指南

## 步骤 1: 获取 Supabase 凭据

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 点击左侧菜单中的 "Settings" → "API"
4. 您会看到以下信息：

### Project URL
```
https://your-project-ref.supabase.co
```

### API Keys
- **anon public**: 用于客户端操作（公开安全）
- **service_role**: 用于服务端操作（保密，具有完全访问权限）

## 步骤 2: 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 站点 URL 配置 (可选，用于OAuth回调)
# NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

## 步骤 3: 替换占位符

将以下占位符替换为您的实际值：

- `https://your-project-ref.supabase.co` → 您的 Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → 您的实际密钥

## 步骤 4: 环境变量配置策略

### 🔧 新的灵活配置方式

`NEXT_PUBLIC_SITE_URL` 现在是**可选的**，系统会根据不同情况自动处理：

#### 开发环境 (localhost)
```bash
# .env.local 中不需要设置 NEXT_PUBLIC_SITE_URL
# 系统会自动使用 http://localhost:3000
```

#### 测试环境 (Vercel Preview)
```bash
# 选项1：不设置，自动使用 Vercel Preview 域名
# 选项2：手动设置测试环境域名
NEXT_PUBLIC_SITE_URL=https://your-app-git-branch-username.vercel.app
```

#### 生产环境 (Production)
```bash
# 选项1：设置固定生产域名（推荐）
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app

# 选项2：不设置，自动使用当前访问域名
```

### 🎯 推荐配置

**对于大多数用户**，建议只在生产环境设置 `NEXT_PUBLIC_SITE_URL`：

1. **开发环境**: 不设置（自动使用 localhost）
2. **测试环境**: 不设置（自动使用 Vercel Preview 域名）
3. **生产环境**: 设置为固定域名（避免潜在问题）

## 步骤 5: Vercel 部署环境变量配置

在 Vercel 部署时，需要在项目设置中添加环境变量：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下变量：

### 必需的环境变量
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 可选的环境变量
```
# 仅在生产环境设置（推荐）
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**设置建议**：
- 在 Vercel 环境变量中，`NEXT_PUBLIC_SITE_URL` 只在 **Production** 环境中设置
- **Preview** 和 **Development** 环境不设置，让系统自动使用当前域名

## 安全注意事项

⚠️ **重要**: 
- 永远不要将 `service_role` 密钥暴露在客户端代码中
- 不要将 `.env.local` 文件提交到 Git 仓库
- `NEXT_PUBLIC_` 前缀的变量会暴露给客户端

## OAuth 配置注意事项

如果您使用第三方 OAuth 登录，请确保：

1. **GitHub OAuth 设置**：
   - 在 GitHub OAuth 应用中，回调 URL 设置为：`https://your-project.supabase.co/auth/v1/callback`
   - 授权域名包含您的生产域名

2. **Google OAuth 设置**：
   - 在 Google Cloud Console 中，授权重定向 URI 设置为：`https://your-project.supabase.co/auth/v1/callback`
   - 授权 JavaScript 来源包含您的生产域名

3. **Supabase OAuth 设置**：
   - 在 Supabase Dashboard → Authentication → URL Configuration 中
   - 添加您的生产域名到 "Site URL" 和 "Redirect URLs"

## 验证配置

设置完成后，可以通过以下命令验证：

```bash
npm run dev
```

如果配置正确，应用应该能够正常启动而不会出现 Supabase 连接错误。

## 故障排除

### 问题: OAuth 登录仍然跳转到 localhost

**解决方案**:
1. 检查是否在正确的环境中设置了 `NEXT_PUBLIC_SITE_URL`
2. 重新部署 Vercel 应用
3. 检查 Supabase 项目中的 OAuth 配置
4. 清除浏览器缓存和 cookies

### 问题: 测试环境 OAuth 不工作

**解决方案**:
1. 确保没有在 Vercel Preview 环境中设置 `NEXT_PUBLIC_SITE_URL`
2. 或者手动设置 `NEXT_PUBLIC_SITE_URL` 为测试环境的完整域名
3. 在 OAuth 提供商中添加测试域名到授权列表

### 问题: 环境变量未生效

**解决方案**:
1. 检查变量名是否正确（注意大小写）
2. 重启开发服务器
3. 在 Vercel 中重新部署项目 