import type { FC } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { CodeBlockHeader, CodeBlockWrapper } from './chat-message-code-block.styles'
import { vscodeDarkPlus } from './dark-code-style'
import { oneLight } from './light-code-style'

export interface BuildCodeToolbarState {
  contents: string
}

export type MessageCodeBlockTheme = 'light' | 'dark'

export interface MessageCodeBlockProps {
  theme?: MessageCodeBlockTheme
  contents: string
  language: string
  buildCodeToolbar?: (state: BuildCodeToolbarState) => React.ReactNode
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = (props) => {
  const { theme = 'dark', contents, language, buildCodeToolbar } = props

  return (
    <CodeBlockWrapper className='msg-code-block'>
      {buildCodeToolbar && <CodeBlockHeader>
        {buildCodeToolbar({ contents })}
      </CodeBlockHeader>}
      <SyntaxHighlighter
        useInlineStyles={true}
        codeTagProps={{ style: {} }}
        style={theme === 'dark' ? vscodeDarkPlus : oneLight}
        language={language}
      >
        {contents}
      </SyntaxHighlighter>
    </CodeBlockWrapper>
  )
}
