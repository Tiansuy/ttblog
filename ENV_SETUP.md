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
```

## 步骤 3: 替换占位符

将以下占位符替换为您的实际值：

- `https://your-project-ref.supabase.co` → 您的 Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → 您的实际密钥

## 安全注意事项

⚠️ **重要**: 
- 永远不要将 `service_role` 密钥暴露在客户端代码中
- 不要将 `.env.local` 文件提交到 Git 仓库
- `NEXT_PUBLIC_` 前缀的变量会暴露给客户端

## 验证配置

设置完成后，可以通过以下命令验证：

```bash
npm run dev
```

如果配置正确，应用应该能够正常启动而不会出现 Supabase 连接错误。 