#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { join } from 'path';

config({ path: join(process.cwd(), '.env.local') });

const articles = [
  {
    title: "TailwindCSS: Utility-First CSS Framework Guide",
    excerpt: "Master TailwindCSS with this comprehensive guide covering utilities, responsive design, and best practices.",
    slug: "tailwindcss-guide",
    content: `# TailwindCSS: Utility-First CSS Framework Guide

TailwindCSS revolutionizes CSS development with its utility-first approach.

## Key Benefits
- 🚀 Rapid development with pre-built utilities
- 📱 Mobile-first responsive design
- ⚡ Optimized performance with purging
- 🎨 Consistent design system

## Quick Start
\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

## Core Utilities
\`\`\`html
<div class="bg-blue-500 text-white p-4 rounded-lg">
  <h1 class="text-2xl font-bold">Hello Tailwind!</h1>
</div>
\`\`\`

TailwindCSS enables rapid, consistent UI development.`,
    tags: ["CSS", "Frontend", "Design"]
  },
  {
    title: "TypeScript Advanced Patterns and Best Practices",
    excerpt: "Deep dive into TypeScript's type system, generics, and advanced patterns for building scalable applications.",
    slug: "typescript-advanced-patterns",
    content: `# TypeScript Advanced Patterns and Best Practices

TypeScript provides powerful type safety for JavaScript applications.

## Advanced Types
\`\`\`typescript
// Generic constraints
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(entity: T): T {
  return entity;
}

// Conditional types
type ApiResponse<T> = T extends string ? { message: T } : { data: T };
\`\`\`

## Utility Types
\`\`\`typescript
type PublicUser = Omit<User, 'password'>;
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
\`\`\`

TypeScript enables building robust, maintainable applications.`,
    tags: ["TypeScript", "Programming", "JavaScript"]
  },
  {
    title: "Vercel Deployment and Optimization Guide",
    excerpt: "Complete guide to deploying applications on Vercel with performance optimization and best practices.",
    slug: "vercel-deployment-guide",
    content: `# Vercel Deployment and Optimization Guide

Vercel provides seamless deployment for modern web applications.

## Key Features
- ⚡ Edge Network for global performance
- 🚀 Instant deployments from Git
- 🔄 Automatic scaling
- 📊 Built-in analytics

## Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
\`\`\`

## Environment Variables
\`\`\`javascript
// vercel.json
{
  "env": {
    "DATABASE_URL": "@database-url"
  }
}
\`\`\`

## Performance Optimization
- Enable Edge Functions
- Configure ISR (Incremental Static Regeneration)
- Use Image Optimization API
- Implement proper caching strategies

Vercel simplifies deployment while maximizing performance.`,
    tags: ["Vercel", "Deployment", "DevOps"]
  },
  {
    title: "Next.js 15: Complete Guide to React Meta-Framework",
    excerpt: "Comprehensive guide to Next.js 15 covering App Router, Server Components, and modern React patterns.",
    slug: "nextjs-15-complete-guide",
    content: `# Next.js 15: Complete Guide to React Meta-Framework

Next.js 15 introduces powerful features for modern React development.

## New Features
- 🏗️ App Router (stable)
- ⚡ Server Components
- 🔄 Streaming and Suspense
- 📦 Turbopack (beta)

## App Router Structure
\`\`\`
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── loading.tsx        # Loading UI
└── posts/
    ├── [slug]/
    │   └── page.tsx   # Dynamic route
    └── layout.tsx     # Nested layout
\`\`\`

## Server Components
\`\`\`tsx
// Server Component (default in app directory)
async function PostList() {
  const posts = await getPosts(); // Direct database access
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

## Data Fetching
\`\`\`tsx
// Fetch with caching
const posts = await fetch('/api/posts', {
  next: { revalidate: 3600 } // ISR
});

// Streaming
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PostList />
    </Suspense>
  );
}
\`\`\`

Next.js 15 represents the future of React development.`,
    tags: ["Next.js", "React", "Frontend"]
  },
  {
    title: "Supabase: Complete Backend-as-a-Service Guide",
    excerpt: "Master Supabase for building modern applications with PostgreSQL, real-time subscriptions, and authentication.",
    slug: "supabase-complete-guide",
    content: `# Supabase: Complete Backend-as-a-Service Guide

Supabase provides a complete backend solution for modern applications.

## Core Features
- 🗄️ PostgreSQL database
- 🔐 Authentication & authorization
- ⚡ Real-time subscriptions
- 📁 File storage
- 🔄 Auto-generated APIs

## Getting Started
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

\`\`\`typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);
\`\`\`

## Database Operations
\`\`\`typescript
// Insert data
const { data, error } = await supabase
  .from('posts')
  .insert({ title: 'Hello World', content: '...' });

// Query with filters
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });
\`\`\`

## Real-time Subscriptions
\`\`\`typescript
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'posts'
  }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
\`\`\`

## Authentication
\`\`\`typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// OAuth
await supabase.auth.signInWithOAuth({
  provider: 'github'
});
\`\`\`

Supabase accelerates full-stack development with minimal configuration.`,
    tags: ["Supabase", "Backend", "Database"]
  },
  {
    title: "Prisma: Modern Database Toolkit and ORM",
    excerpt: "Comprehensive guide to Prisma ORM covering schema design, queries, migrations, and best practices.",
    slug: "prisma-orm-guide",
    content: `# Prisma: Modern Database Toolkit and ORM

Prisma modernizes database access with type-safe queries and intuitive APIs.

## Key Benefits
- 🔒 Type-safe database access
- 📊 Auto-generated client
- 🔄 Database migrations
- 🔍 Powerful query engine

## Setup
\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Schema Definition
\`\`\`prisma
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

## Type-Safe Queries
\`\`\`typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create user with posts
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    posts: {
      create: [
        { title: 'Hello World', content: 'My first post' }
      ]
    }
  },
  include: {
    posts: true
  }
});

// Complex queries
const publishedPosts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      email: {
        contains: '@company.com'
      }
    }
  },
  include: {
    author: {
      select: {
        name: true,
        email: true
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
\`\`\`

## Migrations
\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

Prisma transforms database development with modern tooling and type safety.`,
    tags: ["Prisma", "Database", "ORM"]
  },
  {
    title: "LLM Fine-tuning: Complete Guide to Custom Models",
    excerpt: "Comprehensive guide to fine-tuning Large Language Models including techniques, tools, and best practices.",
    slug: "llm-fine-tuning-guide",
    content: `# LLM Fine-tuning: Complete Guide to Custom Models

Fine-tuning Large Language Models enables domain-specific AI applications.

## Why Fine-tune?
- 🎯 Domain-specific performance
- 💡 Task specialization
- 🔒 Data privacy and control
- ⚡ Improved efficiency

## Fine-tuning Approaches

### 1. Full Parameter Fine-tuning
- Updates all model parameters
- Requires significant compute resources
- Best performance for specific tasks

### 2. Parameter-Efficient Fine-tuning (PEFT)
- LoRA (Low-Rank Adaptation)
- Adapters
- Prompt tuning

\`\`\`python
# LoRA Example with Hugging Face
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.1,
)

model = get_peft_model(base_model, config)
\`\`\`

## Data Preparation
\`\`\`python
# Dataset format for instruction tuning
{
  "instruction": "Explain quantum computing",
  "input": "",
  "output": "Quantum computing uses quantum mechanics..."
}
\`\`\`

## Training Process
\`\`\`python
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    warmup_steps=100,
    learning_rate=2e-4,
    fp16=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

trainer.train()
\`\`\`

## Evaluation and Monitoring
- Perplexity scores
- Task-specific metrics
- Human evaluation
- Monitoring for catastrophic forgetting

Fine-tuning democratizes access to specialized AI capabilities.`,
    tags: ["AI", "Machine Learning", "NLP"]
  },
  {
    title: "Reinforcement Learning with GRPO: Advanced Policy Optimization",
    excerpt: "Deep dive into Generalized Reward Policy Optimization (GRPO) for advanced reinforcement learning applications.",
    slug: "grpo-reinforcement-learning",
    content: `# Reinforcement Learning with GRPO: Advanced Policy Optimization

Generalized Reward Policy Optimization (GRPO) represents cutting-edge advancement in RL.

## Understanding GRPO

GRPO extends traditional policy optimization with:
- 🎯 Generalized reward functions
- 🔄 Improved sample efficiency
- 🛡️ Robust policy updates
- ⚖️ Better exploration-exploitation balance

## Core Concepts

### Policy Gradient Methods
\`\`\`python
import torch
import torch.nn as nn
from torch.distributions import Categorical

class PolicyNetwork(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim),
            nn.Softmax(dim=-1)
        )
    
    def forward(self, state):
        return self.network(state)
    
    def select_action(self, state):
        probs = self.forward(state)
        dist = Categorical(probs)
        action = dist.sample()
        return action.item(), dist.log_prob(action)
\`\`\`

### GRPO Algorithm
\`\`\`python
def grpo_update(policy, states, actions, rewards, old_log_probs):
    # Compute advantage estimates
    advantages = compute_advantages(rewards)
    
    # Get new action probabilities
    new_log_probs = policy.get_log_probs(states, actions)
    
    # Compute importance sampling ratio
    ratio = torch.exp(new_log_probs - old_log_probs)
    
    # GRPO objective with generalized rewards
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1-epsilon, 1+epsilon) * advantages
    
    # Generalized reward term
    generalized_reward = compute_generalized_reward(states, actions)
    
    loss = -torch.min(surr1, surr2) - beta * generalized_reward
    
    return loss.mean()
\`\`\`

## Implementation Strategy

### Environment Setup
\`\`\`python
import gym
import numpy as np

class GRPOAgent:
    def __init__(self, env, lr=3e-4):
        self.env = env
        self.policy = PolicyNetwork(
            env.observation_space.shape[0],
            env.action_space.n
        )
        self.optimizer = torch.optim.Adam(
            self.policy.parameters(), lr=lr
        )
        
    def collect_experience(self, episodes=10):
        experiences = []
        for _ in range(episodes):
            state = self.env.reset()
            episode_exp = []
            
            while True:
                action, log_prob = self.policy.select_action(
                    torch.FloatTensor(state)
                )
                next_state, reward, done, _ = self.env.step(action)
                
                episode_exp.append({
                    'state': state,
                    'action': action,
                    'reward': reward,
                    'log_prob': log_prob
                })
                
                if done:
                    break
                state = next_state
            
            experiences.extend(episode_exp)
        return experiences
\`\`\`

## Advanced Techniques

### Multi-Objective Optimization
- Pareto-optimal policies
- Reward shaping
- Hierarchical objectives

### Sample Efficiency Improvements
- Experience replay
- Importance sampling
- Off-policy corrections

## Applications
- Robotics control
- Game playing
- Resource allocation
- Financial trading

GRPO advances the state-of-the-art in policy optimization for complex decision-making tasks.`,
    tags: ["AI", "Reinforcement Learning", "Machine Learning"]
  }
];

async function addAllArticles() {
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

    console.log('🚀 Adding all 8 learning articles...\n');

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`📝 Adding ${i + 1}/8: ${article.title}`);
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          slug: article.slug,
          status: 'published',
          published_at: new Date().toISOString(),
          tags: article.tags
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️  Skipped ${article.title} (already exists)`);
        } else {
          console.error(`❌ Error adding ${article.title}:`, error.message);
        }
      } else {
        console.log(`✅ Added: ${article.title}`);
      }
    }

    console.log('\n🎉 All learning articles processing completed!');
    console.log('\n📚 Articles added:');
    articles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
      console.log(`      📎 slug: ${article.slug}`);
      console.log(`      🔗 URL: /posts/${article.slug}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addAllArticles(); 