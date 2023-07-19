import type child_process from 'child_process'
import { getPort } from '@nicepkg/gpt-runner-shared/node'
import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import waitPort from 'wait-port'
import { toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import type { ContextLoader } from '../contextLoader'
import { Commands } from '../constant'
import { state } from '../state'
import { getExtConfiguration } from '../utils'

export async function registerServer(
  cwd: string,
  contextLoader: ContextLoader,
  ext: ExtensionContext,
) {
  let serverDisposable: Disposable
  let serverProcess: child_process.ChildProcessWithoutNullStreams

  const dispose = () => {
    serverProcess?.kill?.()
    serverDisposable?.dispose?.()
  }

  const registerProvider = () => {
    dispose()

    serverDisposable = vscode.commands.registerCommand(Commands.RestartServer, async () => {
      serverProcess?.kill?.()

      const { extensionUri } = ext
      const serverUri = vscode.Uri.joinPath(extensionUri, './dist/web/server.cjs')
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const { startServer } = require(serverUri.fsPath)
      const extConfig = getExtConfiguration()

      // always get a random free port
      const finalPort = await getPort({
        autoFreePort: true,
        excludePorts: [3003, 3006, ...extConfig.excludePorts],
      })

      process.env.GPTR_DEFAULT_ROOT_PATH = toUnixPath(cwd)

      await startServer({
        port: finalPort,
        autoFreePort: false,
        clientDistPath: vscode.Uri.joinPath(extensionUri, './dist/web/browser').fsPath,
      })

      await waitPort({
        port: finalPort,
        output: 'silent',
      })

      state.serverPort = finalPort
    })

    return serverDisposable
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
