import type { Monaco, EditorProps as MonacoEditorProps } from '@monaco-editor/react'
import MonacoEditor, { loader } from '@monaco-editor/react'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'
import type { MonacoEditorInstance } from '../../types/monaco-editor'
import { useGlobalStore } from '../../store/zustand/global'
import { isDarkTheme } from '../../styles/themes'
import { initLanguageSettings } from './monaco/init-languages-settings'
import { createSwitchLanguageCommand } from './monaco/commands/switch-language'
import { createCtrlSToSaveAction } from './monaco/actions/ctrls-to-save'

loader.config({
  monaco,
})

export enum EditorCommand {
  SwitchLanguage = 'switchLanguage',
}

export interface EditorProps extends MonacoEditorProps {
  filePath?: string
  onLanguageChange?: (language: string) => void
  onSave?: () => void
}

export const Editor: FC<EditorProps> = memo((props) => {
  const { filePath, onLanguageChange, onSave, beforeMount, onMount, defaultLanguage: defaultLanguageFromProps, language: languageFromProps, options, ...otherProps } = props
  const monacoRef = useRef<Monaco>()
  const [_, setForceUpdate] = useState(0)
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

    // fix monaco editor not update when first render
    setForceUpdate(prev => prev + 1)
  }, [])

  const handleEditorDidMount = useCallback((editor: MonacoEditorInstance, monaco: Monaco) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage

    initLanguageSettings(monaco)

    monacoEditorRef.current = editor
    onMount?.(editor, monaco)

    // fix monaco editor not update when first render
    setForceUpdate(prev => prev + 1)
  }, [])

  // register command
  useEffect(() => {
    const disposes: (() => void)[] = [
      createSwitchLanguageCommand(monacoRef.current, monacoEditorRef.current, extMapLanguage, onLanguageChange),
    ]

    return () => {
      disposes.forEach(dispose => dispose())
    }
  }, [monacoRef.current, monacoEditorRef.current, extMapLanguage, onLanguageChange])

  // add action
  useEffect(() => {
    const disposes: (() => void)[] = [
      createCtrlSToSaveAction(monacoRef.current, monacoEditorRef.current, onSave),
    ]

    return () => {
      disposes.forEach(dispose => dispose())
    }
  }, [monacoRef.current, monacoEditorRef.current, onSave])

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
