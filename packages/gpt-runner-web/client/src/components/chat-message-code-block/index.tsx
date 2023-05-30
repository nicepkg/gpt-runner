import type { FC } from 'react'
import { useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { IconButton } from '../icon-button'
import { CodeBlockHeader, CodeBlockWrapper } from './chat-message-code-block.styles'

export interface MessageCodeBlockProps {
  contents: string
  language: string
  onCopyCode?: (value: string) => void
  onInsertCode?: (value: string) => void
  onDiffCode?: (value: string) => void
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = (props) => {
  const { contents, language, onCopyCode, onInsertCode, onDiffCode } = props

  const handleCopyCode = useCallback(() => {
    onCopyCode?.(contents)
  }, [contents, onCopyCode])

  const handleInsertCode = useCallback(() => {
    onInsertCode?.(contents)
  }, [contents, onInsertCode])

  const handleDiffCode = useCallback(() => {
    onDiffCode?.(contents)
  }, [contents, onDiffCode])

  return (
    <CodeBlockWrapper>
      <CodeBlockHeader>
        <IconButton
          text='Copy'
          iconClassName='codicon-copy'
          onClick={handleCopyCode}
        >
        </IconButton>

        <IconButton
          text='Insert'
          iconClassName='codicon-insert'
          onClick={handleInsertCode}
        >
        </IconButton>

        <IconButton
          text='Diff'
          iconClassName='codicon-arrow-swap'
          onClick={handleDiffCode}
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
