# 第三方 OAuth 登录设置指南

本指南将帮助您在 TTBlog 中设置第三方 OAuth 登录功能，包括 GitHub、Google 和 QQ 登录。

## 前提条件

- 已完成基本的 Supabase 项目设置
- 已部署应用或有可访问的 URL（用于 OAuth 回调）

## 1. GitHub OAuth 设置

### 1.1 在 GitHub 中创建 OAuth 应用

1. 访问 [GitHub Settings](https://github.com/settings/developers)
2. 点击 "OAuth Apps" 标签
3. 点击 "New OAuth App"
4. 填写应用信息：
   - **Application name**: `TTBlog`
   - **Homepage URL**: `https://your-domain.com` 或 `http://localhost:3000`（开发环境）
   - **Authorization callback URL**: `https://qsgrrctlxrcflzuzalpi.supabase.co/auth/v1/callback`
5. 点击 "Register application"
6. 记录 **Client ID** 和 **Client Secret**

### 1.2 在 Supabase 中配置 GitHub

1. 进入 Supabase Dashboard
2. 导航到 "Authentication" → "Providers"
3. 找到 "GitHub" 并点击
4. 启用 GitHub 提供商
5. 输入从 GitHub 获取的：
   - **Client ID**
   - **Client Secret**
6. 点击 "Save"

## 2. Google OAuth 设置

### 2.1 在 Google Cloud Console 创建 OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API：
   - 导航到 "APIs & Services" → "Library"
   - 搜索 "Google+ API"
   - 点击启用
4. 创建 OAuth 凭据：
   - 导航到 "APIs & Services" → "Credentials"
   - 点击 "Create Credentials" → "OAuth client ID"
   - 应用类型选择 "Web application"
   - 填写信息：
     - **Name**: `TTBlog`
     - **Authorized JavaScript origins**: 
       - `https://your-domain.com`
       - `http://localhost:3000`（开发环境）
     - **Authorized redirect URIs**: 
       - `https://your-project.supabase.co/auth/v1/callback`
5. 记录 **Client ID** 和 **Client Secret**

### 2.2 在 Supabase 中配置 Google

1. 进入 Supabase Dashboard
2. 导航到 "Authentication" → "Providers"
3. 找到 "Google" 并点击
4. 启用 Google 提供商
5. 输入从 Google 获取的：
   - **Client ID**
   - **Client Secret**
6. 点击 "Save"

## 3. QQ OAuth 设置

> **注意**: Supabase 不原生支持 QQ 登录。有两种解决方案：

### 方案 A: 使用通用 OAuth 提供商（推荐）

如果您有 QQ 互联的应用：

1. 在 [QQ 互联](https://connect.qq.com/) 创建应用
2. 获取 App ID 和 App Key
3. 在 Supabase 中配置自定义 OAuth 提供商

### 方案 B: 自定义实现

使用 QQ 互联的 API 自己实现登录逻辑，然后调用 Supabase 的 `signInWithPassword` 或创建用户。

### 3.1 QQ 互联设置（如果选择方案 A）

1. 访问 [QQ 互联开放平台](https://connect.qq.com/)
2. 注册开发者账号
3. 创建网站应用
4. 填写应用信息：
   - **网站名称**: TTBlog
   - **网站地址**: `https://your-domain.com`
   - **回调地址**: `https://your-project.supabase.co/auth/v1/callback`
5. 审核通过后获取 App ID 和 App Key

## 4. 记住登录状态功能 🆕

TTBlog 现在支持"记住登录状态"功能，让用户可以选择登录体验：

### 4.1 功能说明

- **默认行为**: 记住登录状态未启用（更安全）
- **启用时**: 使用第三方平台的现有登录会话（如果有）
- **禁用时**: 每次登录都需要重新输入第三方平台的凭据

### 4.2 技术实现

- **GitHub**: 通过 `prompt=login` 参数控制是否强制重新验证
- **Google**: 通过 `prompt=login` 和 `access_type=offline` 参数控制
- **登出时**: 清除本地存储和 OAuth 提供商会话（部分支持）

### 4.3 用户界面

登录页面提供了一个复选框，允许用户选择是否记住登录状态：

```
☐ 记住登录状态
```

**选择建议**：
- ✅ **勾选**: 适合个人设备，提供便捷的登录体验
- ❌ **不勾选**: 适合共享设备或需要更高安全性的场景

## 5. 更新环境变量

如果需要在客户端使用额外的配置，可以在 `.env.local` 中添加：

```env
# GitHub OAuth (通常不需要在客户端)
# GITHUB_CLIENT_ID=your_github_client_id

# Google OAuth (如果需要额外配置)
# GOOGLE_CLIENT_ID=your_google_client_id

# QQ OAuth (如果使用自定义实现)
# QQ_APP_ID=your_qq_app_id
```

## 6. 测试 OAuth 登录

1. 启动开发服务器：`npm run dev`
2. 访问登录页面：`http://localhost:3000/login`
3. 测试不同的登录方式：
   - **不勾选"记住登录状态"**: 测试是否每次都要求输入凭据
   - **勾选"记住登录状态"**: 测试是否使用现有会话

## 7. 生产环境部署注意事项

### 7.1 更新回调 URL
部署到生产环境后，需要在各个 OAuth 提供商中更新回调 URL：

- **开发环境**: `https://your-project.supabase.co/auth/v1/callback`
- **生产环境**: `https://your-production-domain.com` （如果使用自定义域名）

### 7.2 域名白名单
确保在各个 OAuth 提供商中添加生产域名到授权域名列表。

## 8. 故障排除

### 常见问题

1. **"redirect_uri_mismatch" 错误**
   - 检查 OAuth 应用中的回调 URL 是否与 Supabase 回调 URL 匹配
   - 确保协议（http/https）正确

2. **"invalid_client" 错误**
   - 检查 Client ID 和 Client Secret 是否正确
   - 确保 OAuth 应用状态为活跃

3. **QQ 登录不工作**
   - QQ 互联需要企业认证或个人认证
   - 考虑使用微信登录作为替代方案

4. **登出后仍然自动登录** 🆕
   - 检查是否勾选了"记住登录状态"
   - 检查浏览器是否清除了相关 cookies
   - OAuth 提供商可能仍保持登录状态（这是正常的）

### 调试建议

1. 检查浏览器开发者工具的网络标签
2. 查看 Supabase Dashboard 的 Auth 日志
3. 确认环境变量设置正确
4. 测试"记住登录状态"功能是否按预期工作

## 9. 安全注意事项

1. **Client Secret 保护**
   - 永远不要在客户端代码中暴露 Client Secret
   - 定期轮换 OAuth 凭据

2. **回调 URL 验证**
   - 只添加必要的回调 URL
   - 使用 HTTPS（生产环境）

3. **权限范围**
   - 只请求必要的用户权限
   - 明确告知用户所需权限的用途

4. **会话管理** 🆕
   - 合理设置会话过期时间
   - 在共享设备上建议不勾选"记住登录状态"
   - 考虑用户的使用体验与安全性的平衡

---

设置完成后，用户就可以使用第三方账号快速登录您的 TTBlog 应用了！新的"记住登录状态"功能让用户可以根据使用场景选择合适的登录体验。 