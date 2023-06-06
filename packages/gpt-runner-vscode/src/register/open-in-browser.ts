import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import { openInBrowser } from '@nicepkg/gpt-runner-shared/node'
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

    disposable = vscode.commands.registerCommand(Commands.OpenInBrowser, () => {
      openInBrowser({
        url: `${getServerBaseUrl()}/#/chat?rootPath=${cwd}`,
      })
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
