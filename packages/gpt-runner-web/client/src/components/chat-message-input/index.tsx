import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Monaco } from '@monaco-editor/react'
import { Editor, EditorCommand } from '../editor'
import type { MonacoEditorInstance } from '../../types/monaco-editor'
import { LogoWrapper, StyledLogo, TextAreaWrapper, ToolbarWrapper, Wrapper } from './chat-message-input.styles'

export interface ChatMessageInputProps {
  value: string
  toolbarSlot?: React.ReactNode
  showTopLogo?: boolean
  showBottomLogo?: boolean
  onChange: (value: string) => void
  onSendMessage?: () => void
}
export const ChatMessageInput: FC<ChatMessageInputProps> = memo((props) => {
  const { value = '', toolbarSlot, showTopLogo = false, showBottomLogo = false, onChange, onSendMessage } = props
  const monacoRef = useRef<Monaco>()
  const monacoEditorRef = useRef<MonacoEditorInstance>()
  const DEFAULT_LANGUAGE = 'markdown'
  const currentValue = useRef(value || '')

  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE)

  const extMapLanguage = useMemo(() => {
    const map: Record<string, string> = {}
    const languages = monacoRef.current?.languages.getLanguages() || []

    languages.forEach((lang) => {
      lang.extensions?.forEach((ext) => {
        map[ext] = lang.id
      })
    })

    return map
  }, [monacoRef.current])

  const handleEditorDidMount = useCallback((editor: MonacoEditorInstance, monaco: Monaco) => {
    // send message when user press ctrl+enter
    editor.addAction({
      id: 'send-message',
      label: 'Control+Enter Action Send Message',
      keybindings: [
        // Ctrl+Enter / Cmd+Enter
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        monaco.KeyMod.WinCtrl | monaco.KeyCode.Enter,
      ],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run() {
        if (!currentValue.current.trim())
          return

        onSendMessage?.()
      },
    })

    monacoRef.current = monaco
    monacoEditorRef.current = editor
  }, [])

  useEffect(() => {
    if (!monacoRef.current || !currentLanguage)
      return

    // when user input >.xxx,
    // match xxx to language,
    // and show suggestion,
    //  when user click suggestion,
    // switch to that language.
    const completionDispose = monacoRef.current.languages.registerCompletionItemProvider(currentLanguage, {
      triggerCharacters: ['.'],
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber)
        const match = lineContent.match(/^\.(\w+)$/)

        if (match) {
          const extLike = match[1]
          const maybeExts = Object.keys(extMapLanguage).filter(ext => ext.startsWith(`.${extLike}`))
          const word = model.getWordAtPosition(position)

          if (!word || !word.word.length)
            return { suggestions: [] }

          return {
            suggestions: maybeExts.map((ext) => {
              const title = `Switch To Language: ${extMapLanguage[ext]}`

              return {
                label: ext,
                insertText: '',
                kind: monacoRef.current!.languages.CompletionItemKind.Keyword,
                detail: title,
                command: {
                  id: EditorCommand.SwitchLanguage,
                  title,
                  arguments: [{
                    ext,
                  }],
                },
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn - 1,
                  endColumn: word.endColumn,
                },
              }
            }),
          }
        }

        return { suggestions: [] }
      },
    })

    return () => {
      completionDispose.dispose()
    }
  }, [currentLanguage, extMapLanguage, monacoRef.current, monacoEditorRef.current])

  const handleChange = useCallback((value: string | undefined) => {
    currentValue.current = value || ''

    onChange(currentValue.current)
  }, [])

  return <Wrapper style={{
    paddingBottom: showBottomLogo ? 'unset' : '0.5rem',
  }}>
    <ToolbarWrapper>
      {toolbarSlot}

      {showTopLogo && <LogoWrapper>
        <StyledLogo color={'var(--panel-tab-foreground)'}></StyledLogo>
      </LogoWrapper>}
    </ToolbarWrapper>

    <TextAreaWrapper>
      <Editor
        className='chat-input-editor'
        language={currentLanguage}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        onLanguageChange={setCurrentLanguage}
        options={{
          lineNumbers: 'off',
          wordWrap: 'on',
          contextmenu: false,
        }}
      ></Editor>
    </TextAreaWrapper>

    {showBottomLogo && <LogoWrapper style={{ position: 'static' }}>
      <StyledLogo color={'var(--panel-tab-foreground)'}></StyledLogo>
    </LogoWrapper>}
  </Wrapper>
})

ChatMessageInput.displayName = 'ChatMessageInput'
