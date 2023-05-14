import * as React from 'react'
import { useCallback } from 'react'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useEventEmitter } from '../../hooks/use-emitter.hook'
import { ClientEventName } from '../../../../index'

export interface MessageCodeBlockProps {
  contents: string
  language: string
}

export function MessageCodeBlock(props: MessageCodeBlockProps) {
  const { contents, language } = props
  const { emit } = useEventEmitter()

  const handleCopyAction = useCallback(() => {
    navigator.clipboard.writeText(contents)
  }, [contents])

  const handleInsertCodeSnippetAction = useCallback(async () => {
    emit(ClientEventName.InsertCodeSnippet, contents)
  }, [contents])

  return (
    <>
      <div className="chat-msg-block-toolbar">
        <VSCodeButton
          appearance="icon"
          ariaLabel="Copy"
          title="Copy"
          onClick={handleCopyAction}
        >
          <span className="codicon codicon-copy"></span>
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          ariaLabel="Insert or Replace"
          title="Insert or Replace"
          onClick={handleInsertCodeSnippetAction}
        >
          <span className="codicon codicon-insert"></span>
        </VSCodeButton>
      </div>
      <SyntaxHighlighter
        useInlineStyles={false}
        codeTagProps={{ style: {} }}
        language={language}
      >
        {contents}
      </SyntaxHighlighter>
    </>
  )
}
