import type { Disposable, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import type { ContextLoader } from '../contextLoader'
import { Commands, URI_SCHEME } from '../constant'
import { state } from '../state'

interface DiffCodesInfo {
  id: string
  originalContents: string
  contents: string
}

const DIFF_ORIG = 'orig'
const DIFF_NEW = 'new'
function createDiffUri(docId: string, orig = false): vscode.Uri {
  return vscode.Uri.parse(`${URI_SCHEME}:${orig ? DIFF_ORIG : DIFF_NEW}?${docId}`)
}

export class DiffCodesProvider implements vscode.TextDocumentContentProvider {
  documents: Map<string, DiffCodesInfo> = new Map()
  currentId = 0
  static _instance?: DiffCodesProvider

  static getInstance(): DiffCodesProvider {
    if (!DiffCodesProvider._instance)
      DiffCodesProvider._instance = new DiffCodesProvider()

    return DiffCodesProvider._instance
  }

  registerTextDocumentContentProvider(): vscode.Disposable {
    return vscode.workspace.registerTextDocumentContentProvider(
      URI_SCHEME,
      this,
    )
  }

  addDiffCodesInfo(diffCodesInfo: Omit<DiffCodesInfo, 'id'>): string {
    ++this.currentId

    const docId = `${this.currentId}`
    this.documents.set(docId, { ...diffCodesInfo, id: docId })

    return docId
  }

  removeDiffCodesInfo(diffCodesInfo: DiffCodesInfo) {
    this.documents.delete(diffCodesInfo.id)
  }

  getDiffCodesInfo(docId: string): DiffCodesInfo | undefined {
    return this.documents.get(docId)
  }

  provideTextDocumentContent(
    uri: vscode.Uri,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<string> {
    const docId = uri.query
    const doc = this.documents.get(docId)
    if (!doc)
      return null

    if (uri.path === DIFF_ORIG)
      return doc.originalContents

    return doc.contents
  }
}

export async function registerDiffCodes(
  cwd: string,
  contextLoader: ContextLoader,
  ext: ExtensionContext,
) {
  let commandDisposable: Disposable
  let diffCodesProviderDisposable: Disposable

  const dispose = () => {
    commandDisposable?.dispose?.()
    diffCodesProviderDisposable?.dispose?.()
  }

  const registerProvider = () => {
    dispose()

    diffCodesProviderDisposable = DiffCodesProvider.getInstance().registerTextDocumentContentProvider()

    commandDisposable = vscode.commands.registerCommand(Commands.DiffCodes, async () => {
      if (vscode.window.activeTextEditor)
        state.activeEditor = vscode.window.activeTextEditor

      const editor = state.activeEditor

      if (!editor)
        return

      const title = 'Your codes ↔ GPT Runner codes'
      const selectionText = editor.document.getText(editor.selection)
      const originalFileContents = editor.document.getText()

      const diffCodesInfoId = DiffCodesProvider.getInstance().addDiffCodesInfo({
        originalContents: selectionText || originalFileContents,
        contents: state.diffCodes,
      })

      const leftUri = createDiffUri(diffCodesInfoId, true)
      const rightUri = createDiffUri(diffCodesInfoId, false)

      await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, title, {
        viewColumn: vscode.ViewColumn.Active,
        preview: true,
      })
    })

    return commandDisposable
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
