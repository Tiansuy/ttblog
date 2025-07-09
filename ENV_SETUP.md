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

# 站点 URL 配置 (重要: 解决 OAuth 跳转到 localhost 问题)
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

## 步骤 3: 替换占位符

将以下占位符替换为您的实际值：

- `https://your-project-ref.supabase.co` → 您的 Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → 您的实际密钥
- `https://your-app-name.vercel.app` → 您的 Vercel 应用域名

## 步骤 4: Vercel 部署环境变量配置

在 Vercel 部署时，需要在项目设置中添加以下环境变量：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**⚠️ 重要提示**: 
- `NEXT_PUBLIC_SITE_URL` 必须设置为您的实际生产域名
- 这个环境变量解决了 OAuth 登录时跳转到 localhost 的问题
- 如果您使用自定义域名，请设置为您的自定义域名

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
1. 确保 `NEXT_PUBLIC_SITE_URL` 环境变量已正确设置
2. 重新部署 Vercel 应用
3. 检查 Supabase 项目中的 OAuth 配置
4. 清除浏览器缓存和 cookies

### 问题: 环境变量未生效

**解决方案**:
1. 检查变量名是否正确（注意大小写）
2. 重启开发服务器
3. 在 Vercel 中重新部署项目 