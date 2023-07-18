import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import { openInBrowser } from '@nicepkg/gpt-runner-shared/node'
import { toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import type { ContextLoader } from '../contextLoader'
import { Commands } from '../constant'
import { getServerBaseUrl } from '../utils'

export async function registerOpenInBrowser(
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

    process.env.GPTR_DEFAULT_ROOT_PATH = toUnixPath(cwd)
    disposable = vscode.commands.registerCommand(Commands.OpenInBrowser, async () => {
      const options: string[] = [
        getServerBaseUrl(false),
        getServerBaseUrl(true),
      ]

      const selectResult = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select an option',
      })

      if (selectResult) {
        openInBrowser({
          url: selectResult,
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
