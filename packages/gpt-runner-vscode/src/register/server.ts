import child_process from 'child_process'
import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import type { ContextLoader } from '../contextLoader'
import { EXT_NAME } from '../constant'

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

    serverDisposable = vscode.commands.registerCommand(`${EXT_NAME}.restartServer`, () => {
      serverProcess?.kill?.()

      const { extensionUri } = ext
      const serverUri = vscode.Uri.joinPath(extensionUri, './node_modules/@nicepkg/gpt-runner-web/dist/server.cjs')

      serverProcess = child_process.spawn('node', [serverUri.fsPath], {
        env: {
          ...process.env,
          NODE_OPTIONS: '--experimental-fetch',
          NODE_NO_WARNINGS: '1',
        },
      })

      serverProcess.stdout.on('data', (data: string) => {
        console.log(`stdout: ${data}`)
        vscode.window.showInformationMessage(`Server running: ${data}`)
      })

      serverProcess.stderr.on('data', (data: string) => {
        console.error(`stderr: ${data}`)
        vscode.window.showErrorMessage(`Server error: ${data}`)
      })

      serverProcess.on('close', (code: string) => {
        console.log(`child process exited with code ${code}`)
        vscode.window.showWarningMessage(`Server stopped with code: ${code}`)
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
