import type { Monaco } from '@monaco-editor/react'
import type { MonacoEditorInstance } from '../../../../types/monaco-editor'

export function createCtrlSToSaveAction(monaco: Monaco | undefined, editor: MonacoEditorInstance | undefined, callback?: () => void) {
  if (!monaco || !editor)
    return () => {}

  const dispose = editor.addAction({
    id: 'save-content',
    label: 'Control+S / Command+S to save content',
    keybindings: [
      // Ctrl+S / Cmd+S
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyS,
    ],
    run() {
      callback?.()
    },
  })

  return () => dispose.dispose()
}
