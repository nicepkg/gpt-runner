import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import type { ContextLoader } from '../contextLoader'
import { Commands } from '../constant'
import { state } from '../state'

export async function registerInsertCodes(
  cwd: string,
  contextLoader: ContextLoader,
  ext: ExtensionContext,
) {
  let disposable: Disposable

  const dispose = () => {
    disposable?.dispose?.()
  }

  const registerProvider = () => {
    dispose()

    disposable = vscode.commands.registerCommand(Commands.InsertCodes, () => {
      if (vscode.window.activeTextEditor)
        state.activeEditor = vscode.window.activeTextEditor

      const editor = state.activeEditor

      if (editor) {
        editor.selections.forEach((selection) => {
          const text = state.insertCodes
          editor.edit((edit) => {
            edit.replace(selection, text) // insert at current cursor
          })
        })
      }
    })

    return disposable
  }

  ext.subscriptions.push(
    registerProvider(),
  )

  contextLoader.emitter.on('contextReload', () => {
    registerProvider()
  })
  contextLoader.emitter.on('contextUnload', () => {
    dispose()
  })
}
