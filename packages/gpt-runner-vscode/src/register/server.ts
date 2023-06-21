import child_process from 'child_process'
import { getPort } from '@nicepkg/gpt-runner-shared/node'
import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import type { ContextLoader } from '../contextLoader'
import { Commands } from '../constant'
import { log } from '../log'
import { state } from '../state'

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
      const serverUri = vscode.Uri.joinPath(extensionUri, './dist/web/start-server.cjs')

      // always get a random free port
      const finalPort = await getPort({
        autoFreePort: true,
      })

      state.serverPort = finalPort

      serverProcess = child_process.spawn('node', [
        serverUri.fsPath,
        '--port',
        String(finalPort),
        '--client-dist-path',
        vscode.Uri.joinPath(extensionUri, './dist/web/browser').fsPath,
      ], {
        env: {
          ...process.env,
          NODE_OPTIONS: '--experimental-fetch',
          NODE_NO_WARNINGS: '1',
          DEBUG: 'enabled',
        },
      })

      serverProcess.stdout.on('data', (data: string) => {
        log.appendLine(`stdout: ${data}`)
      })

      serverProcess.stderr.on('data', (data: string) => {
        log.appendLine(`stderr: ${data}`)
      })

      serverProcess.on('close', (code: string) => {
        log.appendLine(`child process exited with code ${code}`)
      })
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
