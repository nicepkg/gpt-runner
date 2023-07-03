import * as vscode from 'vscode'
import { ClientEventName, debounce, toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import { VscodeEventName, emitter } from '../emitter'
import type { ContextLoader } from '../contextLoader'
import { state } from '../state'
import { docIsFile } from '../utils'

export async function registerSyncOpeningFilePaths(
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

    function updateOpenFiles() {
      const filePaths = vscode.workspace.textDocuments
        .filter(doc => docIsFile(doc))
        .map(doc => doc.uri.fsPath)

      state.openingFilePaths = [...new Set(filePaths)].map(filePath => toUnixPath(filePath))

      emitter.emit(ClientEventName.UpdateIdeOpeningFiles, {
        filePaths: state.openingFilePaths,
      })
    }

    const debounceUpdateOpenFiles = debounce(updateOpenFiles, debounceTime)

    function updateActiveFile() {
      const maybeActiveDocs: (vscode.TextDocument | undefined)[] = [
        vscode.window.activeTextEditor?.document,
        state.activeEditor?.document,
        // ...vscode.window.visibleTextEditors.map(editor => editor.document),
      ]

      state.activeFilePath = toUnixPath(maybeActiveDocs.find(doc => docIsFile(doc))?.uri.fsPath ?? '')

      emitter.emit(ClientEventName.UpdateIdeActiveFilePath, {
        filePath: state.activeFilePath,
      })
    }

    const debounceUpdateActiveFile = debounce(updateActiveFile, debounceTime)

    disposes.push(vscode.workspace.onDidOpenTextDocument(() => {
      debounceUpdateOpenFiles()
    }))

    disposes.push(vscode.workspace.onDidCloseTextDocument(() => {
      debounceUpdateOpenFiles()
    }))

    disposes.push(vscode.window.onDidChangeVisibleTextEditors(() => {
      debounceUpdateActiveFile()
    }))

    // FIXME: fix some file path is lost when vscode is activated
    // update files when vscode is activated
    debounceUpdateOpenFiles()
    debounceUpdateActiveFile()

    // for webview
    emitter.on(VscodeEventName.VscodeUpdateOpeningFilePaths, () => {
      debounceUpdateActiveFile()
      debounceUpdateOpenFiles()
    })

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
