import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

// 自定义代码块组件
function Code({ children, ...props }: any) {
  const codeHTML = highlight(children)
  return (
    <code 
      className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      dangerouslySetInnerHTML={{ __html: codeHTML }} 
      {...props} 
    />
  )
}

// 自定义预格式化组件
function Pre({ children, ...props }: any) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100 dark:bg-gray-800 dark:text-gray-200" {...props}>
      {children}
    </pre>
  )
}

// MDX 组件映射
const components = {
  h1: (props: any) => (
    <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-4 mt-8 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 leading-7 text-gray-800 dark:text-gray-300" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />
  ),
  li: (props: any) => (
    <li className="leading-7 text-gray-800 dark:text-gray-300" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="mb-4 border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 italic text-gray-700 dark:bg-blue-900/20 dark:text-gray-400" {...props} />
  ),
  code: Code,
  pre: Pre,
  a: (props: any) => (
    <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" {...props} />
  ),
  hr: (props: any) => (
    <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  em: (props: any) => (
    <em className="italic text-gray-800 dark:text-gray-300" {...props} />
  ),
}

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <MDXRemote source={content} components={components} />
    </div>
  )
} 