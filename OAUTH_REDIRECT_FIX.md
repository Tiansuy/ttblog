# OAuth 重定向问题修复指南

## 问题描述

在测试环境登录后，URL 链接变成了生产环境的链接，导致用户被重定向到错误的域名。

## 问题原因

原来的代码逻辑中，如果设置了 `NEXT_PUBLIC_SITE_URL` 环境变量，它会在所有环境中都使用这个值，包括测试环境。这导致测试环境的用户被重定向到生产环境。

## 解决方案

### 1. 修复后的智能重定向逻辑 🆕

现在系统会根据当前环境智能选择重定向URL，并包含详细的调试信息：

```typescript
// 智能检测环境并处理重定向URL (最新版本)
const getBaseUrl = () => {
  const currentOrigin = window.location.origin
  
  console.log(`[Auth] 当前域名: ${currentOrigin}`)
  console.log(`[Auth] 环境变量: ${process.env.NEXT_PUBLIC_SITE_URL || 'undefined'}`)
  
  // 1. 开发环境：直接使用当前域名
  if (currentOrigin.includes('localhost')) {
    console.log(`[Auth] 检测到开发环境，使用当前域名: ${currentOrigin}`)
    return currentOrigin
  }
  
  // 2. Vercel预览环境：强制使用当前域名
  if (currentOrigin.includes('vercel.app') && currentOrigin.includes('-git-')) {
    console.log(`[Auth] 检测到Vercel预览环境，强制使用当前域名: ${currentOrigin}`)
    return currentOrigin
  }
  
  // 3. Vercel生产环境：检查环境变量
  if (currentOrigin.includes('vercel.app')) {
    console.log(`[Auth] 检测到Vercel生产环境`)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL
    } else {
      return currentOrigin
    }
  }
  
  // 4. 其他情况：智能处理环境变量不一致的情况
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    if (currentOrigin !== process.env.NEXT_PUBLIC_SITE_URL) {
      console.warn(`[Auth] 环境变量与当前域名不一致，强制使用当前域名`)
      return currentOrigin  // 🔧 临时修复：强制使用当前域名
    }
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // 5. 默认使用当前域名
  return currentOrigin
}
```

### 2. 新增的调试功能

现在登录时会在控制台输出详细的调试信息，帮助快速定位问题：

```
[Auth] 当前域名: https://your-test-domain.vercel.app
[Auth] 环境变量: https://your-production-domain.com
[Auth] 检测到Vercel预览环境，强制使用当前域名: https://your-test-domain.vercel.app
```

### 2. 环境变量配置建议

#### 开发环境 (.env.local)
```bash
# 不设置 NEXT_PUBLIC_SITE_URL
# 系统会自动使用 http://localhost:3000
```

#### 测试环境 (Vercel Preview)
```bash
# 不设置 NEXT_PUBLIC_SITE_URL
# 系统会自动使用 https://your-app-git-branch-username.vercel.app
```

#### 生产环境 (Vercel Production)
```bash
# 设置固定的生产域名
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

### 3. Vercel 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中：

- **Production**: 设置 `NEXT_PUBLIC_SITE_URL`
- **Preview**: 不设置 `NEXT_PUBLIC_SITE_URL`
- **Development**: 不设置 `NEXT_PUBLIC_SITE_URL`

## 验证修复

### 1. 查看控制台日志

登录时查看浏览器控制台，应该看到类似的日志：

```
[OAuth Login] OAuth login attempt: {
  provider: "github",
  forceReauth: true,
  redirectTo: "https://current-domain.com/auth/callback",
  baseUrl: "https://current-domain.com",
  currentOrigin: "https://current-domain.com",
  envSiteUrl: "https://production-domain.com"
}
```

### 2. 测试不同环境

- **开发环境**: 应该重定向到 `http://localhost:3000`
- **测试环境**: 应该重定向到当前的 Preview 域名
- **生产环境**: 应该重定向到配置的生产域名

## 常见问题

### Q: 为什么测试环境还是跳转到生产环境？

A: 检查以下几点：
1. 确保没有在 Vercel Preview 环境中设置 `NEXT_PUBLIC_SITE_URL`
2. 清除浏览器缓存和 cookies
3. 查看控制台日志确认重定向URL是否正确

### Q: 如何为特定的测试分支设置自定义域名？

A: 可以在 Vercel 中为特定分支设置环境变量：
```bash
NEXT_PUBLIC_SITE_URL=https://your-custom-test-domain.com
```

### Q: 生产环境OAuth不工作

A: 确保在OAuth提供商中配置了正确的回调URL：
- **GitHub**: `https://your-project.supabase.co/auth/v1/callback`
- **Google**: `https://your-project.supabase.co/auth/v1/callback`

## 调试工具

如果仍有问题，可以在浏览器控制台中运行：

```javascript
// 查看当前环境信息
console.log({
  currentOrigin: window.location.origin,
  envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  isLocalhost: window.location.origin.includes('localhost'),
  isVercelPreview: window.location.origin.includes('vercel.app') && window.location.origin.includes('-git-')
})
```

## 安全说明

- 修复后的逻辑更安全，防止了环境变量配置错误导致的重定向问题
- 每个环境都会使用适当的域名，避免了跨环境的安全风险
- 添加了警告日志，帮助开发者识别配置问题

如果你仍然遇到问题，请查看浏览器控制台的详细日志，或联系开发者。 