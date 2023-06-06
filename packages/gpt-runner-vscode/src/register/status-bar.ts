import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import type { ContextLoader } from '../contextLoader'
import { state } from '../state'
import { Commands, EXT_DISPLAY_NAME } from '../constant'

export async function registerStatusBar(
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

    disposable = state.statusBarItem = vscode.window
      .createStatusBarItem(vscode.StatusBarAlignment.Right, 100)

    state.statusBarItem.text = `$(rocket) ${EXT_DISPLAY_NAME}`
    state.statusBarItem.tooltip = 'Click to open GPT Runner in browser'
    state.statusBarItem.command = Commands.OpenInBrowser
    state.statusBarItem.show()

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
