# OAuth 重定向问题详细调试指南

## 问题症状

- ✅ 邮箱登录重定向正常
- ❌ 第三方登录（GitHub/Google）仍然重定向到生产环境

## 可能的原因

### 1. Supabase Dashboard 配置问题 ⭐️**最可能**

在 Supabase Dashboard 中可能有固定的配置覆盖了客户端设置。

### 2. OAuth 提供商配置问题

GitHub/Google OAuth 应用中可能配置了固定的重定向 URL。

### 3. 环境变量配置问题

测试环境中可能意外设置了生产环境的 URL。

## 详细排查步骤

### 步骤 1: 检查 Supabase Dashboard 配置

1. **登录 Supabase Dashboard**
   - 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 选择你的项目

2. **检查 URL Configuration**
   - 导航到 "Authentication" → "URL Configuration"
   - 查看以下设置：

   **Site URL**
   ```
   应该设置为: https://your-production-domain.com
   ```

   **Redirect URLs**
   ```
   应该包含:
   - https://your-production-domain.com/**
   - https://*.vercel.app/**  (允许所有 Vercel 部署)
   - http://localhost:3000/**  (本地开发)
   ```

3. **如果配置不正确，修改为**：
   ```
   Site URL: https://your-production-domain.com
   
   Redirect URLs:
   https://your-production-domain.com/**
   https://*.vercel.app/**
   http://localhost:3000/**
   ```

### 步骤 2: 检查 OAuth 提供商配置

#### GitHub OAuth 应用

1. 访问 [GitHub Settings](https://github.com/settings/developers)
2. 点击你的 OAuth App
3. 检查 **Authorization callback URL**：
   ```
   应该是: https://your-project.supabase.co/auth/v1/callback
   ```

#### Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 导航到 "APIs & Services" → "Credentials"
3. 点击你的 OAuth 2.0 Client ID
4. 检查 **Authorized redirect URIs**：
   ```
   应该是: https://your-project.supabase.co/auth/v1/callback
   ```

### 步骤 3: 检查环境变量

在浏览器控制台中运行以下代码查看当前配置：

```javascript
// 在测试环境的浏览器控制台中运行
console.log('=== OAuth 调试信息 ===')
console.log('当前域名:', window.location.origin)
console.log('环境变量 NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
console.log('是否为localhost:', window.location.origin.includes('localhost'))
console.log('是否为Vercel预览:', window.location.origin.includes('vercel.app') && window.location.origin.includes('-git-'))
console.log('预期重定向URL:', window.location.origin + '/auth/callback')

// 检查Vercel环境变量
if (window.location.hostname.includes('vercel.app')) {
  console.log('这是Vercel部署环境')
  if (window.location.hostname.includes('-git-')) {
    console.log('这是Vercel预览环境，不应该设置NEXT_PUBLIC_SITE_URL')
  } else {
    console.log('这是Vercel生产环境，可以设置NEXT_PUBLIC_SITE_URL')
  }
}
```

### 步骤 4: 实时调试 OAuth 流程

在登录时查看控制台输出，应该看到类似信息：

```
[OAuth Login] Provider: github, ForceReauth: true
OAuth login attempt: {
  provider: "github",
  forceReauth: true,
  queryParams: {...},
  redirectTo: "https://current-test-domain.vercel.app/auth/callback?_gh_force=...",
  baseUrl: "https://current-test-domain.vercel.app",
  currentOrigin: "https://current-test-domain.vercel.app",
  envSiteUrl: "https://production-domain.com"  // 这里应该显示实际的环境变量值
}
```

**⚠️ 如果 `redirectTo` 显示的是生产环境 URL，说明客户端逻辑有问题**

**⚠️ 如果 `redirectTo` 正确但最终还是跳转到生产环境，说明是服务端配置问题**

## 修复方案

### 方案 1: 修复 Supabase URL Configuration（推荐）

如果 Supabase Dashboard 配置有问题：

1. 修改 "Authentication" → "URL Configuration"
2. 将 **Redirect URLs** 设置为支持通配符：
   ```
   https://*.vercel.app/**
   https://your-production-domain.com/**
   http://localhost:3000/**
   ```
3. 保存设置并等待几分钟生效

### 方案 2: 环境特定配置

在 Vercel 中为不同环境设置不同的变量：

1. **Production 环境**：
   ```
   NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
   ```

2. **Preview 环境**：
   ```
   不设置 NEXT_PUBLIC_SITE_URL（让系统自动检测）
   ```

3. **Development 环境**：
   ```
   不设置 NEXT_PUBLIC_SITE_URL（让系统自动检测）
   ```

### 方案 3: 强制使用当前域名

如果上述方案都不行，可以强制客户端始终使用当前域名：

```typescript
// 临时修复：强制使用当前域名
const getBaseUrl = () => {
  return window.location.origin
}
```

## 验证修复

### 1. 控制台日志验证

登录时查看日志，确认：
- `redirectTo` 使用正确的测试环境域名
- `baseUrl` 与当前访问的域名一致

### 2. 网络请求验证

1. 打开浏览器开发者工具
2. 切换到 "Network" 标签
3. 尝试 OAuth 登录
4. 查看重定向请求的 URL

### 3. 最终重定向验证

成功登录后，浏览器地址栏应该显示测试环境的域名，而不是生产环境。

## 常见问题

### Q: 为什么邮箱登录正常，OAuth 登录有问题？

A: 邮箱登录不涉及外部重定向，而 OAuth 登录需要经过外部服务（GitHub/Google）的重定向，这个过程中可能受到 Supabase 配置的影响。

### Q: 修改了 Supabase 配置为什么不立即生效？

A: OAuth 配置可能需要几分钟才能生效，建议等待 5-10 分钟后再测试。

### Q: 通配符 URL 是否安全？

A: `https://*.vercel.app/**` 只允许 Vercel 域名，是相对安全的。如果担心安全问题，可以手动添加具体的测试域名。

## 紧急临时解决方案

如果需要立即解决问题，可以临时修改代码强制使用当前域名：

```typescript
// 在 src/lib/auth.ts 中临时修改
const getBaseUrl = () => {
  console.log('🔧 使用临时修复：强制使用当前域名')
  return window.location.origin
}
```

这个方案虽然不优雅，但可以立即解决重定向问题。后续再根据上述步骤进行正确的配置。

---

**如果按照以上步骤仍无法解决问题，请提供：**
1. 控制台中的完整 OAuth 调试信息
2. Supabase Dashboard 的 URL Configuration 截图
3. OAuth 提供商的配置截图 