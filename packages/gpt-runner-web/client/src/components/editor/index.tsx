import type { Monaco, EditorProps as MonacoEditorProps } from '@monaco-editor/react'
import MonacoEditor, { loader } from '@monaco-editor/react'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import * as monaco from 'monaco-editor'
import type { MonacoEditorInstance } from '../../types/monaco-editor'
import { useGlobalStore } from '../../store/zustand/global'
import { isDarkTheme } from '../../styles/themes'
import { initTsLanguageSettings } from './monaco/init-ts-settings'

loader.config({
  monaco,
})

export enum EditorCommand {
  SwitchLanguage = 'switchLanguage',
}

export interface EditorProps extends MonacoEditorProps {
  filePath?: string
  onLanguageChange?: (language: string) => void
}

export const Editor: FC<EditorProps> = memo((props) => {
  const { filePath, onLanguageChange, beforeMount, onMount, defaultLanguage: defaultLanguageFromProps, language: languageFromProps, options, ...otherProps } = props
  const monacoRef = useRef<Monaco>()
  const monacoEditorRef = useRef<MonacoEditorInstance>()
  const fileExt = filePath?.split('.')?.pop()
  const DEFAULT_LANGUAGE = 'markdown'

  // const { i18n } = useTranslation()
  // const monacoLocaleLang = useMemo(() => {
  //   const currentI18nLang = i18n.language as LocaleLang
  //   const i18nLangMonacoLangMap: Record<LocaleLang, string> = {
  //     [LocaleLang.English]: 'en',
  //     [LocaleLang.ChineseSimplified]: 'zh-cn',
  //     [LocaleLang.ChineseTraditional]: 'zh-tw',
  //     [LocaleLang.Japanese]: 'ja',
  //     [LocaleLang.German]: 'de',
  //   }

  //   return i18nLangMonacoLangMap[currentI18nLang]
  // }, [i18n.language])

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

  // current ext lang
  const currentExtLanguage = useMemo(() => {
    const extLanguage = extMapLanguage[`.${fileExt}`]
    return extLanguage
  }, [extMapLanguage, fileExt])

  const defaultLanguage = defaultLanguageFromProps || DEFAULT_LANGUAGE
  const language = languageFromProps || currentExtLanguage || defaultLanguage

  const {
    themeName,
  } = useGlobalStore()
  const isDark = isDarkTheme(themeName)

  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    // here is the monaco instance
    // do something before editor is mounted

    monacoRef.current = monaco

    beforeMount?.(monaco)
  }, [])

  const handleEditorDidMount = useCallback((editor: MonacoEditorInstance, monaco: Monaco) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage

    initTsLanguageSettings(monaco)

    monacoEditorRef.current = editor
    onMount?.(editor, monaco)
  }, [])

  // register command
  useEffect(() => {
    if (!monacoRef.current)
      return

    const commandDispose = monacoRef.current.editor.registerCommand('switchLanguage', (_get, params: { ext?: string }) => {
      const { ext = '' } = params || {}

      if (!monacoRef.current)
        return

      const language = extMapLanguage[ext]

      if (!language)
        return

      const currentModel = monacoEditorRef.current?.getModel()

      if (!currentModel)
        return

      // set language
      monacoRef.current.editor.setModelLanguage(currentModel, language)

      onLanguageChange?.(language)
    })

    return () => {
      commandDispose?.dispose()
    }
  }, [monacoRef.current, monacoEditorRef.current, extMapLanguage, onLanguageChange])

  return (
    <MonacoEditor
      height="100%"
      width="100%"
      language={language}
      theme={isDark ? 'vs-dark' : 'light'}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      {...otherProps}

      options={{
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        parameterHints: {
          enabled: true,
        },
        minimap: {
          enabled: false,
        },
        suggestOnTriggerCharacters: true,
        fixedOverflowWidgets: true,
        ...options,
      }}
    />
  )
})
