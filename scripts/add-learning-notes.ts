#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { join } from 'path';

// 加载环境变量
config({ path: join(process.cwd(), '.env.local') });

const learningNotes = [
  {
    title: "TailwindCSS: A Complete Guide to Utility-First CSS",
    excerpt: "Master TailwindCSS with this comprehensive guide covering installation, configuration, best practices, and advanced techniques for modern web development.",
    slug: "tailwindcss-complete-guide",
    content: `# TailwindCSS: A Complete Guide to Utility-First CSS

TailwindCSS has revolutionized the way we write CSS by introducing a **utility-first approach**. This guide will take you through everything you need to know about TailwindCSS.

## What is TailwindCSS?

TailwindCSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing custom CSS.

### Key Benefits

- 🚀 **Rapid Development** - Build interfaces faster with pre-built utilities
- 📱 **Responsive Design** - Mobile-first responsive design system
- 🎨 **Design System** - Consistent spacing, colors, and typography
- ⚡ **Performance** - Only include CSS you actually use
- 🔧 **Customizable** - Extend and customize everything

## Installation and Setup

\`\`\`bash
# Install TailwindCSS
npm install -D tailwindcss
npx tailwindcss init

# With Next.js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Core Concepts

### Utility Classes
\`\`\`html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  <h1 class="text-2xl font-bold mb-2">Hello TailwindCSS!</h1>
  <p class="text-blue-100">This is a utility-first approach.</p>
</div>
\`\`\`

### Responsive Design
\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive grid item
</div>
\`\`\`

## Advanced Features

### Custom Configuration
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981'
      },
      fontFamily: {
        custom: ['Inter', 'sans-serif']
      }
    }
  }
}
\`\`\`

### Component Classes with @apply
\`\`\`css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
\`\`\`

## Best Practices

1. **Use Semantic HTML** - Always start with proper HTML structure
2. **Compose Utilities** - Combine utilities for complex designs
3. **Extract Components** - Use @apply for repeated patterns
4. **Leverage Design Tokens** - Use Tailwind's design system
5. **Optimize for Production** - Purge unused CSS

## Performance Optimization

\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  // ... other config
}
\`\`\`

TailwindCSS is more than just a CSS framework - it's a design system that helps you build consistent, maintainable, and scalable user interfaces.`,
    tags: ["CSS", "Frontend", "Web Development", "Design System"]
  },
  {
    title: "TypeScript Mastery: From Basics to Advanced Patterns",
    excerpt: "A comprehensive TypeScript guide covering type system, generics, advanced patterns, and best practices for building type-safe applications.",
    slug: "typescript-mastery-guide",
    content: `# TypeScript Mastery: From Basics to Advanced Patterns

TypeScript has become the **standard for modern web development**, providing type safety and enhanced developer experience. Let's explore TypeScript from fundamentals to advanced patterns.

## Why TypeScript?

- 🛡️ **Type Safety** - Catch errors at compile time
- 🔧 **Better Tooling** - Enhanced IDE support and autocompletion
- 📖 **Self-Documenting** - Types serve as documentation
- 🚀 **Scalability** - Better for large applications
- 🔄 **Gradual Adoption** - Can be adopted incrementally

## Basic Types

\`\`\`typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

const user: User = {
  id: 1,
  name: "John Doe"
};
\`\`\`

## Advanced Types

### Union and Intersection Types
\`\`\`typescript
// Union types
type Status = "pending" | "approved" | "rejected";

// Intersection types
type Person = {
  name: string;
  age: number;
};

type Employee = Person & {
  employeeId: string;
  department: string;
};
\`\`\`

### Generics
\`\`\`typescript
// Generic functions
function identity<T>(arg: T): T {
  return arg;
}

// Generic interfaces
interface Repository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// Generic constraints
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(entity: T): T {
  // Implementation
  return entity;
}
\`\`\`

## Utility Types

\`\`\`typescript
// Built-in utility types
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
type CreateUser = Omit<User, 'id'>;

// Custom utility types
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
\`\`\`

## Advanced Patterns

### Conditional Types
\`\`\`typescript
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { count: T }
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { count: number }
\`\`\`

### Mapped Types
\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
\`\`\`

## Best Practices

1. **Enable Strict Mode** - Use strict compiler options
2. **Prefer Interfaces over Types** - For object shapes
3. **Use Type Guards** - For runtime type checking
4. **Leverage Type Assertions Carefully** - Only when necessary
5. **Document Complex Types** - Add comments for clarity

## Configuration

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
\`\`\`

TypeScript isn't just about adding types to JavaScript - it's about building more reliable, maintainable, and scalable applications.`,
    tags: ["TypeScript", "JavaScript", "Programming", "Type Safety"]
  }
];

async function addLearningNotes() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🚀 Adding learning notes...\n');

    for (const note of learningNotes) {
      console.log(`📝 Adding: ${note.title}`);
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: note.title,
          excerpt: note.excerpt,
          content: note.content,
          slug: note.slug,
          status: 'published',
          published_at: new Date().toISOString(),
          tags: note.tags
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error adding ${note.title}:`, error);
      } else {
        console.log(`✅ Added: ${note.title}`);
      }
    }

    console.log('\n🎉 All learning notes added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addLearningNotes(); 