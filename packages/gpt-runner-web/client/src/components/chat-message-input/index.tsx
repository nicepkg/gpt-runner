import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Monaco } from '@monaco-editor/react'
import { useTranslation } from 'react-i18next'
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
  logoProps?: React.ComponentProps<typeof StyledLogo>
}
export const ChatMessageInput: FC<ChatMessageInputProps> = memo((props) => {
  const { value = '', toolbarSlot, showTopLogo = false, showBottomLogo = false, logoProps, onChange, onSendMessage } = props

  const { t } = useTranslation()
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
    monacoRef.current = monaco
    monacoEditorRef.current = editor
  }, [])

  // add action
  useEffect(() => {
    if (!monacoRef.current || !monacoEditorRef.current)
      return

    // send message when user press ctrl+enter
    const sendMessageActionDispose = monacoEditorRef.current.addAction({
      id: 'send-message',
      label: 'Control+Enter Action Send Message',
      keybindings: [
        // Ctrl+Enter / Cmd+Enter
        monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Enter,
        monacoRef.current.KeyMod.WinCtrl | monacoRef.current.KeyCode.Enter,
      ],
      run() {
        if (!currentValue.current.trim())
          return
        onSendMessage?.()
      },
    })

    return () => {
      sendMessageActionDispose.dispose()
    }
  }, [onSendMessage, monacoRef.current, monacoEditorRef.current])

  useEffect(() => {
    if (!monacoRef.current || !currentLanguage)
      return

    // when user input .xxx,
    // and show suggestion,
    // when user click suggestion,
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
              const title = `${t('chat_page.monaco_switch_language_tips')}: ${extMapLanguage[ext]}`

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
  }, [t, currentLanguage, extMapLanguage, monacoRef.current, monacoEditorRef.current])

  const handleChange = useCallback((value: string | undefined) => {
    currentValue.current = value || ''
    onChange(currentValue.current)
  }, [onChange])

  return <Wrapper style={{
    paddingBottom: showBottomLogo ? 'unset' : '0.5rem',
  }}>
    <ToolbarWrapper>
      {toolbarSlot}

      {showTopLogo && <LogoWrapper>
        <StyledLogo color={'var(--panel-tab-foreground)'} {...logoProps} ></StyledLogo>
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
      <StyledLogo color={'var(--focus-border)'} {...logoProps}></StyledLogo>
    </LogoWrapper>}
  </Wrapper>
})

ChatMessageInput.displayName = 'ChatMessageInput'
