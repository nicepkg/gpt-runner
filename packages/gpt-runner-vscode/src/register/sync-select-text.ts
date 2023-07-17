import * as vscode from 'vscode'
import { ClientEventName, debounce } from '@nicepkg/gpt-runner-shared/common'
import type { ContextLoader } from '../contextLoader'
import { state } from '../state'
import { emitter } from '../emitter'
import { Commands } from '../constant'

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

    disposes.push(vscode.commands.registerCommand(Commands.AskSelection, async () => {
      if (vscode.window.activeTextEditor)
        state.activeEditor = vscode.window.activeTextEditor

      const selectText = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor.selection)
      if (!selectText)
        return

      const handleSidebarOpenAndInit = () => {
        // focus
        state.sidebarWebviewView?.show(true)

        // send selectText to webview
        emitter.emit(ClientEventName.UpdateUserSelectedText, {
          text: selectText,
          insertInputPrompt: true,
        })
      }

      // open sidebar webview when it's not open
      if (!state.sidebarWebviewView?.visible) {
        await vscode.commands.executeCommand('gpt-runner.chatView.focus')
        state.sidebarWebviewView?.webview.onDidReceiveMessage(({ eventName }: { eventName: ClientEventName }) => {
          if (eventName === ClientEventName.InitSuccess)
            handleSidebarOpenAndInit()
        })
      }
      else {
        handleSidebarOpenAndInit()
      }
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
