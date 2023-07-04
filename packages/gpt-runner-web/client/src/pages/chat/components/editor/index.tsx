import type { Monaco, EditorProps as MonacoEditorProps } from '@monaco-editor/react'
import MonacoEditor, { loader } from '@monaco-editor/react'
import type { FC } from 'react'
import { memo, useCallback, useMemo, useRef } from 'react'
import { isDarkTheme } from '../../../../styles/themes'
import { useGlobalStore } from '../../../../store/zustand/global'
import { BASE_URL } from '../../../../helpers/constant'
import type { MonacoEditorInstance } from '../../../../types/monaco-editor'

loader.config({
  paths: {
    vs: `${BASE_URL}/monaco-editor-vs`,
  },
})

export interface EditorProps extends MonacoEditorProps {
  filePath?: string
}

export const Editor: FC<EditorProps> = memo((props) => {
  const { filePath, ...otherProps } = props

  const monacoRef = useRef<Monaco>()
  const fileExt = filePath?.split('.')?.pop()
  const DEFAULT_LANGUAGE = 'markdown'

  const monacoLanguages = useMemo(() => {
    const languages = monacoRef.current?.languages.getLanguages() || []
    return languages
  }, [monacoRef.current])

  // current ext lang
  const currentExtLanguage = useMemo(() => {
    const extLanguage = monacoLanguages.find(lang => lang.extensions?.includes(`.${fileExt}`))
    return extLanguage?.id
  }, [monacoLanguages, fileExt])

  const defaultLanguage = otherProps?.defaultLanguage || DEFAULT_LANGUAGE
  const language = currentExtLanguage || defaultLanguage

  const {
    themeName,
  } = useGlobalStore()
  const isDark = isDarkTheme(themeName)

  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    // here is the monaco instance
    // do something before editor is mounted
    monacoRef.current = monaco
  }, [])

  const handleEditorDidMount = useCallback((editor: MonacoEditorInstance, monaco: Monaco) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
  }, [])

  return (
    <MonacoEditor
      height="100%"
      width="100%"
      language={language}
      theme={isDark ? 'vs-dark' : 'light'}
      {...otherProps}
      defaultLanguage={defaultLanguage}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
    />
  )
})
