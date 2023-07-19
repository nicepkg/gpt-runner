import * as vscode from 'vscode'
import { getLocalHostname } from '@nicepkg/gpt-runner-shared/node'
import { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import { EXT_NAME } from './constant'
import { state } from './state'

export function getOpenedTab(uri: vscode.Uri): vscode.Tab | null {
  const targetUriString = uri.toString()
  const tabGroups = vscode.window.tabGroups
  for (const tabGroup of tabGroups.all) {
    for (const tab of tabGroup.tabs) {
      const tabInput = tab.input
      if (!(tabInput instanceof vscode.TabInputTextDiff))
        continue

      if (tabInput.modified.toString() === targetUriString)
        return tab
    }
  }

  return null
}

export interface ExtensionConfiguration {
  disabled: boolean
  excludePorts: number[]
}

export function getExtConfiguration(): ExtensionConfiguration {
  const config = vscode.workspace.getConfiguration(EXT_NAME)
  const disabled = config.get<boolean>('disable', false)
  const excludePortsStr = config.get<string>('excludePorts', '')
  const excludePorts = excludePortsStr.split(/[\,，]/).map(port => Number(port?.trim()))

  return {
    disabled,
    excludePorts,
  }
}

export function createHash() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

export function getServerBaseUrl(localIp = false) {
  const hostname = localIp ? getLocalHostname() : 'localhost'
  return `http://${hostname}:${state.serverPort || 3003}`
}

export function getLang(): LocaleLang {
  const vscodeLang = vscode.env.language
  const vscodeToMyLangMap: Map<string, LocaleLang> = new Map([
    ['en-US', LocaleLang.English],
    ['zh-CN', LocaleLang.ChineseSimplified],
    ['zh-TW', LocaleLang.ChineseTraditional],
    ['zh-HK', LocaleLang.ChineseTraditional],
    ['ja', LocaleLang.Japanese],
    ['de', LocaleLang.German],
  ])

  return vscodeToMyLangMap.get(vscodeLang) || LocaleLang.English
}

export function docIsFile(doc: vscode.TextDocument | null | undefined) {
  return doc?.uri?.scheme === 'file'
}

export async function openFileInNewTab(filePath: string) {
  try {
    // to vscode uri
    const uri = vscode.Uri.file(filePath)

    // open file in new tab
    const document = await vscode.workspace.openTextDocument(uri)

    // show file in new tab
    await vscode.window.showTextDocument(document)
  }
  catch (error) {
    console.error('Error opening file:', error)
  }
}
