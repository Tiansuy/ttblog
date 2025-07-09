import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 语言资源
const resources = {
  en: {
    translation: {
      // 网站基本信息
      site: {
        title: "TTBlog - Personal CMS",
        description: "A modern personal content management system",
        home: "Home",
        posts: "Posts",
        about: "About",
        aboutSite: "About Site",
        aboutMe: "About Me",
        admin: "Admin"
      },
      // 首页相关
      home: {
        title: "Welcome to TTBlog",
        subtitle: "A modern personal content management system built with Next.js, Supabase and more. Share technical insights and document learning journeys.",
        browsePosts: "Browse Articles",
        learnMore: "Learn More",
        features: {
          title: "Technical Features",
          subtitle: "Modern tech stack providing excellent reading and management experience",
          modernTech: {
            title: "Modern Tech Stack",
            description: "Built with Next.js 15, TypeScript, Tailwind CSS for excellent developer experience"
          },
          richContent: {
            title: "Rich Content",
            description: "Covers frontend development, backend technology, AI machine learning and more technical domains"
          },
          studyNotes: {
            title: "Study Notes",
            description: "Document technical learning process, share practical experience and best practices"
          },
          openSharing: {
            title: "Open Sharing",
            description: "Multi-language support, open source project, welcome technical exchange and knowledge sharing"
          }
        },
        cta: {
          title: "Start Exploring",
          subtitle: "Browse our technical articles and discover valuable content",
          viewAllPosts: "View All Articles"
        }
      },
      // 文章相关
      posts: {
        title: "All Articles",
        subtitle: "Explore our collection of technical articles covering frontend development, backend technology, AI and machine learning.",
        foundArticles: "Found {{count}} articles",
        readMore: "Read More",
        noPostsFound: "No articles published yet. Please run the initialization script to add sample articles.",
        loading: "Loading posts...",
        publishedAt: "Published at",
        views: "{{count}} view",
        views_other: "{{count}} views",
        likes: "{{count}} like",
        likes_other: "{{count}} likes",
        tags: "Tags",
        backToHome: "Back to Home",
        runInitScript: "npm run db:init",
        // 筛选和排序
        filters: {
          search: "Search articles...",
          sortBy: "Sort by",
          sortByTime: "Published Date",
          sortByViews: "Views",
          sortDesc: "Newest First",
          sortAsc: "Oldest First",
          sortViewsDesc: "Most Views",
          sortViewsAsc: "Least Views",
          filterByTags: "Filter by Tags",
          allTags: "All Tags",
          clearFilters: "Clear Filters",
          noResults: "No articles match your filters"
        },
        // 分页
        pagination: {
          page: "Page {{current}} of {{total}}",
          itemsPerPage: "Items per page",
          showing: "Showing {{start}}-{{end}} of {{total}} articles",
          first: "First",
          previous: "Previous", 
          next: "Next",
          last: "Last",
          goToPage: "Go to page"
        }
      },
      // 关于页面
      about: {
        site: {
          title: "About TTBlog",
          subtitle: "A modern blog platform focused on technical sharing",
          projectIntro: {
            title: "Project Introduction",
            subtitle: "TTBlog is a personal blog system built with modern tech stack",
            description1: "This blog platform focuses on technical content sharing, covering frontend development, backend technology, artificial intelligence, machine learning and other technical domains. We are committed to providing high-quality technical articles, study notes and practical tutorials.",
            description2: "Through modern tech stack, we provide excellent reading experience, fast loading speed, and complete content management features. Supports Chinese and English bilingual to meet different users' reading needs."
          },
          techStack: {
            title: "Tech Stack",
            subtitle: "Built with the latest technologies to ensure performance and developer experience",
            frontend: "Frontend Technologies",
            backend: "Backend Services",
            frontendList: [
              "Next.js 15 - React meta-framework",
              "TypeScript - Type safety",
              "Tailwind CSS - Styling framework",
              "i18next - Internationalization support"
            ],
            backendList: [
              "Supabase - Backend as a Service",
              "PostgreSQL - Database",
              "Row Level Security - Security policies",
              "Real-time - Real-time updates"
            ]
          },
          features: {
            title: "Main Features",
            subtitle: "Designed for technical writing and content management",
            contentManagement: "Content Management",
            userExperience: "User Experience",
            contentList: [
              "Rich text editor",
              "Tag system",
              "Image upload",
              "Draft saving"
            ],
            experienceList: [
              "Responsive design",
              "Dark mode support",
              "Multi-language switching",
              "Fast search"
            ]
          }
        },
        me: {
          title: "About Me",
          subtitle: "Full-stack developer passionate about technology and sharing",
          intro: {
            title: "Introduction",
            content: "Hello! I'm a full-stack developer passionate about modern web technologies. I enjoy exploring new technologies, building useful applications, and sharing knowledge with the community."
          },
          skills: {
            title: "Technical Skills",
            frontend: "Frontend Development",
            backend: "Backend Development",
            tools: "Tools & Others",
            frontendList: [
              "React / Next.js / Vue.js",
              "TypeScript / JavaScript",
              "Tailwind CSS / SCSS",
              "React Query / Zustand"
            ],
            backendList: [
              "Node.js / Python",
              "PostgreSQL / MongoDB",
              "Supabase / Firebase",
              "RESTful API / GraphQL"
            ],
            toolsList: [
              "Git / GitHub Actions",
              "Docker / Vercel",
              "VS Code / Cursor",
              "Figma / Linear"
            ]
          },
          interests: {
            title: "Interests & Focus",
            list: [
              "🚀 Modern web development frameworks",
              "🤖 AI and machine learning applications",
              "🛠️ Developer tools and productivity",
              "📚 Technical writing and knowledge sharing"
            ]
          },
          contact: {
            title: "Get in Touch",
            content: "Feel free to reach out if you want to collaborate on projects, have questions about the articles, or just want to chat about technology!",
            github: "GitHub",
            email: "Email",
            twitter: "Twitter"
          }
        }
      },
      // 认证相关
      auth: {
        login: "Login",
        logout: "Logout",
        email: "Email",
        password: "Password",
        loginWithEmail: "Login with Email",
        loginWithGithub: "Login with GitHub",
        loginWithGoogle: "Login with Google",
        loginWithQQ: "Login with QQ (Coming Soon)",
        rememberLogin: "Remember my login",
        loginSuccess: "Login successful",
        loginFailed: "Login failed",
        logoutSuccess: "Logout successful",
        loading: "Loading...",
        authenticating: "Authenticating...",
        adminLogin: "Administrator Login",
        selectLoginMethod: "Please select a login method to access the admin panel",
        qqLoginNotImplemented: "QQ login is not yet implemented. Please use GitHub or Google login, or contact the administrator.",
        loggingIn: "Logging in...",
        orLoginWithEmail: "Or login with email"
      },
      // 管理后台
      admin: {
        title: "Admin Dashboard",
        description: "Manage your blog content and site settings",
        administrator: "Administrator",
        postManagement: "Post Management",
        commentManagement: "Comment Management",
        siteSettings: "Site Settings",
        createPost: "Create Post",
        editPost: "Edit Post",
        deletePost: "Delete Post",
        publishPost: "Publish Post",
        unpublishPost: "Unpublish Post",
        posts: "Posts",
        draft: "Draft",
        published: "Published",
        archived: "Archived",
        inDevelopment: "Feature in development...",
        accessDenied: "Access denied. Administrator privileges required.",
        backToSite: "Back to Site",
        manageComments: "Manage website comments and messages",
        configureWebsite: "Configure website basic information and parameters"
      },
      // 表单相关
      form: {
        title: "Title",
        excerpt: "Excerpt",
        content: "Content",
        coverImage: "Cover Image",
        slug: "Slug",
        tags: "Tags",
        status: "Status",
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        update: "Update",
        required: "This field is required",
        uploading: "Uploading...",
        uploadImage: "Upload Image",
        selectImage: "Select Image"
      },
      // 通用消息
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        confirmation: "Confirmation",
        yes: "Yes",
        no: "No",
        ok: "OK",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        create: "Create",
        update: "Update",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        settings: "Settings",
        help: "Help & Support",
        moreOptions: "More options",
        changeLanguage: "Change language",
        toggleTheme: "Toggle theme"
      },
      // 错误页面
      error: {
        pageTitle: "Oops! Something went wrong",
        description: "We encountered an unexpected error. This could be a temporary issue.",
        suggestion: "Please try refreshing the page or go back to the homepage.",
        backToHome: "Back to Homepage",
        tryAgain: "Try Again",
        contactSupport: "If the problem persists, please contact support."
      },
      // 404页面
      notFound: {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist or has been moved.",
        backToHome: "Back to Homepage"
      }
    }
  },
  zh: {
    translation: {
      // 网站基本信息
      site: {
        title: "TTBlog - 个人内容管理系统",
        description: "现代化个人内容管理系统",
        home: "首页",
        posts: "文章",
        about: "关于",
        aboutSite: "关于本站",
        aboutMe: "关于我",
        admin: "管理"
      },
      // 首页相关
      home: {
        title: "欢迎来到 TTBlog",
        subtitle: "一个现代化的个人内容管理系统，使用 Next.js、Supabase 等技术构建。分享技术见解，记录学习历程。",
        browsePosts: "浏览文章",
        learnMore: "了解更多",
        features: {
          title: "技术特色",
          subtitle: "现代化的技术栈，提供优秀的阅读和管理体验",
          modernTech: {
            title: "现代技术栈",
            description: "基于 Next.js 15、TypeScript、Tailwind CSS 构建，提供优秀的开发体验"
          },
          richContent: {
            title: "丰富内容",
            description: "涵盖前端开发、后端技术、AI 机器学习等多个技术领域的深度文章"
          },
          studyNotes: {
            title: "学习笔记",
            description: "记录技术学习过程，分享实用经验和最佳实践"
          },
          openSharing: {
            title: "开放分享",
            description: "支持多语言，开源项目，欢迎技术交流和知识分享"
          }
        },
        cta: {
          title: "开始探索",
          subtitle: "浏览我们的技术文章，发现有价值的内容",
          viewAllPosts: "查看所有文章"
        }
      },
      // 文章相关
      posts: {
        title: "所有文章",
        subtitle: "探索我们的技术文章集合，涵盖前端开发、后端技术、AI 和机器学习等多个领域。",
        foundArticles: "共找到 {{count}} 篇文章",
        readMore: "阅读更多",
        noPostsFound: "暂无文章发布。请运行初始化脚本来添加示例文章。",
        loading: "加载文章中...",
        publishedAt: "发布于",
        views: "{{count}} 次浏览",
        views_other: "{{count}} 次浏览",
        likes: "{{count}} 个赞",
        likes_other: "{{count}} 个赞",
        tags: "标签",
        backToHome: "返回首页",
        runInitScript: "npm run db:init",
        // 筛选和排序
        filters: {
          search: "搜索文章...",
          sortBy: "排序方式",
          sortByTime: "发布时间",
          sortByViews: "浏览量",
          sortDesc: "最新优先",
          sortAsc: "最早优先",
          sortViewsDesc: "浏览量最多",
          sortViewsAsc: "浏览量最少",
          filterByTags: "按标签筛选",
          allTags: "所有标签",
          clearFilters: "清除筛选",
          noResults: "没有符合条件的文章"
        },
        // 分页
        pagination: {
          page: "第 {{current}} 页，共 {{total}} 页",
          itemsPerPage: "每页显示",
          showing: "显示第 {{start}}-{{end}} 条，共 {{total}} 篇文章",
          first: "首页",
          previous: "上一页",
          next: "下一页",
          last: "末页",
          goToPage: "跳转到第"
        }
      },
      // 关于页面
      about: {
        site: {
          title: "关于 TTBlog",
          subtitle: "一个专注于技术分享的现代化博客平台",
          projectIntro: {
            title: "项目简介",
            subtitle: "TTBlog 是一个使用现代技术栈构建的个人博客系统",
            description1: "这个博客平台专注于技术内容分享，涵盖前端开发、后端技术、人工智能、机器学习等多个技术领域。我们致力于提供高质量的技术文章、学习笔记和实用教程。",
            description2: "通过现代化的技术栈，我们提供了优秀的阅读体验、快速的加载速度，以及完善的内容管理功能。支持中英文双语，适应不同用户的阅读需求。"
          },
          techStack: {
            title: "技术栈",
            subtitle: "使用最新的技术构建，确保性能和开发体验",
            frontend: "前端技术",
            backend: "后端服务",
            frontendList: [
              "Next.js 15 - React 元框架",
              "TypeScript - 类型安全",
              "Tailwind CSS - 样式框架",
              "i18next - 国际化支持"
            ],
            backendList: [
              "Supabase - 后端即服务",
              "PostgreSQL - 数据库",
              "Row Level Security - 安全策略",
              "Real-time - 实时更新"
            ]
          },
          features: {
            title: "主要功能",
            subtitle: "为技术写作和内容管理而设计",
            contentManagement: "内容管理",
            userExperience: "用户体验",
            contentList: [
              "富文本编辑器",
              "标签系统",
              "图片上传",
              "草稿保存"
            ],
            experienceList: [
              "响应式设计",
              "深色模式支持",
              "多语言切换",
              "快速搜索"
            ]
          }
        },
        me: {
          title: "关于我",
          subtitle: "热爱技术和分享的全栈开发者",
          intro: {
            title: "个人介绍",
            content: "您好！我是一名对现代Web技术充满热情的全栈开发者。我喜欢探索新技术、构建有用的应用程序，并与社区分享知识。"
          },
          skills: {
            title: "技术技能",
            frontend: "前端开发",
            backend: "后端开发", 
            tools: "工具与其他",
            frontendList: [
              "React / Next.js / Vue.js",
              "TypeScript / JavaScript",
              "Tailwind CSS / SCSS",
              "React Query / Zustand"
            ],
            backendList: [
              "Node.js / Python",
              "PostgreSQL / MongoDB",
              "Supabase / Firebase",
              "RESTful API / GraphQL"
            ],
            toolsList: [
              "Git / GitHub Actions",
              "Docker / Vercel",
              "VS Code / Cursor",
              "Figma / Linear"
            ]
          },
          interests: {
            title: "兴趣与专注",
            list: [
              "🚀 现代Web开发框架",
              "🤖 AI和机器学习应用",
              "🛠️ 开发者工具和生产力",
              "📚 技术写作和知识分享"
            ]
          },
          contact: {
            title: "联系方式",
            content: "如果您想要合作项目、对文章有疑问，或者只是想聊聊技术，欢迎随时联系我！",
            github: "GitHub",
            email: "邮箱",
            twitter: "Twitter"
          }
        }
      },
      // 认证相关
      auth: {
        login: "登录",
        logout: "退出",
        email: "邮箱",
        password: "密码",
        loginWithEmail: "邮箱登录",
        loginWithGithub: "GitHub 登录",
        loginWithGoogle: "Google 登录",
        loginWithQQ: "使用 QQ 登录 (即将推出)",
        rememberLogin: "记住登录状态",
        loginSuccess: "登录成功",
        loginFailed: "登录失败",
        logoutSuccess: "退出成功",
        loading: "加载中...",
        authenticating: "认证中...",
        adminLogin: "管理员登录",
        selectLoginMethod: "请选择登录方式以访问管理后台",
        qqLoginNotImplemented: "QQ 登录功能暂未实现。请使用 GitHub 或 Google 登录，或联系管理员。",
        loggingIn: "登录中...",
        orLoginWithEmail: "或使用邮箱登录"
      },
      // 管理后台
      admin: {
        title: "管理后台",
        description: "管理您的博客内容和站点设置",
        administrator: "管理员",
        postManagement: "文章管理",
        commentManagement: "评论管理",
        siteSettings: "站点设置",
        createPost: "创建文章",
        editPost: "编辑文章",
        deletePost: "删除文章",
        publishPost: "发布文章",
        unpublishPost: "取消发布",
        posts: "文章",
        draft: "草稿",
        published: "已发布",
        archived: "已归档",
        inDevelopment: "功能开发中...",
        accessDenied: "访问被拒绝。需要管理员权限。",
        backToSite: "返回网站",
        manageComments: "管理网站评论和留言",
        configureWebsite: "配置网站的基本信息和参数"
      },
      // 表单相关
      form: {
        title: "标题",
        excerpt: "摘要",
        content: "内容",
        coverImage: "封面图片",
        slug: "路径",
        tags: "标签",
        status: "状态",
        save: "保存",
        cancel: "取消",
        submit: "提交",
        delete: "删除",
        edit: "编辑",
        create: "创建",
        update: "更新",
        required: "此字段为必填项",
        uploading: "上传中...",
        uploadImage: "上传图片",
        selectImage: "选择图片"
      },
      // 通用消息
      common: {
        loading: "加载中...",
        error: "错误",
        success: "成功",
        confirmation: "确认",
        yes: "是",
        no: "否",
        ok: "确定",
        cancel: "取消",
        save: "保存",
        edit: "编辑",
        delete: "删除",
        create: "创建",
        update: "更新",
        search: "搜索",
        filter: "筛选",
        sort: "排序",
        settings: "设置",
        help: "帮助与支持",
        moreOptions: "更多选项",
        changeLanguage: "切换语言",
        toggleTheme: "切换主题"
      },
      // 错误页面
      error: {
        pageTitle: "哎呀！出现了问题",
        description: "我们遇到了一个意外错误。这可能是一个临时问题。",
        suggestion: "请尝试刷新页面或返回首页。",
        backToHome: "返回首页",
        tryAgain: "重试",
        contactSupport: "如果问题持续存在，请联系技术支持。"
      },
      // 404页面
      notFound: {
        title: "页面未找到",
        description: "您要查找的页面不存在或已被移动。",
        backToHome: "返回首页"
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'zh' : 'zh', // 默认中文
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false // React 已经处理了 XSS
    },
    debug: process.env.NODE_ENV === 'development'
  })

export default i18n 