import type { Monaco } from '@monaco-editor/react'
import type { MonacoEditorInstance } from '../../../../types/monaco-editor'

export function createSwitchLanguageCommand(monaco: Monaco | undefined, editor: MonacoEditorInstance | undefined, extMapLanguage: Record<string, string >, callback?: (language: string) => void) {
  if (!monaco || !editor)
    return () => {}

  const dispose = monaco.editor.registerCommand('switchLanguage', (_get, params: { ext?: string }) => {
    const { ext = '' } = params || {}

    if (!monaco)
      return

    const language = extMapLanguage[ext]

    if (!language)
      return

    const currentModel = editor?.getModel()

    if (!currentModel)
      return

    // set language
    monaco.editor.setModelLanguage(currentModel, language)

    callback?.(language)
  })

  return () => dispose.dispose()
}
