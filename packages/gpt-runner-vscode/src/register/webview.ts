import fs from 'fs'
import path from 'path'
import type { ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import * as uuid from 'uuid'
import type { ContextLoader } from '../contextLoader'
import { Commands, EXT_DISPLAY_NAME, EXT_NAME } from '../constant'
import { createHash, getServerBaseUrl } from '../utils'
import { state } from '../state'
import { EventType, emitter } from '../emitter'
import { log } from '../log'

class ChatViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = `${EXT_NAME}.chatView`

  #view?: vscode.WebviewView
  #extContext: ExtensionContext
  #projectPath: string

  constructor(
    extContext: ExtensionContext,
    projectPath: string,
  ) {
    this.#extContext = extContext
    this.#projectPath = projectPath
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this.#view = webviewView
    state.sidebarWebviewView = webviewView

    ChatViewProvider.updateWebview(webviewView.webview, this.#extContext, this.#projectPath)
  }

  static createWebviewPanel(extContext: ExtensionContext, projectPath: string): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      uuid.v4(),
      EXT_DISPLAY_NAME,
      {
        viewColumn: vscode.ViewColumn.Two,
        preserveFocus: true,
      },
      { retainContextWhenHidden: true },
    )
    panel.iconPath = vscode.Uri.joinPath(extContext.extensionUri, './res/logo.svg')

    panel.onDidDispose(() => {
      state.webviewPanels.delete(panel)
    })

    state.webviewPanels.add(panel)

    ChatViewProvider.updateWebview(panel.webview, extContext, projectPath)

    return panel
  }

  static updateWebview(webview: vscode.Webview, extContext: ExtensionContext, projectPath: string) {
    const { extensionUri } = extContext

    webview.onDidReceiveMessage(({ eventName, eventData }) => {
      emitter.emit(eventName, eventData, EventType.ReceiveMessage)
    })

    const baseUri = vscode.Uri.joinPath(extensionUri, './node_modules/@nicepkg/gpt-runner-web/dist/browser')

    webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [baseUri],
    }

    webview.html = ChatViewProvider.getHtmlForWebview(webview, extContext, projectPath)
  }

  static getHtmlForWebview(webview: vscode.Webview, extContext: ExtensionContext, projectPath: string) {
    const { extensionUri } = extContext

    const baseUri = vscode.Uri.joinPath(extensionUri, './node_modules/@nicepkg/gpt-runner-web/dist/browser')

    webview.options = {
      enableScripts: true,
      localResourceRoots: [baseUri],
    }

    const indexHtml = fs.readFileSync(path.join(baseUri.fsPath, 'index.html'), 'utf8')
    const nonce = createHash()

    const indexHtmlWithBaseUri = indexHtml.replace(
      /\s+(href|src)="(.+?)"/g,
      (_, attr, url) => ` ${attr}="${webview.asWebviewUri(vscode.Uri.joinPath(baseUri, url))}"`,
    ).replace(/\/\/\s*before-script/g, `
      window.vscode = acquireVsCodeApi()

      window.__GLOBAL_CONFIG__ = {
        rootPath: '${projectPath.replace(/\\/g, '/')}',
        serverBaseUrl: '${getServerBaseUrl()}',
        initialRoutePath: '/chat',
        showDiffCodesBtn: true,
        showInsertCodesBtn: true,
      }

      window.addEventListener('message', event => {
        const message = event.data || {}; // The JSON data our extension sent
        const {eventName, eventData} = message
        window.__emitter__.emit(eventName, eventData, "${EventType.ReceiveMessage}")
      })

      oldEmit = window.__emitter__.emit
      window.__emitter__.emit = function (...args) {
        const [eventName, eventData, type] = args
        if (type !== "${EventType.ReceiveMessage}") {
          vscode.postMessage({eventName, eventData})
        }
        return oldEmit.apply(this, args)
      }
    `).replace(/<script\s*([\w\W]+)?>/g,
      (_, attr) => `<script ${attr} nonce="${nonce}">`,
    )

    log.appendLine(`indexHtmlWithBaseUri:\n${indexHtmlWithBaseUri}`)

    return indexHtmlWithBaseUri
  }
}

export async function registerWebview(
  cwd: string,
  contextLoader: ContextLoader,
  ext: ExtensionContext,
) {
  const provider = new ChatViewProvider(ext, cwd)
  let sidebarWebviewDisposer: vscode.Disposable | undefined
  let webviewPanelDisposer: vscode.Disposable | undefined

  const dispose = () => {
    sidebarWebviewDisposer?.dispose?.()
    webviewPanelDisposer?.dispose?.()
  }

  const registerProvider = () => {
    dispose()

    sidebarWebviewDisposer = vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, provider)
    webviewPanelDisposer = vscode.commands.registerCommand(Commands.OpenChat, () => {
      if (vscode.window.activeTextEditor)
        state.activeEditor = vscode.window.activeTextEditor

      ChatViewProvider.createWebviewPanel(ext, cwd)
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
