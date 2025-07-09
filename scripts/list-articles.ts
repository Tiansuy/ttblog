import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function listArticles() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ 缺少必要的环境变量');
      return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('📋 查询数据库中的所有文章...\n');

    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, published_at, status')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查询失败:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('📄 数据库中没有文章');
      return;
    }

    console.log(`📊 找到 ${posts.length} 篇文章:\n`);

    posts.forEach((post, index) => {
      const publishDate = post.published_at 
        ? new Date(post.published_at).toLocaleString('zh-CN')
        : '未发布';
      
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   状态: ${post.status}`);
      console.log(`   发布时间: ${publishDate}`);
      console.log('');
    });

  } catch (error) {
    console.error('💥 查询过程出错:', error);
  }
}

listArticles(); 