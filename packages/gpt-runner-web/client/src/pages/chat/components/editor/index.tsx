import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react'
import MonacoEditor from '@monaco-editor/react'
import type { FC } from 'react'
import { memo } from 'react'
import { isDarkTheme } from '../../../../styles/themes'
import { useGlobalStore } from '../../../../store/zustand/global'

export interface EditorProps extends MonacoEditorProps {
  filePath?: string
}

export const Editor: FC<EditorProps> = memo((props) => {
  const { filePath, ...otherProps } = props
  const fileExt = filePath?.split('.')?.pop()
  const extLanguageMap: Record<string, string> = {
    js: 'javascript',
    cjs: 'javascript',
    mjs: 'javascript',
    ts: 'typescript',
    mts: 'typescript',
    jsx: 'javascriptreact',
    tsx: 'typescriptreact',
    py: 'python',
    md: 'markdown',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
  }
  const language = extLanguageMap[fileExt ?? ''] || otherProps?.defaultLanguage || 'javascript'

  const {
    themeName,
  } = useGlobalStore()
  const isDark = isDarkTheme(themeName)

  return (
    <MonacoEditor
      height="100%"
      width="100%"
      language={language}
      theme={isDark ? 'vs-dark' : 'light'}
      {...otherProps}
    />
  )
})
