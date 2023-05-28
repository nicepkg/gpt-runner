import type { FC } from 'react'
import { useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { IconButton } from '../icon-button'
import { CodeBlockHeader, CodeBlockWrapper } from './chat-message-code-block.styles'

export interface MessageCodeBlockProps {
  contents: string
  language: string
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = (props) => {
  const { contents, language } = props

  const handleCopyAction = useCallback(() => {
    navigator.clipboard.writeText(contents)
  }, [contents])

  const handleInsertCodeSnippetAction = useCallback(async () => {

  }, [contents])

  const handleDiffAction = useCallback(async () => {
  }, [contents])

  return (
    <CodeBlockWrapper>
      <CodeBlockHeader>
        <IconButton
          text='Copy'
          iconClassName='codicon-copy'
          onClick={handleCopyAction}
        >
        </IconButton>

        <IconButton
          style={{
            marginLeft: '0.5rem',
          }}
          text='Insert'
          iconClassName='codicon-insert'
          onClick={handleInsertCodeSnippetAction}
        >
        </IconButton>

        <IconButton
          style={{
            marginLeft: '0.5rem',
          }}
          text='Diff'
          iconClassName='codicon-arrow-swap'
          onClick={handleDiffAction}
        >
        </IconButton>
      </CodeBlockHeader>
      <SyntaxHighlighter
        useInlineStyles={true}
        codeTagProps={{ style: {} }}
        style={vscDarkPlus}
        language={language}
      >
        {contents}
      </SyntaxHighlighter>
    </CodeBlockWrapper>
  )
}
