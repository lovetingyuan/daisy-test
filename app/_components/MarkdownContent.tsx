import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/prism/a11y-dark'
import CodeRunner from './CodeRunner'
import remarkGfm from 'remark-gfm'
import { memo, useDeferredValue } from 'react'

const highlightStyle = a11yDark

const components = {
  pre(props: { children?: React.ReactNode; className?: string }) {
    // @ts-expect-error ignore this
    const codeProps = props.children?.props
    const isCode = codeProps?.node.tagName === 'code'
    const lang = isCode ? /language-(\w+)/.exec(codeProps?.className || '')?.[1] : null
    const code = isCode ? codeProps?.children : null
    return (
      <pre
        className={`${
          props.className ?? ''
        } overflow-auto text-base before:-ml-5 bg-[rgb(43,43,43)] p-4 mockup-code`}
      >
        <CodeRunner code={code} language={lang ?? null} />
        {props.children}
      </pre>
    )
  },
  code(props: { children?: React.ReactNode; className?: string }) {
    const { children, className } = props
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <SyntaxHighlighter
        PreTag="div"
        className="!px-0 !pt-0 !pb-2 !m-0 text-base"
        useInlineStyles
        language={match[1]}
        style={highlightStyle}
      >
        {typeof children === 'string' ? children.replace(/\n$/, '') : 'children is not string'}
      </SyntaxHighlighter>
    ) : (
      <code className={className}>{children}</code>
    )
  },
}

const remarkPlugins = [remarkGfm]

const ReactMarkdown = memo(Markdown)
const cls = `prose prose-sm prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs prose-ul:pl-3 prose-li:pl-0 prose-p:my-3 prose-hr:my-6 prose-pre:my-3 max-w-full `

export default function MarkdownContent({ children }: React.PropsWithChildren) {
  console.log('MarkdownContent render')
  const markdown = useDeferredValue(children)
  if (typeof markdown !== 'string') {
    return null
  }
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} className={cls} components={components}>
      {markdown}
    </ReactMarkdown>
  )
}
