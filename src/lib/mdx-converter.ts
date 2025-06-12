import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import TurndownService from 'turndown'

// MDX转HTML（用于加载到TipTap编辑器）
export async function mdxToHtml(mdxContent: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm) // 支持GitHub Flavored Markdown
      .use(remarkHtml, { sanitize: false }) // 允许HTML标签
      .process(mdxContent)
    
    return result.toString()
  } catch (error) {
    console.error('MDX转HTML失败:', error)
    return mdxContent // 如果转换失败，返回原始内容
  }
}

// HTML转Markdown（用于从TipTap保存到数据库）
export function htmlToMarkdown(htmlContent: string): string {
  try {
    const turndownService = new TurndownService({
      headingStyle: 'atx', // 使用 # 风格的标题
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced', // 使用 ``` 风格的代码块
      emDelimiter: '*', // 使用 * 表示斜体
      strongDelimiter: '**', // 使用 ** 表示粗体
    })

    // 自定义规则：保持代码块的语言标识
    turndownService.addRule('codeBlock', {
      filter: function (node: any) {
        return (
          node.nodeName === 'PRE' &&
          node.firstChild &&
          node.firstChild.nodeName === 'CODE'
        )
      },
      replacement: function (_content: any, node: any) {
        const codeElement = node.firstChild as HTMLElement
        const language = codeElement.className.replace('language-', '') || ''
        return '\n\n```' + language + '\n' + codeElement.textContent + '\n```\n\n'
      }
    })

    // 自定义规则：处理图片
    turndownService.addRule('image', {
      filter: 'img',
      replacement: function (_content: any, node: any) {
        const alt = node.alt || ''
        const src = node.src || ''
        const title = node.title || ''
        const titlePart = title ? ` "${title}"` : ''
        return `![${alt}](${src}${titlePart})`
      }
    })

    return turndownService.turndown(htmlContent)
  } catch (error) {
    console.error('HTML转Markdown失败:', error)
    return htmlContent // 如果转换失败，返回原始内容
  }
} 