# TTBlog - Personal CMS

A modern personal content management system built with Next.js 15, Supabase, and MDX.

## ✨ Features

- 📝 **MDX Content** - Write in Markdown with JSX components
- 🌙 **Dark Mode** - System preference detection
- 📱 **Responsive Design** - Mobile-first approach  
- ⚡ **Server Components** - Next.js 15 App Router
- 🔐 **Row Level Security** - Supabase RLS policies
- 🎨 **Beautiful UI** - TailwindCSS + ShadCN/UI
- 🚀 **Fast Performance** - Optimized loading and rendering
- 🔑 **OAuth Login** - GitHub, Google, and QQ login support

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router + Server Actions)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS + ShadCN/UI
- **Content**: MDX (Markdown + JSX)
- **Authentication**: Supabase Auth + OAuth providers
- **State Management**: Zustand
- **Form Handling**: React Hook Form

## 🚀 Quick Start

**⚡ 5-Minute Setup**: Follow **[QUICK_SETUP.md](./QUICK_SETUP.md)** for the fastest way to get started!

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ttblog.git
   cd ttblog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create `.env.local` with your Supabase credentials
   - See [ENV_SETUP.md](./ENV_SETUP.md) for details

4. **Set up database**
   - Run the SQL script from [QUICK_SETUP.md](./QUICK_SETUP.md) in Supabase
   - Initialize sample data: `npm run db:init`

5. **Configure OAuth providers (Optional)**
   - Follow [OAUTH_SETUP.md](./OAUTH_SETUP.md) for third-party login setup
   - Supports GitHub, Google, and QQ login

6. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## 📚 Documentation

- **[QUICK_SETUP.md](./QUICK_SETUP.md)** - ⚡ 5-minute setup guide
- **[PROJECT_SETUP.md](./PROJECT_SETUP.md)** - Complete setup guide
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variables guide  
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Database setup guide
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - 🆕 Third-party login setup

## 🔐 Authentication

TTBlog supports multiple authentication methods:

- **Email/Password** - Traditional login with email and password
- **GitHub OAuth** - Login with GitHub account
- **Google OAuth** - Login with Google account  
- **QQ Login** - QQ login support (custom implementation)

See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed configuration instructions.

## 📝 Content Management

Articles are stored in Supabase and written in MDX format. The content supports:

- Standard Markdown syntax
- Code syntax highlighting  
- Custom React components
- Tables, quotes, lists, and more

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:init` - Initialize database with sample data
- `npm run db:reset` - Reset database data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Next.js](https://nextjs.org) and [Supabase](https://supabase.com)


```
# git for local merge
git checkout main
git pull origin main
git checkout -b feature/add-login-page
# 开发中...
git add .
git commit -m "xxx"
# （可选：也可以 push 备份到远程）
git push origin feature/add-login-page

# 开发完成后：
git checkout main
git pull origin main
git merge feature/add-login-page
git push origin main
git branch -d feature/add-login-page
git push origin --delete feature/add-login-page
```

```
# git for cooperation pr
git checkout main
git pull origin main
git checkout -b feature/add-login-page
# 开发中...
git add .
git commit -m "xxx"
git push origin feature/add-login-page

# 开发完成后：
# 在远程仓库发起 PR（feature/add-login-page -> main）
# 审查通过后在远程点击 Merge

# 合并完成后，同步本地 main 分支：
git checkout main
git pull origin main
git branch -d feature/add-login-page
git push origin --delete feature/add-login-page
```