import * as vscode from 'vscode'
import { ClientEventName, debounce } from '@nicepkg/gpt-runner-shared/common'
import type { ContextLoader } from '../contextLoader'
import { state } from '../state'
import { emitter } from '../emitter'

export async function registerSyncSelectText(
  cwd: string,
  contextLoader: ContextLoader,
  ext: vscode.ExtensionContext,
) {
  const disposes: vscode.Disposable[] = []

  const dispose = () => {
    disposes.forEach(d => d.dispose())
  }

  const registerProvider = () => {
    dispose()

    const debounceTime = 300

    function updateSelectText(editor: vscode.TextEditor) {
      const selection = editor.selection
      const selectedText = editor.document.getText(selection)
      state.selectedText = selectedText || ''

      emitter.emit(ClientEventName.UpdateUserSelectedText, {
        text: state.selectedText,
      })
    }

    const debounceUpdateSelectText = debounce(updateSelectText, debounceTime)

    disposes.push(vscode.window.onDidChangeTextEditorSelection((e) => {
      const editor = e.textEditor
      debounceUpdateSelectText(editor)
    }))

    return vscode.Disposable.from({
      dispose,
    })
  }

  ext.subscriptions.push(registerProvider())

  contextLoader.emitter.on('contextReload', () => {
    registerProvider()
  })

  contextLoader.emitter.on('contextUnload', () => {
    dispose()
  })
}
