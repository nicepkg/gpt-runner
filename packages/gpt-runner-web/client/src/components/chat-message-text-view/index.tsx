import ReactMarkdown from 'react-markdown'
import { type FC, memo } from 'react'
import remarkGfm from 'remark-gfm'
import type { PluginOptions } from 'react-markdown/lib/react-markdown'
import { isShallowDeepEqual } from '@nicepkg/gpt-runner-shared/common'
import type { MessageCodeBlockProps } from '../chat-message-code-block'
import { MessageCodeBlock } from '../chat-message-code-block'

export interface MessageTextViewProps extends Partial<MessageCodeBlockProps>, PluginOptions {
  contents: string
}

export const MessageTextView: FC<MessageTextViewProps> = memo((props) => {
  const {
    contents,
    remarkPlugins,
    rehypePlugins,
    remarkRehypeOptions,
    ...messageCodeBlockProps
  } = props

  return (
    <ReactMarkdown
      className='markdown-body'
      remarkPlugins={[remarkGfm, ...remarkPlugins || []]}
      rehypePlugins={rehypePlugins}
      remarkRehypeOptions={remarkRehypeOptions}
      components={{
        pre({ children, ...props }) {
          if (children.length !== 1) {
            // Not code block.
            return <pre {...props}>{children}</pre>
          }
          const child = children[0] as React.ReactElement
          const codeContents = child.props.children[0]
          const codeClassName = child.props.className
          const languageMatch
            = /language-(\w+)/.exec(codeClassName || '') || []
          return (
            <MessageCodeBlock
              {...messageCodeBlockProps}
              contents={codeContents}
              language={languageMatch[1] || ''}
            />
          )
        },
      }}
    >
      {contents}
    </ReactMarkdown>
  )
}, isShallowDeepEqual)

MessageTextView.displayName = 'MessageTextView'
