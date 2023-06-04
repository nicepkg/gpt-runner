import fs from 'fs'
import path from 'path'
import type { ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import type { ContextLoader } from '../contextLoader'
import { EXT_NAME } from '../constant'
import { createHash } from '../utils'

class ChatViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = `${EXT_NAME}.chatView`

  #view?: vscode.WebviewView
  #extContext: ExtensionContext

  constructor(
    extContext: ExtensionContext,
  ) {
    this.#extContext = extContext
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    const { extensionUri } = this.#extContext
    this.#view = webviewView

    const baseUri = vscode.Uri.joinPath(extensionUri, './node_modules/@nicepkg/gpt-runner-web/dist/browser')

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [baseUri],
    }

    webviewView.webview.html = this.#getHtmlForWebview(webviewView.webview)
  }

  #getHtmlForWebview(webview: vscode.Webview) {
    const { extensionUri } = this.#extContext

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
      window.globalConfig = {
        serverBaseUrl: 'http://localhost:3003',
        initialRoutePath: '/chat'
      }
    `).replace(/<script\s*([\w\W]+)?>/g,
      (_, attr) => `<script ${attr} nonce="${nonce}">`,
    )

    console.log('indexHtmlWithBaseUri', indexHtmlWithBaseUri)

    return indexHtmlWithBaseUri
  }
}

export async function registerWebview(
  cwd: string,
  contextLoader: ContextLoader,
  ext: ExtensionContext,
) {
  const provider = new ChatViewProvider(ext)
  let webviewDisposer: vscode.Disposable | undefined

  const registerProvider = () => {
    webviewDisposer = vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, provider)
    return webviewDisposer
  }

  ext.subscriptions.push(registerProvider())

  contextLoader.emitter.on('contextReload', () => {
    registerProvider()
  })
  contextLoader.emitter.on('contextUnload', () => {
    webviewDisposer?.dispose?.()
  })
}
